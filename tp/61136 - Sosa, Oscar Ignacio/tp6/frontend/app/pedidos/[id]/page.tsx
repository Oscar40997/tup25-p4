'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { obtenerDetallePedido, cancelarPedido } from '@/app/services/usuarios';
import { Pedido } from '@/app/types';

export default function DetallePedidoPage() {
  const { usuario, token, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pedidoId = Number(params.id);

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cancelando, setCancelando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;

    if (!usuario || !token) {
      router.push('/login');
      return;
    }

    const cargarPedido = async () => {
      try {
        const dato = await obtenerDetallePedido(pedidoId, token);
        if (dato) {
          setPedido(dato);
        } else {
          setError('Pedido no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el pedido');
      } finally {
        setCargando(false);
      }
    };

    cargarPedido();
  }, [usuario, token, loading, router, pedidoId]);

  const handleCancelar = async () => {
    if (!token || !pedido) return;

    setCancelando(true);
    try {
      await cancelarPedido(pedido.id, token);
      const dato = await obtenerDetallePedido(pedidoId, token);
      if (dato) setPedido(dato);
      alert('Pedido cancelado exitosamente');
    } catch (err) {
      alert('No se pudo cancelar el pedido');
    } finally {
      setCancelando(false);
    }
  };

  if (loading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Pedido no encontrado'}</p>
          <Link href="/pedidos" className="text-blue-600 hover:text-blue-700">
            Volver a mis compras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/pedidos" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Volver a mis compras
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Detalle del Pedido #{pedido.id}
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Información del pedido */}
          <div className="bg-gray-100 px-6 py-6 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-bold text-gray-900">
                  {new Date(pedido.fecha).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className={`font-bold ${
                  pedido.estado === 'completado'
                    ? 'text-green-600'
                    : pedido.estado === 'pendiente'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {pedido.estado.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-blue-600">
                  ${pedido.total.toFixed(2)}
                </p>
              </div>
              <div>
                {pedido.estado === 'pendiente' && (
                  <button
                    onClick={handleCancelar}
                    disabled={cancelando}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {cancelando ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="px-6 py-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Datos de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-900">{pedido.cliente_nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{pedido.cliente_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium text-gray-900">{pedido.cliente_telefono}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ciudad</p>
                <p className="font-medium text-gray-900">{pedido.cliente_ciudad}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium text-gray-900">{pedido.cliente_direccion}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Productos Comprados</h2>
            <div className="space-y-4">
              {pedido.items.map((item) => (
                <div key={item.producto_id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Producto</p>
                      <p className="font-medium text-gray-900">{item.titulo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cantidad</p>
                      <p className="font-medium text-gray-900">{item.cantidad}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-bold text-blue-600">
                        ${(item.cantidad * item.precio_unitario).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-end">
                <div className="w-48">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${pedido.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
