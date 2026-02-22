from fastapi import FastAPI, HTTPException, Depends, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
import json
from pathlib import Path
from datetime import timedelta

from models.modelos import (
    Usuario, UsuarioCreate, UsuarioLogin, UsuarioResponse, TokenResponse,
    Producto, ProductoRead, CarritoItem, Carrito, PedidoCreate, CompraResponse,
    Pedido, PedidoResponse, ProductosBusqueda
)
from database import (
    init_db, create_db_and_tables, engine, usuario_existe, 
    obtener_usuario_por_email, obtener_usuario_por_id, crear_usuario,
    crear_pedido, obtener_pedidos_usuario, obtener_pedido, cancelar_pedido
)
from security import (
    verify_password, create_access_token, decode_token, 
    hash_password, ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="API E-Commerce")

# Inicializar BD
create_db_and_tables()
init_db()

# Montar directorio de imágenes como archivos estáticos
app.mount("/imagenes", StaticFiles(directory="imagenes"), name="imagenes")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Almacenamiento en memoria para carritos de usuarios (user_id -> Carrito)
carritos_usuarios = {}

# Cargar productos desde JSON
def cargar_productos() -> list[dict]:
    """Carga productos desde archivo JSON"""
    ruta = Path(__file__).parent / "productos.json"
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f)


def obtener_usuario_actual(authorization: str = Header(None)) -> dict:
    """Obtiene el usuario actual del token JWT"""
    if not authorization:
        raise HTTPException(status_code=401, detail="No autorizado")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="No autorizado")
    except ValueError:
        raise HTTPException(status_code=401, detail="No autorizado")
    
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return payload


def obtener_carrito_usuario(usuario_id: int) -> Carrito:
    """Obtiene o crea el carrito de un usuario"""
    if usuario_id not in carritos_usuarios:
        carritos_usuarios[usuario_id] = Carrito()
    return carritos_usuarios[usuario_id]


# ============= ENDPOINTS DE AUTENTICACIÓN =============

@app.post("/auth/registro")
def registro(usuario_data: UsuarioCreate):
    """Registra un nuevo usuario"""
    with Session(engine) as session:
        if usuario_existe(session, usuario_data.email):
            raise HTTPException(status_code=400, detail="Email ya registrado")
        
        usuario = crear_usuario(
            session,
            nombre=usuario_data.nombre,
            email=usuario_data.email,
            contraseña=usuario_data.contraseña
        )
        
        # Crear token
        access_token = create_access_token(
            data={"sub": usuario.email, "id": usuario.id}
        )
        
        return TokenResponse(
            access_token=access_token,
            usuario=UsuarioResponse(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                ciudad=usuario.ciudad,
                direccion=usuario.direccion,
                telefono=usuario.telefono,
                fecha_registro=usuario.fecha_registro
            )
        )


@app.post("/auth/login")
def login(credenciales: UsuarioLogin):
    """Autentica un usuario y retorna un token"""
    with Session(engine) as session:
        usuario = obtener_usuario_por_email(session, credenciales.email)
        
        if not usuario or not verify_password(credenciales.contraseña, usuario.contraseña_hash):
            raise HTTPException(status_code=401, detail="Email o contraseña inválidos")
        
        access_token = create_access_token(
            data={"sub": usuario.email, "id": usuario.id}
        )
        
        return TokenResponse(
            access_token=access_token,
            usuario=UsuarioResponse(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                ciudad=usuario.ciudad,
                direccion=usuario.direccion,
                telefono=usuario.telefono,
                fecha_registro=usuario.fecha_registro
            )
        )


@app.get("/auth/perfil")
def obtener_perfil(current_user: dict = Depends(obtener_usuario_actual)):
    """Obtiene el perfil del usuario actual"""
    with Session(engine) as session:
        usuario = obtener_usuario_por_id(session, current_user["id"])
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return UsuarioResponse(
            id=usuario.id,
            nombre=usuario.nombre,
            email=usuario.email,
            ciudad=usuario.ciudad,
            direccion=usuario.direccion,
            telefono=usuario.telefono,
            fecha_registro=usuario.fecha_registro
        )


# ============= ENDPOINTS DE PRODUCTOS =============

@app.get("/")
def root():
    """Información de la API"""
    return {"mensaje": "API de E-Commerce", "version": "2.0"}


@app.get("/productos", response_model=list[dict])
def listar_productos():
    """Lista todos los productos"""
    return cargar_productos()


@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    """Obtiene un producto por ID"""
    productos = cargar_productos()
    for p in productos:
        if p["id"] == producto_id:
            return p
    raise HTTPException(status_code=404, detail="Producto no encontrado")


@app.get("/buscar")
def buscar_productos(
    q: str = Query(default="", description="Término de búsqueda"),
    categoria: str = Query(default="", description="Filtrar por categoría")
):
    """Busca productos por nombre o categoría"""
    productos = cargar_productos()
    
    # Filtrar por búsqueda
    if q:
        q = q.lower()
        productos = [
            p for p in productos
            if q in p["titulo"].lower() or q in p["descripcion"].lower()
        ]
    
    # Filtrar por categoría
    if categoria:
        productos = [p for p in productos if p["categoria"].lower() == categoria.lower()]
    
    # Obtener lista única de categorías
    todas_categorias = list(set(p["categoria"] for p in cargar_productos()))
    
    return ProductosBusqueda(
        total=len(productos),
        productos=productos,
        categorias=todas_categorias
    )


