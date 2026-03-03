'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUsuario } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const response = await loginUsuario({ email, contraseña });
      login(response.access_token, response.usuario);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el login');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Iniciarsesión</h1>
          <p className="text-sm text-gray-500 bg-gray-600 text-white inline-block px-4 py-1 rounded">
            Pantalla de inicio de sesión
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-0"
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-blue-600 hover:text-blue-700 font-medium">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
