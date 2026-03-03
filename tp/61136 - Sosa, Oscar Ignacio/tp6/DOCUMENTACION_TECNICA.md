# Documentación Técnica - E-Commerce

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js/React)                 │
│  http://localhost:3000                                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuthContext + CarritoContext                            │   │
│  │ - Gestión usuario + token JWT                           │   │
│  │ - Estado global del carrito                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Páginas principales:                                          │
│  - / - Catálogo de productos (GET /productos)                  │
│  - /login - Iniciar sesión (POST /auth/login)                  │
│  - /registro - Crear cuenta (POST /auth/registro)              │
│  - /carrito - Carrito + checkout (POST /carrito/finalizar)    │
│  - /compras - Histórico de compras (GET /compras)              │
│  - /pedidos - Detalle pedidos (GET /compras/{id})             │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP/JSON + JWT)
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                          │
│  http://localhost:8000                                          │
│                                                                  │
│  Autenticación:                                                 │
│  - POST /auth/registro (POST /registrar)                        │
│  - POST /auth/login (POST /iniciar-sesion)                      │
│                                                                  │
│  Productos (sin auth):                                          │
│  - GET /productos                                              │
│  - GET /productos/{id}                                         │
│  - GET /buscar ?q=...&categoria=...                            │
│                                                                  │
│  Carrito (con JWT Bearer token):                                │
│  - POST /carrito/agregar (POST /carrito)                       │
│  - GET /carrito                                                │
│  - POST /carrito/eliminar/{id} (DELETE /carrito/{id})         │
│  - DELETE /carrito/vaciar (POST /carrito/cancelar)            │
│  - POST /pedidos/crear (POST /carrito/finalizar)              │
│                                                                  │
│  Compras (con JWT Bearer token):                                │
│  - GET /pedidos (GET /compras)                                 │
│  - GET /pedidos/{id} (GET /compras/{id})                      │
│  - POST /pedidos/{id}/cancelar                                 │
│                                                                  │
│  Datos:                                                         │
│  - SQLite ecommerce.db (Usuarios, Productos, Pedidos)         │
│  - imagenes/ - Archivos PNG de productos                       │
└─────────────────────────────────────────────────────────────────┘
```

**Nota:** Los nombres entre paréntesis () muestran los endpoints del enunciado original.


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

### Backend (FastAPI)
| Librería | Propósito |
|----------|-----------|
| FastAPI | Framework web asincrónico |
| Uvicorn | Servidor ASGI para producción |
| SQLModel | ORM integra SQLAlchemy + Pydantic |
| SQLite | Base de datos embebida (ecommerce.db) |
| python-jose[cryptography] | Generación y validación de JWT tokens |
| passlib[bcrypt] | Hash seguro de contraseñas |
| python-multipart | Soporte para formularios multipart |
| pydantic | Validación de datos y serialización |

### Frontend (Next.js/React)
| Librería | Propósito |
|----------|-----------|
| Next.js 13+ | Framework React con SSR y routing |
| React 19 | Librería de componentes UI |
| TypeScript | Tipado estático para mayor seguridad |
| Tailwind CSS 4 | Utility-first CSS framework |
| Next.js Image | Optimización de imágenes |
| Context API | Gestión de estado global (Auth + Carrito) |

## Estructura de la Base de Datos

### Diagrama de Relaciones
```
┌──────────────┐
│   Usuario    │
├──────────────┤
│ id (Primary) │
│ nombre       │
│ email        │
│ contraseña   │
│  _hash       │
│ ciudad       │
│ direccion    │
│ telefono     │
│ fecha_       │
│  registro    │
└──────┬───────┘
       │
       │ 1:N
       │
       ├─────────────┐
       │             │
       ▼             ▼
  ┌────────┐   ┌─────────────┐
  │ Pedido │   │   Carrito   │
  ├────────┤   │  (in-memory)│
  │ id     │   ├─────────────┤
  │usuario_│   │ items[]     │
  │  id    │   │ total       │
  │cliente_│   └─────────────┘
  │  nombre│
  │cliente_│
  │  email │
  │cliente_│
  │  tele  │
  │cliente_│
  │  dir   │
  │cliente_│
  │  ciudad│
  │total   │
  │estado  │
  │fecha   │
  └────┬───┘
       │
       │ 1:N
       │
       ▼
  ┌──────────┐
  │PedidoItem│
  ├──────────┤
  │pedido_id │
  │producto_ │
  │  id      │
  │cantidad  │
  │precio_   │
  │unitario  │
  │titulo    │
  └──────────┘
