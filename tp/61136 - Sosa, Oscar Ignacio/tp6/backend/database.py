from sqlmodel import SQLModel, create_engine, Session, select
from models.modelos import Usuario, Pedido, PedidoItem
from security import hash_password
import json
from pathlib import Path
import os

# Configuración de BD
DATABASE_URL = "sqlite:///./ecommerce.db"
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    """Crea todas las tablas de la BD"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Obtiene una sesión de BD"""
    with Session(engine) as session:
        yield session


def init_db():
    """Inicializa la BD con datos de ejemplo"""
    create_db_and_tables()
    
    with Session(engine) as session:
        # Verificar si ya hay datos
        usuarios = session.exec(select(Usuario)).first()
        if usuarios:
            return
        
        # Crear usuarios de ejemplo
        usuario1 = Usuario(
            nombre="Juan Pérez",
            email="juan@example.com",
            contraseña_hash=hash_password("password123"),
            ciudad="Buenos Aires",
            direccion="Calle 1 #123",
            telefono="555-0001"
        )
        usuario2 = Usuario(
            nombre="María García",
            email="maria@example.com",
            contraseña_hash=hash_password("password123"),
            ciudad="Córdoba",
            direccion="Calle 2 #456",
            telefono="555-0002"
        )
        
        session.add(usuario1)
        session.add(usuario2)
        session.commit()


def usuario_existe(session: Session, email: str) -> bool:
    """Verifica si un usuario existe"""
    return session.exec(select(Usuario).where(Usuario.email == email)).first() is not None


def obtener_usuario_por_email(session: Session, email: str) -> Usuario | None:
    """Obtiene un usuario por email"""
    return session.exec(select(Usuario).where(Usuario.email == email)).first()


def obtener_usuario_por_id(session: Session, usuario_id: int) -> Usuario | None:
    """Obtiene un usuario por ID"""
    return session.exec(select(Usuario).where(Usuario.id == usuario_id)).first()


def crear_usuario(session: Session, nombre: str, email: str, contraseña: str) -> Usuario:
    """Crea un nuevo usuario"""
    usuario = Usuario(
        nombre=nombre,
        email=email,
        contraseña_hash=hash_password(contraseña)
    )
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario


def crear_pedido(session: Session, usuario_id: int, pedido_data: dict) -> Pedido:
    """Crea un nuevo pedido"""
    pedido = Pedido(
        usuario_id=usuario_id,
        cliente_nombre=pedido_data["cliente_nombre"],
        cliente_email=pedido_data["cliente_email"],
        cliente_telefono=pedido_data["cliente_telefono"],
        cliente_direccion=pedido_data["cliente_direccion"],
        cliente_ciudad=pedido_data["cliente_ciudad"],
        total=pedido_data["total"],
        estado="completado"
    )
    session.add(pedido)
    session.flush()
    
    # Agregar items del pedido
    for item_data in pedido_data.get("items", []):
        item = PedidoItem(
            producto_id=item_data["producto_id"],
            cantidad=item_data["cantidad"],
            precio_unitario=item_data["precio"],
            titulo=item_data["titulo"],
            pedido_id=pedido.id
        )
        session.add(item)
    
    session.commit()
    session.refresh(pedido)
    return pedido


def obtener_pedidos_usuario(session: Session, usuario_id: int) -> list[Pedido]:
    """Obtiene todos los pedidos de un usuario"""
    return session.exec(
        select(Pedido).where(Pedido.usuario_id == usuario_id).order_by(Pedido.fecha.desc())
    ).all()


def obtener_pedido(session: Session, pedido_id: int, usuario_id: int) -> Pedido | None:
    """Obtiene un pedido específico de un usuario"""
    return session.exec(
        select(Pedido).where(
            (Pedido.id == pedido_id) & (Pedido.usuario_id == usuario_id)
        )
    ).first()


def cancelar_pedido(session: Session, pedido_id: int, usuario_id: int) -> Pedido | None:
    """Cancela un pedido"""
    pedido = obtener_pedido(session, pedido_id, usuario_id)
    if pedido and pedido.estado == "pendiente":
        pedido.estado = "cancelado"
        session.add(pedido)
        session.commit()
        session.refresh(pedido)
    return pedido