# ============= ENDPOINTS DE CARRITO =============

@app.get("/carrito")
def obtener_carrito(current_user: dict = Depends(obtener_usuario_actual)):
    """Obtiene el carrito del usuario"""
    carrito = obtener_carrito_usuario(current_user["id"])
    return carrito


@app.post("/carrito/agregar")
def agregar_al_carrito(
    item: CarritoItem,
    current_user: dict = Depends(obtener_usuario_actual)
):
    """Agrega un producto al carrito"""
    carrito = obtener_carrito_usuario(current_user["id"])
    carrito.agregar_item(
        producto_id=item.producto_id,
        cantidad=item.cantidad,
        titulo=item.titulo,
        precio=item.precio,
        imagen=item.imagen
    )
    return {"mensaje": "Producto agregado", "carrito": carrito}


@app.post("/carrito/eliminar/{producto_id}")
def eliminar_del_carrito(
    producto_id: int,
    current_user: dict = Depends(obtener_usuario_actual)
):
    """Elimina un producto del carrito"""
    carrito = obtener_carrito_usuario(current_user["id"])
    carrito.eliminar_item(producto_id)
    return {"mensaje": "Producto eliminado", "carrito": carrito}


@app.put("/carrito/actualizar/{producto_id}")
def actualizar_cantidad(
    producto_id: int,
    cantidad: int = Query(..., gt=0),
    current_user: dict = Depends(obtener_usuario_actual)
):
    """Actualiza la cantidad de un producto"""
    carrito = obtener_carrito_usuario(current_user["id"])
    carrito.actualizar_cantidad(producto_id, cantidad)
    return {"mensaje": "Cantidad actualizada", "carrito": carrito}


@app.delete("/carrito/vaciar")
def vaciar_carrito(current_user: dict = Depends(obtener_usuario_actual)):
    """Vacía el carrito"""
    if current_user["id"] in carritos_usuarios:
        carritos_usuarios[current_user["id"]].vaciar()
    return {"mensaje": "Carrito vaciado"}


# ============= ENDPOINTS DE PEDIDOS =============

@app.post("/pedidos/crear")
def crear_nuevo_pedido(
    pedido_data: PedidoCreate,
    current_user: dict = Depends(obtener_usuario_actual)
):
    """Crea un nuevo pedido"""
    with Session(engine) as session:
        pedido_dict = {
            "cliente_nombre": pedido_data.cliente_nombre,
            "cliente_email": pedido_data.cliente_email,
            "cliente_telefono": pedido_data.cliente_telefono,
            "cliente_direccion": pedido_data.cliente_direccion,
            "cliente_ciudad": pedido_data.cliente_ciudad,
            "items": [item.dict() for item in pedido_data.items],
            "total": pedido_data.total
        }
        
        pedido = crear_pedido(session, current_user["id"], pedido_dict)
        
        # Vaciar carrito del usuario
        if current_user["id"] in carritos_usuarios:
            carritos_usuarios[current_user["id"]].vaciar()
        
        return CompraResponse(
            mensaje="Pedido creado exitosamente",
            pedido_id=pedido.id,
            total=pedido.total
        )


@app.get("/pedidos")
def obtener_historial_pedidos(current_user: dict = Depends(obtener_usuario_actual)):
    """Obtiene el historial de pedidos del usuario"""
    with Session(engine) as session:
        pedidos = obtener_pedidos_usuario(session, current_user["id"])
        return [
            PedidoResponse(
                id=p.id,
                fecha=p.fecha,
                cliente_nombre=p.cliente_nombre,
                cliente_email=p.cliente_email,
                cliente_telefono=p.cliente_telefono,
                cliente_direccion=p.cliente_direccion,
                cliente_ciudad=p.cliente_ciudad,
                total=p.total,
                estado=p.estado,
                items=[
                    {
                        "producto_id": item.producto_id,
                        "cantidad": item.cantidad,
                        "precio_unitario": item.precio_unitario,
                        "titulo": item.titulo
                    }
                    for item in p.items
                ]
            )
            for p in pedidos
        ]


@app.get("/pedidos/{pedido_id}")
def obtener_detalle_pedido(
    pedido_id: int,
    current_user: dict = Depends(obtener_usuario_actual)
):
    """Obtiene el detalle de un pedido específico"""
    with Session(engine) as session:
        pedido = obtener_pedido(session, pedido_id, current_user["id"])
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        
        return PedidoResponse(
            id=pedido.id,
            fecha=pedido.fecha,
            cliente_nombre=pedido.cliente_nombre,
            cliente_email=pedido.cliente_email,
            cliente_telefono=pedido.cliente_telefono,
            cliente_direccion=pedido.cliente_direccion,
            cliente_ciudad=pedido.cliente_ciudad,
            total=pedido.total,
            estado=pedido.estado,
            items=[
                {
                    "producto_id": item.producto_id,
                    "cantidad": item.cantidad,
                    "precio_unitario": item.precio_unitario,
                    "titulo": item.titulo
                }
                for item in pedido.items
            ]
        )


@app.post("/pedidos/{pedido_id}/cancelar")
def cancelar_compra(
    pedido_id: int,
    current_user: dict = Depends(obtener_usuario_actual)
):
    """Cancela un pedido"""
    with Session(engine) as session:
        pedido = cancelar_pedido(session, pedido_id, current_user["id"])
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado o no se puede cancelar")
        
        return {"mensaje": "Pedido cancelado", "estado": pedido.estado}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