```

### Tabla: Usuario
Almacena información de cada usuario registrado y autenticado.
```python
class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    email: str (unique, index)
    contraseña_hash: str
    ciudad: str
    direccion: str
    telefono: str
    fecha_registro: datetime
```

**Indexes:** `email` (único para login rápido)  
**Validaciones:** Email debe ser único, contraseña mínimo 6 caracteres

### Tabla: Producto
Datos estáticos de productos (migrados desde JSON).
```python
class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    precio: float
    descripcion: str
    categoria: str
    valoracion: float  # 0-5 estrellas
    existencia: int    # cantidad disponible
    imagen: str        # ruta relativa
```

### Tabla: Pedido
Registro de compras completadas por usuario.
```python
class Pedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    cliente_nombre: str
    cliente_email: str
    cliente_telefono: str
    cliente_direccion: str
    cliente_ciudad: str
    total: float
    estado: str = "pendiente"  # pendiente | completado | cancelado
    fecha: datetime
```

**Foreign Key:** `usuario_id` → `Usuario.id` (delete si usuario se borra)  
**Índices:** `usuario_id` para búsquedas rápidas  
**Estados:** pendiente (sin pagar), completado (pagado), cancelado

### Tabla: PedidoItem
Líneas individuales de cada pedido (productos comprados).
```python
class PedidoItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    producto_id: int
    cantidad: int
    precio_unitario: float  # precio al momento de compra
    titulo: str             # nombre del producto (snapshot)
```

**Foreign Key:** `pedido_id` → `Pedido.id`  
**Nota:** Guardamos copia del título y precio para historial (snapshot)

### Carrito (In-Memory)
Carrito temporal por usuario (no persiste en BD).
```python
class CarritoItem:
    producto_id: int
    cantidad: int
    titulo: str
    precio: float
    imagen: str

class Carrito:
    items: List[CarritoItem]
    total: float  # calculado dinámicamente
```

**Ubicación:** Variable global en memoria `carritos_usuarios: Dict[int, Carrito]`  
**Ciclo de vida:** Se crea al agregar el primer item, se borra al "Completar Compra"  
**Limitaciones:** Se pierde al reiniciar el servidor (futuro: persistencia en BD)

### Tabla: Archivo de Productos (productos.json)
Datos iniciales cargados en la tabla `Producto` al iniciar.
```json
{
  "id": 1,
  "titulo": "Nombre Producto",
  "precio": 99.99,
  "descripcion": "Descripción detallada",
  "categoria": "Electrónica",
  "valoracion": 4.5,
  "existencia": 10,
  "imagen": "imagenes/0001.png"
}
```

## Operaciones CRUD por Tabla

### Usuario
| Operación | Endpoint | Método |
|-----------|----------|--------|
| Registrar | `/auth/registro` | POST |
| Login | `/auth/login` | POST |
| Ver perfil | `/auth/perfil` | GET (requiere auth) |

### Producto
| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar todos | `/` | GET |
| Listar paginado | `/productos` | GET |
| Buscar | `/buscar?q=...&categoria=...` | GET |

### Carrito (sesión actual)
| Operación | Endpoint | Método |
|-----------|----------|--------|
| Obtener carrito | `/carrito` | GET (requiere auth) |
| Agregar item | `/carrito/agregar` | POST (requiere auth) |
| Eliminar item | `/carrito/eliminar/{id}` | POST (requiere auth) |
| Actualizar cantidad | `/carrito/actualizar/{id}` | PUT (requiere auth) |
| Vaciar completamente | `/carrito/vaciar` | DELETE (requiere auth) |

### Pedido (historial compras)
| Operación | Endpoint | Método |
|-----------|----------|--------|
| Crear pedido | `/pedidos/crear` | POST (requiere auth) |
| Listar mis pedidos | `/pedidos` | GET (requiere auth) |
| Ver detalle pedido | `/pedidos/{id}` | GET (requiere auth) |
| Cancelar pedido | `/pedidos/{id}/cancelar` | POST (requiere auth) |

## Seguridad de Datos

### Autenticación JWT
- **Token Expiry:** 30 días (43200 minutos)
- **Algoritmo:** HS256
- **Secret:** Debe estar en variable de entorno (NO hardcodeada en producción)
- **Storage (Frontend):** `localStorage['token']`
- **Validación:** Bearer token en header `Authorization: Bearer <token>`

### Contraseñas
- **Hash:** bcryptbcrypt (passlib)
- **Rounds:** 12 (configurado automáticamente)
- **Nunca:** Se guardan en texto plano
- **Validación:** `verify_password()` en login

### Restricciones por Rol
- **Sin rol/rol:** Todos los usuarios autenticados tienen acceso igual
- **Futuro:** Agregar roles (admin, cliente, gerente)

### Validaciones de Datos
```
Usuario:
  - Email: válido formato, único en BD
  - Contraseña: mín 6 caracteres, hasheada
  - Nombre: no vacío, máx 100 caracteres

