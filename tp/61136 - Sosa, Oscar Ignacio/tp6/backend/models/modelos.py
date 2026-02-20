from sqlmodel import SQLModel, Field
from typing import Optional, List
from pydantic import BaseModel


class ProductoBase(SQLModel):
    titulo: str
    precio: float
    descripcion: str
    categoria: str
    valoracion: float
    existencia: int
    imagen: str


class Producto(ProductoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class ProductoRead(ProductoBase):
    id: int


class CarritoItem(BaseModel):
    producto_id: int
    cantidad: int
    titulo: str
    precio: float
    imagen: str


class Carrito(BaseModel):
    items: List[CarritoItem] = []
    total: float = 0.0

    def agregar_item(self, producto_id: int, cantidad: int, titulo: str, precio: float, imagen: str):
        # Buscar si el producto ya existe en el carrito
        for item in self.items:
            if item.producto_id == producto_id:
                item.cantidad += cantidad
                self.actualizar_total()
                return
        # Si no existe, agregarlo
        self.items.append(CarritoItem(
            producto_id=producto_id,
            cantidad=cantidad,
            titulo=titulo,
            precio=precio,
            imagen=imagen
        ))
        self.actualizar_total()

    def eliminar_item(self, producto_id: int):
        self.items = [item for item in self.items if item.producto_id != producto_id]
        self.actualizar_total()

    def actualizar_cantidad(self, producto_id: int, cantidad: int):
        for item in self.items:
            if item.producto_id == producto_id:
                item.cantidad = cantidad
                if cantidad <= 0:
                    self.eliminar_item(producto_id)
                break
        self.actualizar_total()

    def actualizar_total(self):
        self.total = sum(item.precio * item.cantidad for item in self.items)

    def vaciar(self):
        self.items = []
        self.total = 0.0


class PedidoCreate(BaseModel):
    cliente_nombre: str
    cliente_email: str
    cliente_telefono: str
    cliente_direccion: str
    cliente_ciudad: str
    items: List[CarritoItem]
    total: float


class Pedido(PedidoCreate):
    id: Optional[int] = None
    fecha: Optional[str] = None


class CompraResponse(BaseModel):
    mensaje: str
    pedido_id: int
    total: float
