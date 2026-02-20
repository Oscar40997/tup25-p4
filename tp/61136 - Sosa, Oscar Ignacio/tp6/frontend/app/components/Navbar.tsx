'use client';

import Link from 'next/link';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { carrito } = useCarrito();
  const cantidadItems = carrito.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-100">
          🛒 E-Commerce
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-100 transition-colors">
            Inicio
          </Link>
          <Link
            href="/carrito"
            className="flex items-center gap-2 hover:text-blue-100 transition-colors relative"
          >
            <span>Carrito</span>
            {cantidadItems > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cantidadItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
