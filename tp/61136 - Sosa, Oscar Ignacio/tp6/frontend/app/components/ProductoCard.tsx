'use client';

import { Producto } from '../types';
import Image from 'next/image';
import { useState } from 'react';
import { agregarAlCarrito } from '../services/carrito';
import { useCarrito } from '../context/CarritoContext';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);
  const { refrescar } = useCarrito();

  const handleAgregarAlCarrito = async () => {
    setCargando(true);
    try {
      await agregarAlCarrito({
        producto_id: producto.id,
        cantidad: cantidad,
        titulo: producto.titulo,
        precio: producto.precio,
        imagen: producto.imagen,
      });
      refrescar();
      setCantidad(1);
      alert(`${cantidad} unidad(es) de ${producto.titulo} agregada al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Imagen del producto */}
      <div className="relative h-64 bg-gray-100">
        <Image
          src={`${API_URL}/imagenes/${producto.id.toString().padStart(4, '0')}.png`}
          alt={producto.titulo}
          width={200}
          height={150}
          className="object-contain p-4 w-full h-full"
          unoptimized
        />
      </div>

      {/* Información del producto */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {producto.titulo}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {producto.descripcion}
        </p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {producto.categoria}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">{producto.valoracion}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${producto.precio.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            Stock: {producto.existencia}
          </span>
        </div>

        {producto.existencia === 0 ? (
          <span className="text-red-500 text-sm mt-2 block text-center">
            Agotado
          </span>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={cargando}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={producto.existencia}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.min(producto.existencia, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="w-12 text-center border rounded"
                disabled={cargando}
              />
              <button
                onClick={() => setCantidad(Math.min(producto.existencia, cantidad + 1))}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={cargando}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAgregarAlCarrito}
              disabled={cargando || producto.existencia === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
