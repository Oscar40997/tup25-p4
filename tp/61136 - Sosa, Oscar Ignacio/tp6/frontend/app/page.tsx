'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';
import { useAuth } from './context/AuthContext';
import { Producto } from './types';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtrados, setFiltrados] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [cargando, setCargando] = useState(true);
  const { usuario } = useAuth();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
      setFiltrados(data);
      
      // Extraer categorías únicas
      const cats = [...new Set(data.map(p => p.categoria))].sort();
      setCategorias(cats);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setCargando(false);
    }
  };

  const aplicarFiltros = (busq: string, cat: string) => {
    let resultado = productos;

    if (busq) {
      resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(busq.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busq.toLowerCase())
      );
    }

    if (cat) {
      resultado = resultado.filter(p => p.categoria === cat);
    }

    setFiltrados(resultado);
  };

  const handleBusqueda = (valor: string) => {
    setBusqueda(valor);
    aplicarFiltros(valor, categoriaSeleccionada);
  };

  const handleCategoria = (valor: string) => {
    setCategoriaSeleccionada(valor);
    aplicarFiltros(busqueda, valor);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navbar mejorado */}
      <nav className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 items-center">
            {/* Buscador */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Selector de categorías */}
            <select
              value={categoriaSeleccionada}
              onChange={(e) => handleCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Grid de productos */}
          <div className="flex-1">
            {cargando ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando productos...</p>
              </div>
            ) : filtrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtrados.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos</p>
              </div>
            )}
          </div>

          {/* Sidebar carrito */}
          <aside className="w-64 h-fit sticky top-32">
            <div className="bg-white shadow-sm rounded-lg p-6">
              {usuario ? (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">🛒 Mi Carrito</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ve y edita tu carrito desde aquí
                  </p>
                  <Link
                    href="/carrito"
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Ver carrito
                  </Link>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">🛒 Mi Carrito</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Inicia sesión para ver y editar tu carrito.
                  </p>
                  <Link
                    href="/login"
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-2"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/registro"
                    className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Crear cuenta
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

