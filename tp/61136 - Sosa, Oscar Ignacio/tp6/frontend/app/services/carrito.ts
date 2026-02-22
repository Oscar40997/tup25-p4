export interface CarritoItem {
  producto_id: number;
  cantidad: number;
  titulo: string;
  precio: number;
  imagen: string;
}

export interface Carrito {
  items: CarritoItem[];
  total: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function obtenerCarrito(token: string): Promise<Carrito> {
  try {
    const response = await fetch(`${API_URL}/carrito`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener carrito');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { items: [], total: 0 };
  }
}

export async function agregarAlCarrito(item: CarritoItem, token: string): Promise<Carrito> {
  try {
    const response = await fetch(`${API_URL}/carrito/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Error al agregar al carrito');
    }
    const data = await response.json();
    return data.carrito;
  } catch (error) {
    console.error('Error:', error);
    return { items: [], total: 0 };
  }
}

export async function eliminarDelCarrito(productoId: number, token: string): Promise<Carrito> {
  try {
    const response = await fetch(`${API_URL}/carrito/eliminar/${productoId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al eliminar del carrito');
    }
    const data = await response.json();
    return data.carrito;
  } catch (error) {
    console.error('Error:', error);
    return { items: [], total: 0 };
  }
}

export async function actualizarCantidad(
  productoId: number,
  cantidad: number,
  token: string
): Promise<Carrito> {
  try {
    const response = await fetch(
      `${API_URL}/carrito/actualizar/${productoId}?cantidad=${cantidad}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Error al actualizar cantidad');
    }
    const data = await response.json();
    return data.carrito;
  } catch (error) {
    console.error('Error:', error);
    return { items: [], total: 0 };
  }
}

export async function vaciarCarrito(token: string): Promise<Carrito> {
  try {
    const response = await fetch(`${API_URL}/carrito/vaciar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al vaciar carrito');
    }
    const data = await response.json();
    return data.carrito;
  } catch (error) {
    console.error('Error:', error);
    return { items: [], total: 0 };
  }
}

export interface PedidoData {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  items: CarritoItem[];
  total: number;
}

export async function crearPedido(pedido: PedidoData, token: string) {
  try {
    const response = await fetch(`${API_URL}/pedidos/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pedido),
    });
    if (!response.ok) {
      throw new Error('Error al crear pedido');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
