'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { obtenerPedidos, cancelarPedido } from '../services/usuarios';
import { Pedido } from '../types';
import Image from 'next/image';

export default function PedidosPage() {
  const { usuario, token, loading } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState<number | null>(null);
  const [error, setError] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (loading) return;

    if (!usuario || !token) {
      router.push('/login');
      return;
    }

    const cargarPedidos = async () => {
      try {
        const datos = await obtenerPedidos(token);
        setPedidos(datos);
      } catch (err) {
        setError('Error al cargar los pedidos');
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, [usuario, token, loading, router]);

  const handleCancelar = async (pedidoId: number) => {
    if (!token) return;

    setCancelando(pedidoId);
    try {
      await cancelarPedido(pedidoId, token);
      // Recargar pedidos
      const datos = await obtenerPedidos(token);
      setPedidos(datos);
    } catch (err) {
      alert('No se pudo cancelar el pedido');
    } finally {
      setCancelando(null);
    }
  };

  if (loading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Compras</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No tienes pedidos aún</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Encabezado del pedido */}
                <div className="bg-gray-100 px-6 py-4 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pedido #</p>
                      <p className="text-lg font-bold text-gray-900">{pedido.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-medium text-gray-900">
                        {new Date(pedido.fecha).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${pedido.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className={`font-medium ${
                        pedido.estado === 'completado'
                          ? 'text-green-600'
                          : pedido.estado === 'pendiente'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Datos del cliente */}
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">{pedido.cliente_nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{pedido.cliente_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{pedido.cliente_telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium">
                        {pedido.cliente_direccion}, {pedido.cliente_ciudad}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="px-6 py-4">
                  <h3 className="font-bold text-gray-900 mb-4">Productos</h3>
                  <div className="space-y-3">
                    {pedido.items.map((item) => (
                      <div
                        key={item.producto_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.titulo}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.cantidad} × ${item.precio_unitario.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ${(item.cantidad * item.precio_unitario).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
                  {pedido.estado === 'pendiente' && (
                    <button
                      onClick={() => handleCancelar(pedido.id)}
                      disabled={cancelando === pedido.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                    >
                      {cancelando === pedido.id ? 'Cancelando...' : 'Cancelar Compra'}
                    </button>
                  )}
                  <Link
                    href={`/pedidos/${pedido.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
