# Las 6 Pantallas del E-Commerce TP6 Shop

## 1. 🏠 Pantalla Inicial - Catálogo de Productos
**Ruta:** `http://localhost:3000/`

- Navbar con "TP6 Shop" y opciones de navegación
- Buscador de productos por nombre
- Filtro de categorías
- Grid de productos (imagen, nombre, precio, stock, botón agregar)
- Sidebar derecho con carrito (muestra login si no está autenticado)

**Archivo:** `frontend/app/page.tsx`

---

## 2. 🔐 Pantalla de Inicio de Sesión
**Ruta:** `http://localhost:3000/login`

- Formulario con Email y Contraseña
- Botón "Ingresar"
- Enlace "¿No tienes cuenta? Crear cuenta"
- Validación de credenciales contra la API

**Archivo:** `frontend/app/login/page.tsx`

---

## 3. ✍️ Pantalla de Registro de Usuario
**Ruta:** `http://localhost:3000/registro`

- Formulario con:
  - Nombre Completo
  - Email
  - Contraseña
  - Confirmar Contraseña
- Botón "Crear Cuenta"
- Enlace "¿Ya tienes cuenta? Inicia sesión"
- Crea usuario en la BD y lo autentica automáticamente

**Archivo:** `frontend/app/registro/page.tsx`

---

## 4. 🛒 Pantalla de Carrito (Compra)
**Ruta:** `http://localhost:3000/carrito`

- Lista de productos agregados al carrito
- Muestra:
  - Imagen del producto
  - Nombre
  - Precio unitario
  - Cantidad (con botones + y -)
  - Subtotal por producto
  - Botón eliminar
- Total de compra
- Botón "Proceder al Checkout"
- Mensaje si carrito está vacío

**Archivo:** `frontend/app/carrito/page.tsx`

---

## 5. ✅ Pantalla de Confirmar Compra (Checkout)
**Ruta:** `http://localhost:3000/checkout`

- Formulario de datos de envío:
  - Nombre Completo
  - Email
  - Teléfono
  - Dirección
  - Ciudad
- Selección de método de pago (Tarjeta de crédito)
- Resumen de orden (productos, total)
- Botón "Confirmar Compra"
- Redirige a historial de compras tras completar

**Archivo:** `frontend/app/checkout/page.tsx`

---

## 6. 📜 Pantalla de Historial de Compras
**Ruta:** `http://localhost:3000/pedidos`

- Lista de todas las compras del usuario
- Cada pedido muestra:
  - ID del pedido
  - Fecha
  - Cantidad de artículos
  - Total gastado
  - Estado (pendiente/completada)
  - Botón para ver detalles
  - Botón para cancelar (si aplica)

**Archivo:** `frontend/app/pedidos/page.tsx`

---

## 📱 Navegación General

### Navbar
- **Logo:** "TP6 Shop" (click vuelve a inicio)
- **Menú:**
  - "Productos" → `http://localhost:3000/`
  - Si NO está autenticado:
    - "Ingresar" → `/login`
    - "Crear cuenta" → `/registro`
  - Si está autenticado:
    - Nombre del usuario (dropdown)
    - "Mis Compras" → `/pedidos`
    - "Perfil" → `/perfil`
    - "Cerrar Sesión" → Vuelve a inicio

---

## 🔧 Backend API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos` | Obtiene todos los productos |
| GET | `/productos/{id}` | Obtiene un producto específico |
| POST | `/auth/registro` | Registra un nuevo usuario |
| POST | `/auth/login` | Autentica un usuario |
| GET | `/auth/perfil` | Obtiene datos del usuario actual |
| POST | `/carrito/agregar` | Agrega producto al carrito |
| GET | `/carrito` | Obtiene carrito del usuario |
| DELETE | `/carrito/{item_id}` | Elimina item del carrito |
| POST | `/carrito/comprar` | Procesa la compra |
| GET | `/pedidos` | Obtiene historial de compras |

---

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs

---

## ✅ Estado de las Pantallas

✅ **Pantalla 1:** Página principal - LISTA
✅ **Pantalla 2:** Login - LISTA
✅ **Pantalla 3:** Registro - LISTA
✅ **Pantalla 4:** Carrito - LISTA
✅ **Pantalla 5:** Checkout - LISTA
✅ **Pantalla 6:** Historial de Compras - LISTA

**Todas las 6 pantallas están implementadas y funcionales.** 🎉
