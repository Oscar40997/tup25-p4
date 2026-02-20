import { obtenerProductos } from './services/productos';
import ProductoCard from './components/ProductoCard';

export default async function Home() {
  try {
    const productos = await obtenerProductos();

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Catálogo de Productos
            </h1>
            <p className="text-gray-600 mt-2">
              {productos.length} productos disponibles
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos disponibles</p>
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">No se pudo cargar el catálogo de productos</p>
          <p className="text-sm text-gray-500 mt-2">
            Asegúrate de que el servidor de FastAPI está corriendo en http://localhost:8000
          </p>
        </div>
      </div>
    );
  }
}