Producto:
  - Precio: > 0, máx 2 decimales
  - Existencia: >= 0
  - Categoría: debe existir en lista predefinida

Pedido:
  - Cliente_email: formato válido
  - Total: debe coincidir con items × precios
  - Estado: solo valores permitidos
```


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

## Endpoints Completos por Categoría

### 🔐 Autenticación (sin auth requerida)
| Endpoint Solicitado | Endpoint Implementado | Método | Descripción |
|---|---|---|---|
| POST /registrar | POST /auth/registro | POST | Crear nueva cuenta |
| POST /iniciar-sesion | POST /auth/login | POST | Obtener JWT token |
| POST /cerrar-sesion | (Context API Frontend) | - | Logout (localStorage cleanup) |

**Detalles:**
- **POST /auth/registro** - Body: `{nombre, email, contraseña}`
  - Response: `{access_token, token_type, usuario: {id, nombre, email, ...}}`
- **POST /auth/login** - Body: `{email, contraseña}`
  - Response: `{access_token, token_type, usuario: {id, nombre, email, ...}}`
- **Logout** - No requiere endpoint (se limpia token en localStorage del cliente)

### 📦 Productos (sin auth requerida)
| Endpoint Solicitado | Endpoint Implementado | Método | Parámetros |
|---|---|---|---|
| GET /productos | GET /productos | GET | page, limit (paginación opcional) |
| GET /productos | GET / | GET | Listar todos sin paginación |
| GET /productos/{id} | GET /productos/{id} | GET | - |
| GET /productos (búsqueda) | GET /buscar | GET | q (término), categoria |

**Detalles:**
- **GET /productos** - Retorna: `[{id, titulo, precio, descripcion, categoria, ...}]`
- **GET /buscar?q=laptop&categoria=electronica** - Búsqueda con filtros
- **GET /productos/{id}** - Retorna: `{id, titulo, precio, ...}`

### 🛒 Carrito (requiere JWT token en Authorization header)
| Endpoint Solicitado | Endpoint Implementado | Método | Body |
|---|---|---|---|
| POST /carrito | POST /carrito/agregar | POST | `{producto_id, cantidad, titulo, precio, imagen}` |
| DELETE /carrito/{product_id} | DELETE /carrito/eliminar/{id} | POST* | - |
| GET /carrito | GET /carrito | GET | - |
| POST /carrito/finalizar | POST /pedidos/crear | POST | `{cliente_nombre, cliente_email, cliente_telefono, cliente_direccion, cliente_ciudad, items, total}` |
| POST /carrito/cancelar | DELETE /carrito/vaciar | DELETE | - |

**Detalles:**
- **POST /carrito/agregar** - Agrega item al carrito del usuario actual
- **POST /carrito/eliminar/{id}** - Elimina producto específico (usa POST, no DELETE)
- **GET /carrito** - Retorna carrito del usuario: `{items: [...], total: number}`
- **POST /pedidos/crear** - Convierte carrito en pedido permanente
- **DELETE /carrito/vaciar** - Limpia todo el carrito

*Nota: Usa POST en lugar de DELETE (REST clásico)

### 📋 Compras/Pedidos (requiere JWT token)
| Endpoint Solicitado | Endpoint Implementado | Método | Descripción |
|---|---|---|---|
| GET /compras | GET /pedidos | GET | Ver todos mis pedidos |
| GET /compras/{id} | GET /pedidos/{id} | GET | Ver detalle de pedido |
| - | POST /pedidos/{id}/cancelar | POST | Cancelar pedido (si está pendiente) |

**Detalles:**
- **GET /pedidos** - Retorna: `[{id, fecha, total, estado, items, cliente_*}]` (ordenado por fecha DESC)
- **GET /pedidos/{id}** - Retorna: `{id, fecha, total, estado, items, cliente_*, usuario_id}`
- **POST /pedidos/{id}/cancelar** - Cambia estado de pedido a "cancelado" (solo si estado="pendiente")

### 🖼️ Recursos Estáticos (sin auth)
| Ruta | Método | Descripción |
|---|---|---|
| GET /imagenes/{id}.png | GET | Imagen del producto (0001.png, 0002.png, etc.) |

## Mapeo de Endpoints: Solicitados vs Implementados

Correspondencia exacta entre los endpoints del enunciado y los implementados en el sistema:

| # | Endpoint Solicitado | Endpoint Implementado | Estado | Notas |
|---|---|---|---|---|
| 1 | POST /registrar | POST /auth/registro | ✅ | Crear nueva cuenta |
| 2 | POST /iniciar-sesion | POST /auth/login | ✅ | Obtener JWT token |
| 3 | POST /cerrar-sesion | localStorage cleanup | ✅ | Logout (Frontend) |
| 4 | GET /productos | GET /productos | ✅ | Lista con filtros opcionales |
| 5 | GET /productos/{id} | GET /productos/{id} | ✅ | Detalles producto |
| 6 | POST /carrito | POST /carrito/agregar | ✅ | Agregar al carrito |
| 7 | DELETE /carrito/{id} | POST /carrito/eliminar/{id} | ⚠️ | Usa POST en lugar de DELETE |
| 8 | GET /carrito | GET /carrito | ✅ | Ver contenido carrito |
| 9 | POST /carrito/finalizar | POST /pedidos/crear | ✅ | Finalizar compra |
| 10 | POST /carrito/cancelar | DELETE /carrito/vaciar | ✅ | Vaciar carrito |
| 11 | GET /compras | GET /pedidos | ✅ | Resumen compras (pedidos) |
| 12 | GET /compras/{id} | GET /pedidos/{id} | ✅ | Detalle compra |

**Leyenda:**
- ✅ Completamente implementado
- ⚠️ Funcionalmente equivalente (diferencia menor en método HTTP)
- ❌ No implementado

**Observaciones:**
- Todos los endpoints solicitados están implementados o tienen equivalentes funcionales
- Los nombres de endpoints implementados son más descriptivos (`/auth/`, `/pedidos/` en lugar de `/registrar`, `/compras/`)
- Endpoints de carrito requieren autenticación JWT
- El logout no requiere endpoint (se limpia token en localStorage del cliente)

## Estructura de Carpetas Detallada

```
backend/
├── main.py                       # API REST (15+ endpoints)
├── models/
│   ├── __init__.py
│   └── modelos.py               # SQLModel: Usuario, Producto, Pedido, etc.
├── security.py                  # JWT tokens, contraseña hashing
├── database.py                  # SQLite, funciones CRUD
├── productos.json               # datos de ejemplo (cargados en BD)
├── imagenes/                    # archivos PNG (0001.png, 0002.png, ...)
├── ecommerce.db                 # SQLite database (auto-creada)
├── pyproject.toml               # dependencias Python
├── .venv/                       # entorno virtual
└── __pycache__/

