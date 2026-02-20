# E-Commerce con React (Next.js) y FastAPI

Sitio de comercio electrónico completo con frontend moderno y backend API REST.

## 📋 Requisitos Previos

### Windows

1. **Python 3.13 o superior**
   - Descargar desde: https://www.python.org/downloads/
   - Marcar "Add Python to PATH" durante la instalación

2. **Node.js 20 o superior**
   - Descargar desde: https://nodejs.org/
   - Instalar la versión LTS

3. **uv (Gestor de paquetes Python)**
   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

## 🚀 Instalación y Ejecución

### Backend (FastAPI)

1. Abre PowerShell/CMD y navega a la carpeta del backend:
   ```powershell
   cd backend
   ```

2. Instala las dependencias:
   ```powershell
   uv sync
   ```

3. Inicia el servidor:
   ```powershell
   uv run uvicorn main:app --reload
   ```

El backend estará disponible en: **http://localhost:8000**

**Documentación interactiva (Swagger):** http://localhost:8000/docs

### Frontend (Next.js)

1. Abre una nueva terminal PowerShell/CMD y navega a la carpeta del frontend:
   ```powershell
   cd frontend
   ```

2. Instala las dependencias:
   ```powershell
   npm install
   ```

3. (Opcional) Crea archivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Inicia el servidor de desarrollo:
   ```powershell
   npm run dev
   ```

El frontend estará disponible en: **http://localhost:3000**

## 📁 Estructura del Proyecto

```
tp6/
├── backend/
│   ├── main.py              # Punto de entrada de la API
│   ├── models/
│   │   ├── __init__.py
│   │   └── modelos.py       # Modelos de datos
│   ├── productos.json       # Datos iniciales de productos
│   ├── imagenes/            # Imágenes de productos
│   ├── pyproject.toml       # Dependencias Python
│   └── api-tests.http       # Tests con REST Client
│
└── frontend/
    ├── app/
    │   ├── page.tsx         # Página principal (catálogo)
    │   ├── carrito/
    │   │   └── page.tsx     # Página del carrito
    │   ├── layout.tsx       # Layout general
    │   ├── types.ts         # Tipos TypeScript
    │   ├── context/
    │   │   └── CarritoContext.tsx  # Context del carrito
    │   ├── services/
    │   │   ├── productos.ts # Servicios de productos
    │   │   └── carrito.ts   # Servicios del carrito
    │   └── components/
    │       ├── Navbar.tsx   # Barra de navegación
    │       └── ProductoCard.tsx  # Tarjeta de producto
    ├── package.json
    ├── next.config.js
    └── tsconfig.json
```

## ✨ Características

### Backend API
- ✅ Listar todos los productos
- ✅ Obtener detalles de un producto
- ✅ Gestión de carrito (agregar, eliminar, actualizar)
- ✅ Crear pedidos
- ✅ Servir imágenes estáticas
- ✅ Documentación automática con Swagger

### Frontend Web
- ✅ Catálogo de productos con vista en grid
- ✅ Sistema de carrito con React Context
- ✅ Agregación de productos al carrito
- ✅ Página dedicada al carrito
- ✅ Gestión de cantidades
- ✅ Formulario de checkout
- ✅ Interfaz responsiva con Tailwind CSS
- ✅ Navegación entre páginas

## 🔧 Endpoints API

### Productos
- `GET /` - Información de la API
- `GET /productos` - Listar todos los productos
- `GET /productos/{id}` - Obtener un producto específico

### Carrito
- `GET /carrito` - Obtener carrito actual
- `POST /carrito/agregar` - Agregar producto al carrito
- `POST /carrito/eliminar/{producto_id}` - Eliminar producto
- `PUT /carrito/actualizar/{producto_id}` - Actualizar cantidad
- `DELETE /carrito/vaciar` - Vaciar carrito

### Pedidos
- `POST /pedidos/crear` - Crear un nuevo pedido

## 🎨 Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno con Python
- **Uvicorn** - Servidor ASGI
- **SQLModel** - ORM con soporte para tipos
- **Pydantic** - Validación de datos

### Frontend
- **Next.js 16** - Framework React
- **React 19** - Librería de componentes
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework CSS
- **Next Image** - Optimización de imágenes

## 📝 Notas Importantes

1. `El carrito se almacena en memoria en el servidor,` por lo que se resetea cuando el servidor se reinicia. Para un proyecto real, se necesitaría una base de datos.

2. Las imágenes de productos se sirven desde la carpeta `backend/imagenes/`

3. El proyectoutiliza CORS abierto para desarrollo. En producción, se debe restringir a dominios específicos.

4. Los datos de los pedidos no se persisten. Se necesitaría integrar una base de datos real.

## 🐛 Troubleshooting

### Error: "Connection refused" cuando el frontend intenta conectarse al backend
- Verifica que el servidor FastAPI esté corriendo en http://localhost:8000
- Revisa si el puerto 8000 está disponible

### Error: "CORS error"
- Asegúrate de que las solicitudes desde el frontend usan la URL correcta
- El backend debe tener CORS habilitado (ya está configurado)

### Las imágenes no se cargan
- Verifica que existe la carpeta `backend/imagenes/`
- Las imágenes deben tener nombres como: 0001.png, 0002.png, etc.

### El carrito no se actualiza
- Verifica que el backend está corriendo y accesible
- Revisa la consola del navegador para ver errores de red

## 📖 Próximos Pasos (Mejoras Futuras)

- [ ] Integrar base de datos real (PostgreSQL/SQLite)
- [ ] Sistema de autenticación de usuarios
- [ ] Carrito persistente con sesiones
- [ ] Pasarela de pago real
- [ ] Historial de pedidos del usuario
- [ ] Sistema de reseñas y calificaciones
- [ ] Búsqueda y filtros de productos
- [ ] Administrador para gestionar productos

## 👨‍💻 Autor

Oscar Ignacio Sosa - Trabajo Práctico 6 - Programación 4

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.
