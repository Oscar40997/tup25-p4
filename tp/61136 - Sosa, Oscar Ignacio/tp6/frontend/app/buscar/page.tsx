'use client';

import { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';
import { buscarProductos } from '../services/usuarios';
import { Producto } from '../types';

export default function BuscarPage() {
  const [termino, setTermino] = useState('');
  const [categoria, setCategoria] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      setCargando(true);
      const resultado = await buscarProductos(termino, categoria);
      setProductos(resultado.productos);
      setCategorias(resultado.categorias);
      setTotal(resultado.total);
      setCargando(false);
    };

    const timeout = setTimeout(buscar, 300);
    return () => clearTimeout(timeout);
  }, [termino, categoria]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Búsqueda de Productos</h1>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Buscar por nombre o descripción
              </label>
              <input
                type="text"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                placeholder="Escribe lo que buscas..."
                className="w-full px-4 py-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Filtrar por categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            {cargando ? 'Buscando...' : `Se encontraron ${total} producto${total !== 1 ? 's' : ''}`}
          </p>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Buscando...</p>
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {termino || categoria ? 'No se encontraron productos que coincidan con tu búsqueda' : 'Ingresa un término de búsqueda'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
