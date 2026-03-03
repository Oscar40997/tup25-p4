'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Checkout() {
  const router = useRouter();
  const { carrito } = useCarrito();
  const { usuario, token } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    cliente_nombre: '',
    cliente_email: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    metodo_pago: 'tarjeta'
  });

  // Inicializar formulario cuando el usuario carga
  useEffect(() => {
    if (usuario) {
      setFormulario({
        cliente_nombre: usuario.nombre || '',
        cliente_email: usuario.email || '',
        direccion: '',
        ciudad: '',
        telefono: '',
        metodo_pago: 'tarjeta'
      });
    }
  }, [usuario]);

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Debes iniciar sesión</h1>
          <p className="text-gray-600 mb-6">Para completar una compra, primero inicia sesión a tu cuenta.</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir a logarme
          </Link>
        </div>
      </div>
    );
  }

  const total = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (carrito.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    if (!token) {
      alert('Debes estar autenticado');
      return;
    }

    setCargando(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/carrito/comprar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formulario,
          items: carrito.items.map(item => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio
          }))
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error al procesar compra: ${error}`);
      }

      await response.json();
      alert('¡Compra realizada exitosamente!');
      router.push(`/pedidos`);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al procesar compra: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirmar Compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Envío</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="cliente_nombre"
                  value={formulario.cliente_nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="cliente_email"
                  value={formulario.cliente_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formulario.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formulario.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Método de Pago</h2>
              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="metodo_pago"
                    value="tarjeta"
                    checked={formulario.metodo_pago === 'tarjeta'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Tarjeta de Crédito</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando || carrito.items.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                cargando || carrito.items.length === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {cargando ? 'Procesando...' : 'Confirmar Compra'}
            </button>
          </form>

          {/* Resumen */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Compra</h2>

            <div className="space-y-2 mb-4">
              {carrito.items.map(item => (
                <div key={item.producto_id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.titulo} x{item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/carrito"
              className="mt-4 block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