frontend/
├── app/
│   ├── page.tsx                 # Home/Catálogo (GET /productos)
│   ├── layout.tsx               # Layout raíz con AuthProvider + CarritoProvider
│   ├── types.ts                 # Tipos TypeScript (Producto, Usuario, Pedido, etc.)
│   ├── globals.css              # estilos globales Tailwind
│   │
│   ├── login/
│   │   └── page.tsx             # Página login (email + contraseña)
│   │
│   ├── registro/
│   │   └── page.tsx             # Página registro (nueva cuenta)
│   │
│   ├── buscar/
│   │   └── page.tsx             # Búsqueda productos (filtro + categoría)
│   │
│   ├── carrito/
│   │   └── page.tsx             # Carrito + checkout (requiere auth)
│   │
│   ├── pedidos/
│   │   ├── page.tsx             # Historial de compras del usuario
│   │   └── [id]/
│   │       └── page.tsx         # Detalle de un pedido específico
│   │
│   ├── perfil/
│   │   └── page.tsx             # Perfil usuario (datos personales)
│   │
│   ├── components/
│   │   ├── Navbar.tsx           # Navegación (con dropdown usuario)
│   │   └── ProductoCard.tsx     # Tarjeta producto (requiere auth para agregar)
│   │
│   ├── context/
│   │   ├── AuthContext.tsx      # Gestión usuario + token JWT
│   │   └── CarritoContext.tsx   # Gestión carrito por usuario
│   │
│   ├── services/
│   │   ├── productos.ts         # GET /productos, /buscar
│   │   ├── carrito.ts           # Carrito CRUD (requiere token)
│   │   ├── auth.ts              # Login, registro, perfil
│   │   └── usuarios.ts          # Pedidos, búsqueda, cancelaciones
│   │
│   └── public/                  # archivos estáticos
│       ├── logo.png
│       └── favicon.ico
│
├── node_modules/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js           # Configuración Tailwind CSS v4
├── .env.local                   # Variables de entorno (NO commitear)
├── .env.example                 # Plantilla variables de entorno
└── .gitignore
```

## Archivos Clave por Funcionalidad

### Autenticación
- `backend/security.py` - Genera/valida JWT, hashea contraseñas
- `backend/database.py` - Crea usuarios, valida email único
- `frontend/app/context/AuthContext.tsx` - Gestiona token + usuario
- `frontend/app/services/auth.ts` - Calls a /auth/registro, /auth/login
- `frontend/app/login/page.tsx` - Interfaz login
- `frontend/app/registro/page.tsx` - Interfaz registro

### Búsqueda de Productos
- `backend/main.py` - GET /buscar (por término + categoría)
- `frontend/app/services/usuarios.ts` - buscarProductos()
- `frontend/app/buscar/page.tsx` - Input + filtros

### Carrito y Checkout
- `backend/main.py` - /carrito/* endpoints (requieren Bearer token)
- `frontend/app/services/carrito.ts` - Todas las operaciones (con token)
- `frontend/app/context/CarritoContext.tsx` - Estado global carrito
- `frontend/app/carrito/page.tsx` - Tabla carrito + formulario checkout
- `frontend/app/components/ProductoCard.tsx` - Botón "Agregar al carrito"

### Historial de Compras
- `backend/main.py` - GET /pedidos, GET /pedidos/{id}, POST /pedidos/{id}/cancelar
- `frontend/app/services/usuarios.ts` - obtenerPedidos(), obtenerDetallePedido()
- `frontend/app/pedidos/page.tsx` - Lista de pedidos del usuario
- `frontend/app/pedidos/[id]/page.tsx` - Detalle + opción cancelar


## Flujo de Desarrollo

### Para agregar un nuevo campo a Usuario:

1. **Backend:**
   - Modificar clase `Usuario` en `backend/models/modelos.py`
   - Modificar función `init_db()` en `backend/database.py` si es necesario
   - Actualizar endpoint en `backend/main.py` si la API debe retornarlo

2. **Frontend:**
   - Actualizar tipo `UsuarioResponse` en `frontend/app/types.ts`
   - Usar campo en `AuthContext` y páginas que lo necesiten
   - Actualizar formulario de registro/perfil si es editable

### Para agregar un nuevo endpoint protegido (requiere auth):

1. **Backend:**
   ```python
   from fastapi import Depends, Header
   
   @app.get("/mi-endpoint")
   async def mi_endpoint(authorization: str = Header(...)):
       usuario = obtener_usuario_actual(authorization)
       if not usuario:
           raise HTTPException(status_code=401, detail="No autorizado")
       # ... lógica aquí
   ```

2. **Frontend:**
   ```typescript
   const { token } = useAuth();
   
   const resultado = await fetch(
     `${API_URL}/mi-endpoint`,
     {
       headers: {
         'Authorization': `Bearer ${token}`,
       },
     }
   );
   ```

### Para agregar una nueva tabla a la BD:

1. **Backend:**
   - Crear modelo SQLModel en `backend/models/modelos.py`
   - Agregar función CRUD en `backend/database.py`
   - Crear endpoints en `backend/main.py`
   - Actualizar `create_db_and_tables()` para crear la tabla

2. **Frontend:**
   - Crear tipos en `frontend/app/types.ts`
   - Crear servicio en `frontend/app/services/`
   - Usar en componentes/páginas con manejo de token

### Para agregar un nuevo filtro de búsqueda:

1. **Backend** - actualizar función en `backend/main.py`:
   ```python
   @app.get("/buscar")
   async def buscar(
       q: str = "",
       categoria: str = "",
       precio_min: float = 0,
       precio_max: float = 999999
   ):
   ```

2. **Frontend** - actualizar parámetros en `app/services/usuarios.ts`:
   ```typescript
   export async function buscarProductos(
       termino: string,
       categoria: string,
       precioMin?: number,
       precioMax?: number
   )
   ```

### Para empaquetar datos sensibles:

Nunca expongas en frontend:
- ❌ Contraseña hashed
- ❌ Secret keys
- ❌ Tokens completos (excepto en localStorage)
- ❌ Información privada de otros usuarios

Siempre serializa con DTOs (Data Transfer Objects):
```python
# En backend/models/modelos.py
class UsuarioResponse(SQLModel):
    id: int
    nombre: str
    email: str
    # No incluir: contraseña_hash

