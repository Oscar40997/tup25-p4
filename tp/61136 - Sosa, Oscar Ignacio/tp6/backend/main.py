from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path
from models.modelos import Carrito, CarritoItem, PedidoCreate, CompraResponse

app = FastAPI(title="API E-Commerce")

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

# Almacenamiento en memoria para el carrito
carrito_global = Carrito()
contador_pedidos = 0

# Cargar productos desde el archivo JSON
def cargar_productos():
    ruta_productos = Path(__file__).parent / "productos.json"
    with open(ruta_productos, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.get("/")
def root():
    return {"mensaje": "API de E-Commerce - use /productos para obtener el listado", "version": "1.0"}

@app.get("/productos")
def obtener_productos():
    """Obtiene la lista de todos los productos disponibles"""
    productos = cargar_productos()
    return productos

@app.get("/productos/{producto_id}")
def obtener_producto(producto_id: int):
    """Obtiene un producto específico por su ID"""
    productos = cargar_productos()
    for producto in productos:
        if producto["id"] == producto_id:
            return producto
    raise HTTPException(status_code=404, detail="Producto no encontrado")

# Endpoints del carrito
@app.get("/carrito")
def obtener_carrito():
    """Obtiene el carrito actual del usuario"""
    return carrito_global

@app.post("/carrito/agregar")
def agregar_al_carrito(item: CarritoItem):
    """Agrega un producto al carrito"""
    carrito_global.agregar_item(
        producto_id=item.producto_id,
        cantidad=item.cantidad,
        titulo=item.titulo,
        precio=item.precio,
        imagen=item.imagen
    )
    return {"mensaje": "Producto agregado al carrito", "carrito": carrito_global}

@app.post("/carrito/eliminar/{producto_id}")
def eliminar_del_carrito(producto_id: int):
    """Elimina un producto del carrito"""
    carrito_global.eliminar_item(producto_id)
    return {"mensaje": "Producto eliminado del carrito", "carrito": carrito_global}

@app.put("/carrito/actualizar/{producto_id}")
def actualizar_cantidad_carrito(producto_id: int, cantidad: int):
    """Actualiza la cantidad de un producto en el carrito"""
    carrito_global.actualizar_cantidad(producto_id, cantidad)
    return {"mensaje": "Cantidad actualizada", "carrito": carrito_global}

@app.delete("/carrito/vaciar")
def vaciar_carrito():
    """Vacía completamente el carrito"""
    carrito_global.vaciar()
    return {"mensaje": "Carrito vaciado", "carrito": carrito_global}

@app.post("/pedidos/crear")
def crear_pedido(pedido: PedidoCreate):
    """Crea un nuevo pedido con los datos del cliente"""
    global contador_pedidos
    contador_pedidos += 1
    
    pedido_id = contador_pedidos
    
    respuesta = CompraResponse(
        mensaje=f"Pedido creado exitosamente",
        pedido_id=pedido_id,
        total=pedido.total
    )
    
    # Vaciar carrito después de crear el pedido
    carrito_global.vaciar()
    
    return respuesta

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

