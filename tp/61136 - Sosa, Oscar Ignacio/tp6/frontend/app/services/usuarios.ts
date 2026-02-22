import { Producto } from '@/app/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ResultadoBusqueda {
  total: number;
  productos: Producto[];
  categorias: string[];
}

export async function buscarProductos(
  termino: string = '',
  categoria: string = ''
): Promise<ResultadoBusqueda> {
  try {
    const params = new URLSearchParams();
    if (termino) params.append('q', termino);
    if (categoria) params.append('categoria', categoria);

    const url = `${API_URL}/buscar?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error en búsqueda');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { total: 0, productos: [], categorias: [] };
  }
}

export async function obtenerPedidos(token: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/pedidos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener pedidos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function obtenerDetallePedido(pedidoId: number, token: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener detalle del pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function cancelarPedido(pedidoId: number, token: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}/cancelar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al cancelar pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
