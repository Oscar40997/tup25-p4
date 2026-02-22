'use client';

import Link from 'next/link';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { carrito } = useCarrito();
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cantidadItems = carrito.items.reduce((sum, item) => sum + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          🛒 ShopHub
        </Link>

        {/* Búsqueda en centro */}
        <Link
          href="/buscar"
          className="hidden md:flex flex-1 mx-8 max-w-md bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors"
        >
          <span className="text-gray-500">🔍 Buscar productos...</span>
        </Link>

        {/* Items derecha */}
        <div className="flex items-center gap-6">
          {/* Carrito */}
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            <span>🛒</span>
            {cantidadItems > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cantidadItems}
              </span>
            )}
          </Link>

          {/* Usuario o Login */}
          {usuario ? (
            <div className="relative">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-2"
              >
                👤 {usuario.nombre.split(' ')[0]}
                <span className={`text-xs transition-transform ${menuAbierto ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  <Link
                    href="/pedidos"
                    onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    📦 Mis Compras
                  </Link>
                  <Link
                    href="/perfil"
                    onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    👤 Perfil
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
