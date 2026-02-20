# Guía de Inicio Rápido - E-Commerce

## 🚀 Comenzar en 5 minutos

### Paso 1: Terminal del Backend

```powershell
cd backend
uv sync
uv run uvicorn main:app --reload
```

Espera hasta ver: `Application startup complete`

### Paso 2: Terminal del Frontend (Nueva ventana)

```powershell
cd frontend
npm install
npm run dev
```

### Paso 3: Abre en el navegador

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs

## ✨ Prueba el sitio

1. En **http://localhost:3000** verás el catálogo de productos
2. Haz clic en "Agregar" en cualquier producto
3. Selecciona la cantidad y confirma
4. Haz clic en "Carrito" en la barra superior
5. En la página del carrito, puedes:
   - Modificar cantidades
   - Eliminar productos
   - Proceder al pago (formulario de demostración)

## 📝 Probar la API con Postman/Thunder Client

Abre: http://localhost:8000/docs (Documentación interactiva automática)

O usa los tests en: `backend/api-tests.ejemplo.http`

## 🆘 ¿Algo no funciona?

### Error: "Cannot connect to http://localhost:8000"
- Verifica que el backend esté ejecutándose
- terminal backend debe mostrar "Application startup complete"

### Error: "Port 8000 is already in use"
- Ejecuta en terminal: `netstat -ano | findstr :8000`
- Cierra la aplicación que usa ese puerto

### Error: "Module not found"
- En backend: `uv sync`
- En frontend: `npm install`

## 📂 Archivos Clave

### Backend
- `main.py` - Toda la lógica de la API
- `models/modelos.py` - Estructura de datos
- `productos.json` - Base de datos de productos

### Frontend
- `app/page.tsx` - Página principal/catálogo
- `app/carrito/page.tsx` - Página del carrito
- `app/components/ProductoCard.tsx` - Componente de producto
- `app/context/CarritoContext.tsx` - Gestión global del carrito
- `app/services/` - Llamadas a la API

## 🎯 Próximos Pasos

1. Modificar datos en `backend/productos.json`
2. Agregar más componentes al frontend
3. Integrar base de datos real
4. Agregar autenticación de usuarios
5. Conectar a una pasarela de pago

¡Listo! Ya tienes un sitio de e-commerce funcional.
