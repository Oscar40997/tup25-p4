'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
          TP6 Shop
        </Link>

        {/* Menu Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Productos
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
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