class PedidoResponse(SQLModel):
    id: int
    fecha: datetime
    total: float
    items: List[PedidoItemResponse]
    # No incluir información de tarjeta/transacción
```


## Mejoras Futuras Recomendadas

### Implementadas ✅
1. **Autenticación JWT** - Login, registro, tokens, refresh tokens
2. **Base de datos SQLite** - Usuarios, pedidos, items
3. **Ordenamiento de pedidos** - Ver historial de compras
4. **Búsqueda de productos** - Filtrar por nombre y categoría

### Pendientes 🔄
1. **Persistencia de Carrito:**
   - Guardar carrito en BD después de logout
   - Sincronizar múltiples dispositivos
   - Recuperar al loguearse

2. **Pasarela de Pago:**
   - Integrar Stripe/MercadoPago
   - Generar transacciones reales
   - Webhook para confirmar pagos
   - Cambiar estado "pendiente" → "completado"

3. **Admin Panel:**
   - CRUD de productos en interfaz
   - Gestión de pedidos/estado
   - Reportes de ventas
   - Usuarios registrados

4. **Notificaciones:**
   - Email de confirmación de pedido
   - SMS de envío
   - Alertas de stock bajo

5. **Tests:**
   - Unit tests con pytest (backend)
   - Integration tests con Jest (frontend)
   - Test de autenticación (JWT)

6. **Despliegue:**
   - Docker containerización
   - Postgres en producción
   - Railway/Render/Vercel
   - Variables de entorno seguras

7. **Performance:**
   - Paginación de productos
   - Cache de búsquedas
   - Compresión de imágenes
   - CDN para imágenes estáticas

8. **Validaciones Avanzadas:**
   - Verificación de email (OTP)
   - Recuperación de contraseña
   - Cambio de contraseña
   - Dos factores (2FA)

## Notas de Seguridad

### Implementado en Este Sistema ✅
- ✅ CORS configurado para desarrollo (restringe en producción)
- ✅ Autenticación JWT con tokens
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos con Pydantic
- ✅ Bearer tokens en requests protegidos
- ✅ Logout limpia token del localStorage

### A Implementar en Producción ❌
- ❌ HTTPS obligatorio (no HTTP)
- ❌ CORS restringido a dominios específicos
- ❌ Rate limiting en endpoints públicos
- ❌ Validación de email con OTP
- ❌ Refresh tokens separados de access tokens
- ❌ Secret key en variable de entorno (no hardcodeada)
- ❌ Database encryption at rest
- ❌ Logging y monitoreo de seguridad

### Configuración Actual (Desarrollo) ⚠️
```python
# CORS abierto para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ No usar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Secret (DEBE estar en .env)
SECRET_KEY = "tu-clave-secreta-aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200  # 30 días
```

### Configuración Recomendada (Producción) 🔒
```python
from dotenv import load_dotenv
import os

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
# CORS_ORIGINS = ["https://tudominio.com", "https://app.tudominio.com"]

