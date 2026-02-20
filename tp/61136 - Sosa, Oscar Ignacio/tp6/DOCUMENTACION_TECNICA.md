# Documentación Técnica - E-Commerce

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js/React)                 │
│  http://localhost:3000                                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Navbar                                                   │   │
│  │ - Links de navegación                                    │   │
│  │ - Contador de items en carrito                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ CarritoProvider (Context API)                           │   │
│  │ - Estado global del carrito                             │   │
│  │ - Métodos para modificar carrito                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Páginas:                                                       │
│  - / (Home) - Catálogo de productos                            │
│  - /carrito - Página del carrito y checkout                    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP/JSON)
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                          │
│  http://localhost:8000                                          │
│                                                                  │
│  Endpoints:                                                     │
│  - GET /productos - Listar productos                           │
│  - GET /productos/{id} - Producto específico                   │
│  - GET /carrito - Estado del carrito                          │
│  - POST /carrito/agregar - Agregar producto                   │
│  - POST /carrito/eliminar/{id} - Eliminar producto            │
│  - PUT /carrito/actualizar/{id} - Actualizar cantidad         │
│  - DELETE /carrito/vaciar - Vaciar carrito                    │
│  - POST /pedidos/crear - Crear pedido                         │
│  - GET /imagenes/{id}.png - Servir imágenes                   │
│                                                                  │
│  Datos:                                                         │
│  - productos.json - Base de datos de productos (JSON)         │
│  - imagenes/ - Carpeta con imágenes de productos              │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Carga Inicial
```
frontend/app/page.tsx
  ↓
obtenerProductos() - services/productos.ts
  ↓
GET /productos
  ↓
backend/main.py - cargar_productos() desde productos.json
  ↓
[Array de productos]
  ↓
ProductoCard x N - Renderizar grid de productos
```

### 2. Agregar al Carrito
```
ProductoCard.tsx (onclick Agregar)
  ↓
agregarAlCarrito() - services/carrito.ts
  ↓
POST /carrito/agregar {producto_id, cantidad, ...}
  ↓
backend/main.py - carrito_global.agregar_item()
  ↓
{ mensaje, carrito }
  ↓
useCarrito().refrescar()
  ↓
CarritoContext actualiza estado global
  ↓
Navbar recibe nueva cantidad
```

### 3. Checkout
```
app/carrito/page.tsx
  ↓
Cliente ingresa formulario
  ↓
crearPedido() - services/carrito.ts
  ↓
POST /pedidos/crear {cliente_*, items, total}
  ↓
backend/main.py - genera pedido_id
  ↓
{ mensaje, pedido_id, total }
  ↓
carrito_global.vaciar()
  ↓
Redireccionar a home
```

## Componentes React

### ProductoCard.tsx
- Muestra información del producto (imagen, título, precio, etc.)
- Input numérico para seleccionar cantidad
- Botón para agregar al carrito
- Validación de stock

### Navbar.tsx
- Logo y navegación
- Link a carrito
- Badge con cantidad de items
- Actualiza en tiempo real

### CarritoProvider + Context
- Gestión global del carrito
- Métodos: agregar, eliminar, actualizar, vaciar
- Hook personalizado: `useCarrito()`

### Página Carrito (/carrito)
- Tabla con items del carrito
- Resumen de compra (subtotal, envío, total)
- Formulario de datos cliente
- Botones para modificar cantidades

## Servicios REST

### services/productos.ts
```typescript
obtenerProductos() → GET /productos
obtenerProducto(id) → GET /productos/{id}
```

### services/carrito.ts
```typescript
obtenerCarrito() → GET /carrito
agregarAlCarrito(item) → POST /carrito/agregar
eliminarDelCarrito(id) → POST /carrito/eliminar/{id}
actualizarCantidad(id, cantidad) → PUT /carrito/actualizar/{id}
vaciarCarrito() → DELETE /carrito/vaciar
crearPedido(pedido) → POST /pedidos/crear
```

## Modelos FastAPI

### Producto
```python
id: int
titulo: str
precio: float
descripcion: str
categoria: str
valoracion: float
existencia: int
imagen: str (URL relativa)
```

### CarritoItem
```python
producto_id: int
cantidad: int
titulo: str
precio: float
imagen: str
```

