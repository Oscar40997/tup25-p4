export interface Producto {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  categoria: string;
  valoracion: number;
  existencia: number;
  imagen: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  fecha_registro: string;
}

export interface PedidoItem {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  titulo: string;
}

export interface Pedido {
  id: number;
  fecha: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  total: number;
  estado: string;
  items: PedidoItem[];
}