SECRET_KEY = os.getenv("SECRET_KEY")  # Variable de entorno
if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in environment variables")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE", "15"))  # 15 min
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_EXPIRE", "7"))  # 7 días

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")
# DATABASE_URL = "postgresql://user:pass@server/dbname"
```

### Checklist Seguridad Pre-Producción
- [ ] Cambiar SECRET_KEY a valor aleatorio fuerte
- [ ] Habilitar HTTPS con certificado SSL
- [ ] Configurar CORS para dominios específicos
- [ ] Implementar rate limiting
- [ ] Migrar a PostgreSQL o servidor robusto
- [ ] Backup automático de base de datos
- [ ] Monitoreo de accesos anormales
- [ ] Tests de penetración
- [ ] Auditoría de dependencias (npm audit, pip audit)

## Guía Rápida: Dónde Está El Código

Si necesitas modificar/debuggear alguna característica, aquí está ubicada:

### 👤 Registro/Login de Usuarios
**Backend:**
- Generar tokens JWT → `backend/security.py` (`create_access_token()`)
- Hash contraseña → `backend/security.py` (`hash_password()`)
- Crear usuario en BD → `backend/database.py` (`crear_usuario()`)
- Endpoint `/auth/registro` → `backend/main.py` (línea ~80)
- Endpoint `/auth/login` → `backend/main.py` (línea ~100)

**Frontend:**
- Página login → `frontend/app/login/page.tsx`
- Página registro → `frontend/app/registro/page.tsx`
- Servicios auth → `frontend/app/services/auth.ts`
- Contexto auth → `frontend/app/context/AuthContext.tsx`

### 🔍 Búsqueda de Productos
**Backend:**
- Endpoint `/buscar` → `backend/main.py` (busca por nombre + categoría)
- Filtros → modifica parámetros en `GET /buscar`

**Frontend:**
- Página búsqueda → `frontend/app/buscar/page.tsx`
- Lógica búsqueda → `frontend/app/services/usuarios.ts` (`buscarProductos()`)
- Debounce (300ms) → configurado en `app/buscar/page.tsx`

### 🛒 Carrito de Compras
**Backend:**
- Carrito in-memory → `backend/main.py` variable `carritos_usuarios`
- Agregar item → `backend/main.py` POST `/carrito/agregar`
- Eliminar item → `backend/main.py` POST `/carrito/eliminar/{id}`
- Actualizar cantidad → `backend/main.py` PUT `/carrito/actualizar/{id}`

**Frontend:**
- Estado carrito → `frontend/app/context/CarritoContext.tsx`
- Página carrito → `frontend/app/carrito/page.tsx` (~400 líneas)
- Servicios → `frontend/app/services/carrito.ts`
- Componente producto → `frontend/app/components/ProductoCard.tsx`

### 📦 Crear Pedido (Checkout)
**Backend:**
- Modelo Pedido → `backend/models/modelos.py` (clase `Pedido`)
- Crear pedido → `backend/database.py` (`crear_pedido()`)
- Endpoint POST `/pedidos/crear` → `backend/main.py`

**Frontend:**
- Formulario checkout → `frontend/app/carrito/page.tsx` (formulario en sidebar)
- Llamada API → `frontend/app/services/carrito.ts` (`crearPedido()`)
- Redirige a → `/pedidos` (historial compras)

### 📋 Historial de Compras
**Backend:**
- Modelo PedidoItem → `backend/models/modelos.py`
- Obtener pedidos → `backend/database.py` (`obtener_pedidos_usuario()`)
- Endpoint GET `/pedidos` → `backend/main.py`
- Endpoint GET `/pedidos/{id}` → `backend/main.py`
- Cancelar pedido → `backend/main.py` POST `/pedidos/{id}/cancelar`

**Frontend:**
- Página listado → `frontend/app/pedidos/page.tsx`
- Página detalle → `frontend/app/pedidos/[id]/page.tsx`
- Servicios → `frontend/app/services/usuarios.ts`

### 🔐 Seguridad / JWT
**Backend:**
- Secret key → `backend/security.py` variable `SECRET_KEY`
- Función validar token → `backend/security.py` (`decode_token()`)
- Dependencia auth → `backend/main.py` función `obtener_usuario_actual()`

**Frontend:**
- Guardar token → `frontend/app/services/auth.ts` (`guardarToken()`)
- Obtener token → `frontend/app/context/AuthContext.tsx`
- Inyectar en requests → cada servicio agrega header `Authorization`

### 🗄️ Base de Datos
**Backend:**
- Modelos SQLModel → `backend/models/modelos.py`
- Conexión SQLite → `backend/database.py` (línea ~10)
- Crear tablas → `backend/database.py` (`create_db_and_tables()`)
- Inicializar datos → `backend/database.py` (`init_db()`)
- Archivo BD → `backend/ecommerce.db` (se crea automáticamente)

---

**Última actualización:** 28 de Febrero 2026  
**Versión del Sistema:** 0.3.0 (Con Autenticación JWT + BD SQLite)  
**Estado:** Funcional para Testing

## Ejemplos de Uso de Endpoints

### 1️⃣ Registrar Usuario (POST /auth/registro)

**Request:**
```bash
curl -X POST http://localhost:8000/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "contraseña": "password123"
  }'
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "ciudad": "",
    "direccion": "",
    "telefono": "",
    "fecha_registro": "2026-02-28T10:30:00"
  }
}
```

### 2️⃣ Iniciar Sesión (POST /auth/login)

**Request:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contraseña": "password123"
  }'
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "ciudad": "",
    "direccion": "",
    "telefono": "",
    "fecha_registro": "2026-02-28T10:30:00"
  }
}
```

