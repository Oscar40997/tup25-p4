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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Barra de búsqueda y filtros */}
      <nav style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '4rem', zIndex: 40 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Buscador */}
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Selector de categorías */}
          <select
            value={categoriaSeleccionada}
            onChange={(e) => handleCategoria(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem', display: 'flex', gap: '2rem' }}>
        {/* Grid de productos */}
        <div style={{ flex: 1 }}>
          {cargando ? (
            <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
              <p style={{ color: '#6b7280' }}>Cargando productos...</p>
            </div>
          ) : filtrados.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {filtrados.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No se encontraron productos</p>
            </div>
          )}
        </div>

        {/* Sidebar carrito */}
        <aside style={{ width: '256px', height: 'fit-content', position: 'sticky', top: '8rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
          }}>
            {usuario ? (
              <div>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>🛒 Mi Carrito</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Ve y edita tu carrito desde aquí
                </p>
                <Link
                  href="/carrito"
                  style={{
                    display: 'block',
                    width: '100%',
                    backgroundColor: '#1a3a52',
                    color: 'white',
                    textAlign: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 200ms',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0f263a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a3a52')}
                >
                  Ver carrito
                </Link>
              </div>
            ) : (
              <div>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>🛒 Mi Carrito</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Inicia sesión para ver y editar tu carrito.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: 'block',
                    width: '100%',
                    backgroundColor: '#1a3a52',
                    color: 'white',
                    textAlign: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    marginBottom: '0.75rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0f263a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a3a52')}
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  style={{
                    display: 'block',
                    width: '100%',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    textAlign: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