### Carrito
```python
items: List[CarritoItem]
total: float (calculado)
```

### Pedido
```python
cliente_nombre: str
cliente_email: str
cliente_telefono: str
cliente_direccion: str
cliente_ciudad: str
items: List[CarritoItem]
total: float
```

## Variables de Entorno

### Frontend (.env.local o .env.example)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

El prefijo `NEXT_PUBLIC_` hace que esté disponible en el navegador.

## Tecnologías Clave

### Backend
| Librería | Propósito |
|----------|-----------|
| FastAPI | Framework web |
| Uvicorn | Servidor ASGI |
| Pydantic | Validación de datos |
| SQLModel | ORM (futuro con BD) |

### Frontend
| Librería | Propósito |
|----------|-----------|
| Next.js | Framework React/SSR |
| React | Librería de componentes |
| TypeScript | Tipado estático |
| Tailwind CSS | Framework CSS |
| Context API | Gestión de estado global |

## CORS (Cross-Origin Resource Sharing)

El backend está configurado para aceptar solicitudes desde cualquier origen:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ No usar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Nota:** En producción, restringir a:
```python
allow_origins=["https://tudominio.com"]
```

## Estructura de Carpetas Detallada

```
backend/
├── main.py                 # API REST completa
├── models/
│   ├── __init__.py
│   └── modelos.py         # Pydantic models
├── productos.json         # datos de ejemplo
├── imagenes/              # archivos PNG (0001.png, 0002.png, ...)
├── pyproject.toml         # dependencias
├── .venv/                 # entorno virtual
└── __pycache__/

frontend/
├── app/
│   ├── page.tsx           # Home/Catálogo
│   ├── layout.tsx         # Layout raíz
│   ├── types.ts           # tipos TypeScript
│   ├── globals.css        # estilos globales
│   ├── carrito/
│   │   └── page.tsx       # página del carrito
│   ├── components/
│   │   ├── Navbar.tsx     # navegación
│   │   └── ProductoCard.tsx # tarjeta producto
│   ├── context/
│   │   └── CarritoContext.tsx # context API
│   ├── services/
│   │   ├── productos.ts   # fetch API productos
│   │   └── carrito.ts     # fetch API carrito
│   └── public/            # archivos estáticos
├── node_modules/
├── package.json
├── next.config.js
├── tsconfig.json
└── .env.example           # variables de entorno
```

## Flujo de Desarrollo

### Para agregar un nuevo campo al producto:

1. **Backend:**
   - Modificar estructura en `backend/productos.json`
   - Actualizar Pydantic model en `backend/models/modelos.py`

2. **Frontend:**
   - Actualizar tipo `Producto` en `frontend/app/types.ts`
   - Usar campo en componentes (ProductoCard, etc.)

### Para agregar un nuevo endpoint:

1. **Backend:**
   - Definir ruta en `backend/main.py`
   - Crear función handler
   - Documentar con docstring

2. **Frontend:**
   - Crear función en `app/services/`
   - Usarla desde componentes
   - Manejar errores con try/catch

## Mejoras Futuras Recomendadas

1. **Autenticación:**
   - JWT tokens
   - Registro y login

2. **Base de datos:**
   - Migrar desde JSON a SQLite/PostgreSQL
   - Usar migrations con Alembic

3. **Carrito Persistente:**
   - Guardar en base de datos
   - Recuperar al loguearse

4. **Pasarela de Pago:**
   - Integrar Stripe/MercadoPago
   - Generar transacciones reales

5. **Admin Panel:**
   - CRUD de productos
   - Gestión de pedidos
   - Reportes

6. **Tests:**
   - Unit tests con pytest (backend)
   - Integration tests with Jest (frontend)

7. **Despliegue:**
   - Docker
   - Railway/Vercel/Heroku

## Notas de Seguridad

- ❌ CORS abierto - solo para desarrollo
- ❌ Sin autenticación - cualquiera puede crear pedidos
- ❌ Sin validación de pago - es simulada
- ❌ Contraseñas en texto plano - no hay datos sensibles

Para producción:
- ✅ CORS restringido
- ✅ Autenticación JWT
- ✅ HTTPS
- ✅ Base de datos segura
- ✅ Variables de entorno para secrets