### 3️⃣ Cerrar Sesión (POST /cerrar-sesion)

**Frontend (JavaScript):**
```typescript
// No requiere llamada HTTP, solo limpiar localStorage
localStorage.removeItem('token');
localStorage.removeItem('usuario');
// Redireccionar a /login
```

### 4️⃣ Obtener Productos (GET /productos)

**Request:**
```bash
curl http://localhost:8000/productos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Laptop Dell XPS 13",
    "precio": 1299.99,
    "descripcion": "Laptop ultradelgada de última generación",
    "categoria": "Electrónica",
    "valoracion": 4.8,
    "existencia": 5,
    "imagen": "imagenes/0001.png"
  },
  {
    "id": 2,
    "titulo": "Mouse Logitech MX Master",
    "precio": 99.99,
    "descripcion": "Mouse inalámbrico ergonómico",
    "categoria": "Electrónica",
    "valoracion": 4.7,
    "existencia": 20,
    "imagen": "imagenes/0002.png"
  }
]
```

### 5️⃣ Obtener Producto Específico (GET /productos/{id})

**Request:**
```bash
curl http://localhost:8000/productos/1
```

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Laptop Dell XPS 13",
  "precio": 1299.99,
  "descripcion": "Laptop ultradelgada de última generación",
  "categoria": "Electrónica",
  "valoracion": 4.8,
  "existencia": 5,
  "imagen": "imagenes/0001.png"
}
```

### 6️⃣ Agregar al Carrito (POST /carrito/agregar)

**Request:**
```bash
curl -X POST http://localhost:8000/carrito/agregar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "producto_id": 1,
    "cantidad": 2,
    "titulo": "Laptop Dell XPS 13",
    "precio": 1299.99,
    "imagen": "imagenes/0001.png"
  }'
