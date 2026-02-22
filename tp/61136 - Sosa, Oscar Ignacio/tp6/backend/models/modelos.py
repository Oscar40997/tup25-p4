from sqlmodel import SQLModel, Field, Session, select
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


# ============= MODELOS DE USUARIO =============
class UsuarioBase(SQLModel):
    nombre: str
    email: str
    ciudad: str = ""
    direccion: str = ""
    telefono: str = ""


class UsuarioCreate(UsuarioBase):
    contraseña: str


class UsuarioLogin(BaseModel):
    email: str
    contraseña: str


class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    contraseña_hash: str
    fecha_registro: datetime = Field(default_factory=datetime.utcnow)

    def __repr__(self):
        return f"<Usuario {self.email}>"


class UsuarioResponse(UsuarioBase):
    id: int
    fecha_registro: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse


# ============= MODELOS DE PRODUCTO =============
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


# ============= MODELOS DE CARRITO =============
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
        for item in self.items:
            if item.producto_id == producto_id:
                item.cantidad += cantidad
                self.actualizar_total()
                return
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


# ============= MODELOS DE PEDIDO =============
class PedidoItemBase(SQLModel):
    producto_id: int
    cantidad: int
    precio_unitario: float
    titulo: str


class PedidoItem(PedidoItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: Optional[int] = Field(default=None, foreign_key="pedido.id")


class PedidoBase(SQLModel):
    usuario_id: int
    cliente_nombre: str
    cliente_email: str
    cliente_telefono: str
    cliente_direccion: str
    cliente_ciudad: str
    total: float
    estado: str = "pendiente"  # pendiente, completado, cancelado


class Pedido(PedidoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: datetime = Field(default_factory=datetime.utcnow)
    items: List[PedidoItem] = Field(default=[], sa_relationship=True)


class PedidoCreate(BaseModel):
    cliente_nombre: str
    cliente_email: str
    cliente_telefono: str
    cliente_direccion: str
    cliente_ciudad: str
    items: List[CarritoItem]
    total: float


class PedidoResponse(BaseModel):
    id: int
    fecha: datetime
    cliente_nombre: str
    cliente_email: str
    cliente_telefono: str
    cliente_direccion: str
    cliente_ciudad: str
    total: float
    estado: str
    items: List[PedidoItemBase]


class CompraResponse(BaseModel):
    mensaje: str
    pedido_id: int
    total: float


# ============= RESPUESTAS DE BÚSQUEDA =============
class ProductosBusqueda(BaseModel):
    total: int
    productos: List[ProductoRead]
    categorias: List[str]

