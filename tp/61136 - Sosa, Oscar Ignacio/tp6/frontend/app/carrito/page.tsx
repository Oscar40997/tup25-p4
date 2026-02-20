'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCarrito } from '../context/CarritoContext';
import Image from 'next/image';
import { eliminarDelCarrito, actualizarCantidad, crearPedido } from '../services/carrito';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const { carrito, refrescar } = useCarrito();
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    cliente_direccion: '',
    cliente_ciudad: '',
  });

  const handleEliminar = async (productoId: number) => {
    setCargando(true);
    try {
      await eliminarDelCarrito(productoId);
      await refrescar();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar del carrito');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarCantidad = async (productoId: number, cantidad: number) => {
    if (cantidad < 1) return;
    setCargando(true);
    try {
      await actualizarCantidad(productoId, cantidad);
      await refrescar();
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComprar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      const pedido = {
        ...formData,
        items: carrito.items,
        total: carrito.total,
      };

      const resultado = await crearPedido(pedido);
      alert(
        `¡Pedido creado exitosamente!\nID del pedido: ${resultado.pedido_id}\nTotal: $${resultado.total.toFixed(2)}`
      );
      setFormData({
        cliente_nombre: '',
        cliente_email: '',
        cliente_telefono: '',
        cliente_direccion: '',
        cliente_ciudad: '',
      });
      setMostrarFormulario(false);
      await refrescar();
      router.push('/');
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('Error al crear el pedido');
    } finally {
      setCargando(false);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        {carrito.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Tu carrito está vacío</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Volver a comprar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Subtotal
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.items.map((item) => (
                      <tr key={item.producto_id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0">
                              <Image
                                src={`${API_URL}/${item.imagen}`}
                                alt={item.titulo}
                                width={64}
                                height={64}
                                className="object-contain p-2 w-full h-full"
                                unoptimized
                              />
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.titulo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          ${item.precio.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleActualizarCantidad(
                                  item.producto_id,
                                  item.cantidad - 1
                                )
                              }
                              disabled={cargando}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) =>
                                handleActualizarCantidad(
                                  item.producto_id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              disabled={cargando}
                              className="w-12 text-center border rounded py-1"
                            />
                            <button
                              onClick={() =>
                                handleActualizarCantidad(
                                  item.producto_id,
                                  item.cantidad + 1
                                )
                              }
                              disabled={cargando}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEliminar(item.producto_id)}
                            disabled={cargando}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Resumen de Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${carrito.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${carrito.total.toFixed(2)}</span>
                  </div>
                </div>

                {!mostrarFormulario ? (
                  <button
                    onClick={() => setMostrarFormulario(true)}
                    disabled={cargando}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    Proceder al Pago
                  </button>
                ) : (
                  <form onSubmit={handleComprar} className="space-y-4">
                    <input
                      type="text"
                      name="cliente_nombre"
                      placeholder="Nombre completo"
                      value={formData.cliente_nombre}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="email"
                      name="cliente_email"
                      placeholder="Email"
                      value={formData.cliente_email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="tel"
                      name="cliente_telefono"
                      placeholder="Teléfono"
                      value={formData.cliente_telefono}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      name="cliente_direccion"
                      placeholder="Dirección"
                      value={formData.cliente_direccion}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      name="cliente_ciudad"
                      placeholder="Ciudad"
                      value={formData.cliente_ciudad}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                    <button
                      type="submit"
                      disabled={cargando}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      {cargando ? 'Procesando...' : 'Completar Compra'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarFormulario(false)}
                      disabled={cargando}
                      className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </form>
                )}

                <Link
                  href="/"
                  className="block text-center mt-4 text-blue-600 hover:text-blue-800"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}