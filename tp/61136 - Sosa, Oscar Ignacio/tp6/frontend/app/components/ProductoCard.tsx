'use client';

import { Producto } from '../types';
import Image from 'next/image';
import { useState } from 'react';
import { agregarAlCarrito } from '../services/carrito';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [cargando, setCargando] = useState(false);
  const { refrescar } = useCarrito();
  const { token, usuario } = useAuth();
  const router = useRouter();

  const handleAgregarAlCarrito = async () => {
    if (!token || !usuario) {
      router.push('/login');
      return;
    }

    setCargando(true);
    try {
      await agregarAlCarrito(
        {
          producto_id: producto.id,
          cantidad: 1,
          titulo: producto.titulo,
          precio: producto.precio,
          imagen: producto.imagen,
        },
        token
      );
      refrescar(token);
      alert(`${producto.titulo} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    } finally {
      setCargando(false);
    }
  };

  const stock = (producto as any).stock || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen del producto */}
      <div className="relative h-56 bg-gray-100 flex items-center justify-center">
        <Image
          src={`${API_URL}/imagenes/${producto.id.toString().padStart(4, '0')}.png`}
          alt={producto.titulo}
          width={200}
          height={200}
          className="object-contain p-4 max-h-full"
          unoptimized
        />
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2">
          {producto.titulo}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-900">
            ${producto.precio.toFixed(2)}
          </span>
          <span className="text-xs text-gray-600">
            Disponible: {stock}
          </span>
        </div>

        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mb-4">
          {(producto as any).categoria || 'Sin categoría'}
        </span>

        <button
          onClick={handleAgregarAlCarrito}
          disabled={cargando || stock === 0}
          className={`w-full py-2 px-4 rounded font-medium text-sm transition-colors ${
            stock === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : cargando
              ? 'bg-gray-500 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {cargando ? 'Agregando...' : stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
