'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PerfilPage() {
  const { usuario, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Nombre</label>
              <p className="text-lg font-medium text-gray-900">{usuario.nombre}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <p className="text-lg font-medium text-gray-900">{usuario.email}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Ciudad</label>
              <p className="text-lg font-medium text-gray-900">{usuario.ciudad || 'No especificada'}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Dirección</label>
              <p className="text-lg font-medium text-gray-900">
                {usuario.direccion || 'No especificada'}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Teléfono</label>
              <p className="text-lg font-medium text-gray-900">{usuario.telefono || 'No especificado'}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Miembro desde</label>
              <p className="text-lg font-medium text-gray-900">
                {new Date(usuario.fecha_registro).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <Link
              href="/pedidos"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Ver mis compras
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