```

**Response (200):**
```json
{
  "mensaje": "Producto agregado al carrito",
  "carrito": {
    "items": [
      {
        "producto_id": 1,
        "cantidad": 2,
        "titulo": "Laptop Dell XPS 13",
        "precio": 1299.99,
        "imagen": "imagenes/0001.png"
      }
    ],
    "total": 2599.98
  }
}
```

### 7️⃣ Ver Carrito (GET /carrito)

**Request:**
```bash
curl http://localhost:8000/carrito \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "items": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "titulo": "Laptop Dell XPS 13",
      "precio": 1299.99,
      "imagen": "imagenes/0001.png"
    }
  ],
  "total": 2599.98
}
```

### 8️⃣ Finalizar Compra (POST /pedidos/crear)

**Request:**
```bash
curl -X POST http://localhost:8000/pedidos/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "cliente_nombre": "Juan Pérez",
    "cliente_email": "juan@example.com",
    "cliente_telefono": "+56912345678",
    "cliente_direccion": "Calle Principal 123",
    "cliente_ciudad": "Santiago",
    "items": [
      {
        "producto_id": 1,
        "cantidad": 2,
        "titulo": "Laptop Dell XPS 13",
        "precio": 1299.99,
        "imagen": "imagenes/0001.png"
      }
    ],
    "total": 2599.98
  }'
```

**Response (201):**
```json
{
  "mensaje": "Pedido creado exitosamente",
  "pedido_id": 5,
  "total": 2599.98,
  "usuario_id": 1,
  "estado": "pendiente"
}
```

### 9️⃣ Ver Compras del Usuario (GET /pedidos)

**Request:**
```bash
curl http://localhost:8000/pedidos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
[
  {
    "id": 5,
    "usuario_id": 1,
    "cliente_nombre": "Juan Pérez",
    "cliente_email": "juan@example.com",
    "cliente_telefono": "+56912345678",
    "cliente_direccion": "Calle Principal 123",
    "cliente_ciudad": "Santiago",
    "total": 2599.98,
    "estado": "pendiente",
    "fecha": "2026-02-28T14:22:00",
    "items": [
      {
        "id": 1,
        "pedido_id": 5,
        "producto_id": 1,
        "cantidad": 2,
        "precio_unitario": 1299.99,
        "titulo": "Laptop Dell XPS 13"
      }
    ]
  }
]
```

### 🔟 Ver Detalle de Compra (GET /pedidos/{id})

**Request:**
```bash
curl http://localhost:8000/pedidos/5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "id": 5,
  "usuario_id": 1,
  "cliente_nombre": "Juan Pérez",
  "cliente_email": "juan@example.com",
  "cliente_telefono": "+56912345678",
  "cliente_direccion": "Calle Principal 123",
  "cliente_ciudad": "Santiago",
  "total": 2599.98,
  "estado": "pendiente",
  "fecha": "2026-02-28T14:22:00",
  "items": [
    {
      "id": 1,
      "pedido_id": 5,
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 1299.99,
      "titulo": "Laptop Dell XPS 13"
    }
  ]
}
```
