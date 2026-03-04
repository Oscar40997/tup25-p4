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
    <div className="producto-card">
      {/* Imagen del producto - Izquierda */}
      <div className="producto-imagen">
        <Image
          src={`${API_URL}/imagenes/${producto.id.toString().padStart(4, '0')}.png`}
          alt={producto.titulo}
          width={130}
          height={130}
          className="object-contain"
          unoptimized
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="130" height="130"%3E%3Crect fill="%23f3f4f6" width="130" height="130"/%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Información del producto - Centro */}
      <div className="producto-info">
        <div>
          <h3 className="producto-titulo">{producto.titulo}</h3>
          <p className="producto-descripcion">{producto.descripcion}</p>
          <div className="producto-categoria">
            Categoría: {(producto as any).categoria || 'Sin categoría'}
          </div>
        </div>
        
        <div>
          <div className="producto-disponible">
            Disponible: {stock > 0 ? stock : 'Sin stock'}
          </div>
        </div>
      </div>

      {/* Precio y botón - Derecha */}
      <div className="producto-derecha">
        <div className="producto-precio-grande">
          ${producto.precio.toFixed(2)}
        </div>

        <button
          onClick={handleAgregarAlCarrito}
          disabled={cargando || stock === 0}
          className={`btn-agregar ${
            stock === 0 ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: stock === 0 ? '#9ca3af' : (cargando ? '#6b7280' : '#1a3a52'),
          }}
        >
          {cargando ? 'Agregando...' : stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
