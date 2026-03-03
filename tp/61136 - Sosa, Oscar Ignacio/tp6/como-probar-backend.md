# TP6 - E-Commerce con FastAPI y Next.js

Desarrollo de un sitio de comercio electrónico simple utilizando React (Next.js) para el frontend y FastAPI para el backend.

## 📋 Reglas de Uso

El sistema implementa las siguientes restricciones para garantizar la integridad de los datos:

### 1️⃣ Stock y Disponibilidad

**Regla:** Solo se puede agregar productos al carrito si hay existencia disponible.

- **¿Qué significa?** Cada producto tiene un stock (cantidad disponible). No puedes agregar a tu carrito más unidades de las que existen en inventario.

- **Ejemplo:**
  - Producto: "Laptop HP" con stock = 5
  - ✅ Puedes agregar 1, 2, 3, 4 o 5 unidades
  - ❌ NO puedes agregar 6 o más

- **¿Qué pasa si lo intentas?** Recibirás un error 422 (Unprocessable Entity):
  ```json
  {
    "detail": "No hay cantidad suficiente en stock"
  }
  ```

- **Cómo probarlo:**
  - En la petición 4.5 de `api-tests.http` encontrarás un test que intenta agregar más productos de los disponibles
  - Debería fallar con un mensaje de error

---

### 2️⃣ Autenticación Requerida

**Regla:** El usuario debe estar autenticado para realizar compras y ver su historial.

- **¿Qué significa?** Solo usuarios registrados e identificados pueden:
  - ✅ Agregar productos al carrito
  - ✅ Ver su carrito
  - ✅ Finalizar una compra
  - ✅ Ver su historial de compras

- **Sin autenticación NO puedes:**
  - ❌ Acceder al carrito
  - ❌ Realizar compras
  - ❌ Ver historial de compras

- **¿Cómo se valida?** Mediante un **JWT Token**:
  - Cuando haces login, recibes un token
  - Debes incluir este token en el header de cada petición que requiera autenticación:
    ```http
    Authorization: Bearer {tu_token_aqui}
    ```

- **¿Qué pasa si no incluyes el token?** Recibirás un error 401 (Unauthorized):
  ```json
  {
    "detail": "Not authenticated"
  }
  ```

- **¿Qué pasa si el token es inválido?** También recibirás 401:
  ```json
  {
    "detail": "Invalid token"
  }
  ```

- **Cómo probarlo:**
  - En la sección 7 de `api-tests.http` encontrarás "CASOS DE ERROR"
  - Las peticiones 7.1, 7.2, 7.3 intentan acceder sin autenticación
  - Deberían fallar con error 401

---

## ✅ Resumen de Restricciones

| Restricción | Condición | Consecuencia | Error |
|---|---|---|---|
| **Stock insuficiente** | Intentar agregar más productos que el stock disponible | Petición rechazada | 422 "No hay cantidad suficiente en stock" |
| **Sin autenticación** | Acceder a carrito/compras/historial sin token | Acceso denegado | 401 "Not authenticated" |
| **Token inválido** | Token expirado o malformado | Acceso denegado | 401 "Invalid token" |
| **Usuario inexistente** | Registrarse con email que ya existe | Registro rechazado | 400 "Email already registered" |
| **Producto inexistente** | Agregar un producto_id que no existe | Agregación rechazada | 404 "Product not found" |

---

## Requisitos Previos

### Windows

1. **Python 3.13 o superior**
   - Descargar desde: https://www.python.org/downloads/
   - Durante la instalación, marcar la opción "Add Python to PATH"

2. **Node.js 20 o superior**
   - Descargar desde: https://nodejs.org/
   - Instalar la versión LTS recomendada

3. **uv (Gestor de paquetes Python)**
   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

## Estructura del Proyecto

```
tp6/
├── backend/          # API FastAPI
│   ├── main.py       # Archivo principal de la API
│   ├── productos.json
│   ├── imagenes/
│   └── pyproject.toml
├── frontend/         # Aplicación Next.js
│   ├── app/
│   ├── package.json
│   └── next.config.ts
└── README.md
```

## Instalación y Ejecución

### Backend (FastAPI)

1. **Abrir PowerShell o CMD y navegar a la carpeta del backend:**
   ```powershell
   cd ruta\al\proyecto\tp6\backend
   ```

2. **Instalar dependencias con uv:**
   ```powershell
   uv sync
   ```
   
   Esto creará un entorno virtual en `.venv` e instalará:
   - FastAPI
   - Uvicorn
   - SQLModel
   - Todas las dependencias necesarias

3. **Ejecutar el servidor:**
   ```powershell
   .venv\Scripts\uvicorn.exe main:app --reload
   ```
   
   O usando uv directamente (si está en el PATH):
   ```powershell
   uv run uvicorn main:app --reload
   ```

4. **Verificar que el servidor está corriendo:**
   - API: http://localhost:8000
   - Documentación interactiva: http://localhost:8000/docs
   - Productos: http://localhost:8000/productos
   - Imágenes: http://localhost:8000/imagenes/0001.png

### Frontend (Next.js)

1. **Abrir una nueva terminal PowerShell/CMD y navegar a la carpeta del frontend:**
   ```powershell
   cd ruta\al\proyecto\tp6\frontend
   ```

2. **Instalar dependencias:**
   ```powershell
   npm install
   ```
   
   Esto instalará:
   - React 19
   - Next.js 16
   - Tailwind CSS
   - TypeScript
   - Todas las dependencias necesarias

3. **Configurar variables de entorno (opcional):**
   
   Crear archivo `.env.local` en la carpeta `frontend` con:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```powershell
   npm run dev
   ```

5. **Abrir en el navegador:**
   - Frontend: http://localhost:3000
   - (Si el puerto 3000 está ocupado, Next.js usará el 3001 automáticamente)

## Testing

### Probar la API con REST Client (Recomendado) 🚀

El archivo `api-tests.http` contiene todas las pruebas de la API listas para ejecutar. Es la forma más fácil y rápida de probar todos los endpoints sin escribir código.

#### Paso 1: Instalar la extensión REST Client

1. Abrir VSCode
2. Presionar `Ctrl+Shift+X` (Windows/Linux) o `Cmd+Shift+X` (Mac)
3. Buscar: **"REST Client"** (autor: Huachao Mao)
4. Hacer clic en **"Install"**

![REST Client Extension](https://github.com/Huachao/vscode-restclient/raw/master/images/usage.gif)

#### Paso 2: Iniciar el servidor backend

**Opción 1 - Usando uv (Recomendado):**
```powershell
cd ruta\al\proyecto\tp6\backend
uv run uvicorn main:app --reload
```

**Opción 2 - Usando el entorno virtual directamente:**
```powershell
cd ruta\al\proyecto\tp6\backend
.venv\Scripts\uvicorn.exe main:app --reload
```

El servidor debe estar corriendo en: http://localhost:8000

**Verificar que el servidor está corriendo:**
- Abrir http://localhost:8000 en el navegador
- Deberías ver: `{"mensaje": "API de Productos - use /productos para obtener el listado"}`

#### Paso 3: Abrir el archivo de pruebas

En VSCode, abrir el archivo:
```
tp6/backend/api-tests.http
```

Verás algo como esto:
```http
### 2.1 - Listar todos los productos
GET {{baseUrl}}/productos
Accept: {{contentType}}
```

#### Paso 4: Ejecutar las peticiones


**Opción 1 - Hacer clic en "Send Request":**
- Aparece un link azul arriba de cada petición
- Hacer clic en **"Send Request"**

**Opción 2 - Atajo de teclado:**
- Posicionar el cursor sobre la petición
- Presionar `Ctrl+Alt+R` (Windows/Linux) o `Cmd+Alt+R` (Mac)


#### Paso 5: Ver la respuesta

La respuesta aparece en un panel lateral con:
- **Status Code**: 200, 404, 401, etc.
- **Headers**: Content-Type, Authorization, etc.
- **Body**: El JSON o contenido de la respuesta

Ejemplo de respuesta exitosa:
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "mensaje": "API de Productos - use /productos para obtener el listado"
}
```

#### Paso 6: Probar el flujo completo

El archivo incluye una **Sección 8** con un flujo completo de prueba:

1. **Registrar usuario** → Ejecutar petición 8.1
2. **Iniciar sesión** → Ejecutar petición 8.2 (guarda el token automáticamente)
3. **Buscar productos** → Ejecutar petición 8.3
4. **Agregar al carrito** → Ejecutar peticiones 8.4 y 8.5
5. **Ver carrito** → Ejecutar petición 8.6
6. **Finalizar compra** → Ejecutar petición 8.7
7. **Ver historial** → Ejecutar petición 8.8

#### Variables automáticas

El archivo usa variables para simplificar las pruebas:

```http
# @name login
POST {{baseUrl}}/iniciar-sesion
Content-Type: {{contentType}}

{
  "email": "juan.perez@example.com",
  "password": "miPassword123"
}

### Guardar el token automáticamente
@token = {{login.response.body.access_token}}
```

Después de hacer login, el token se guarda automáticamente y se usa en las siguientes peticiones.

#### Estructura del archivo

El archivo está organizado en **8 secciones**:

1. **Endpoints Básicos** - Verificar que la API funciona
2. **Productos** - Listar, buscar, filtrar (6 pruebas)
3. **Autenticación** - Registro, login, logout (4 pruebas)
4. **Carrito** - Agregar, quitar, cancelar (6 pruebas)
5. **Finalizar Compra** - Checkout con dirección y tarjeta (2 pruebas)
6. **Historial** - Ver compras anteriores (3 pruebas)
7. **Casos de Error** - Pruebas sin autenticación (3 pruebas)
8. **Flujo Completo** - Prueba de punta a punta (8 pasos)

---

## 🚀 Flujo de Trabajo 1-2: Registro, Login y Navegación de Productos

Este es el flujo específico que debes probar para completar los requisitos 1 y 2:

### Paso 1: Ejecutar el servidor backend

1. Abre PowerShell y navega a la carpeta del backend:
   ```powershell
   cd "ruta\al\proyecto\tp6\backend"
   ```

2. Ejecuta el servidor:
   ```powershell
   uv run uvicorn main:app --reload
   ```

3. Verifica que está corriendo en: **http://localhost:8000**
   - Deberías ver: `{"mensaje": "API de Productos - use /productos para obtener el listado"}`

### Paso 2: Abrir el archivo de pruebas en VSCode

1. En VSCode, abre el archivo: `backend/api-tests.http`
2. Verifica que tengas la extensión **REST Client** instalada

### Paso 3: Ejecutar las pruebas en orden

#### 3.1 - Verificar que la API está corriendo (2.1)

Busca esta sección:
```http
### 1.1 - Verificar que la API está corriendo
GET {{baseUrl}}/
Accept: {{contentType}}
```

Haz clic en **"Send Request"** o presiona `Ctrl+Alt+R`

**Respuesta esperada:**
```json
{
  "mensaje": "API de Productos - use /productos para obtener el listado"
}
```

✅ Si ves esto, la API está funcionando correctamente.

---

#### 3.2 - Registrar un nuevo usuario (Flujo 1 - Paso 1)

Busca esta sección:
```http
### 3.1 - Registrar un nuevo usuario
POST {{baseUrl}}/registrar
Content-Type: {{contentType}}

{
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "password": "miPassword123"
}
```

Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com"
  }
}
```

✅ Si ves el token, el registro fue exitoso.

---

#### 3.3 - Iniciar sesión (Flujo 1 - Paso 2)

Busca esta sección:
```http
### 3.2 - Iniciar sesión
# @name login
POST {{baseUrl}}/iniciar-sesion
Content-Type: {{contentType}}

{
  "email": "juan.perez@example.com",
  "password": "miPassword123"
}
```

Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com"
  }
}
```

✅ El token se guardará automáticamente en la variable `@token` para las próximas peticiones.

---

#### 3.4 - Listar todos los productos (Flujo 2 - Paso 1)

Busca esta sección:
```http
### 2.1 - Listar todos los productos
GET {{baseUrl}}/productos
Accept: {{contentType}}
```

Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "titulo": "Laptop HP",
    "precio": 45000,
    "descripcion": "Laptop potente...",
    "categoria": "electro",
    "stock": 5,
    "imagen": "0001.png"
  },
  {
    "id": 2,
    "titulo": "Mouse Logitech",
    ...
  }
]
```

✅ Verás una lista de todos los productos disponibles.

---

#### 3.5 - Buscar productos por texto (Flujo 2 - Paso 2a)

Busca esta sección:
```http
### 2.2 - Buscar productos por texto
GET {{baseUrl}}/productos?buscar=camis
Accept: {{contentType}}
```

Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
[
  {
    "id": 3,
    "titulo": "Camisa Azul",
    "precio": 1500,
    "categoria": "ropa",
    ...
  }
]
```

✅ Verás solo los productos que coinciden con tu búsqueda (en este caso "camis").

---

#### 3.6 - Filtrar productos por categoría (Flujo 2 - Paso 2b)

Busca esta sección:
```http
### 2.3 - Filtrar productos por categoría
GET {{baseUrl}}/productos?categoria=electro
Accept: {{contentType}}
```

Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "titulo": "Laptop HP",
    "categoria": "electro",
    ...
  },
  {
    "id": 2,
    "titulo": "Monitor LG",
    "categoria": "electro",
    ...
  }
]
```

✅ Verás solo productos de la categoría "electro".

---

#### 3.7 - Combinar búsqueda y filtro (Flujo 2 - Paso 3)

Busca esta sección:
```http
### 2.4 - Combinar búsqueda y filtro
GET {{baseUrl}}/productos?categoria=ropa&buscar=hombre
Accept: {{contentType}}
```

Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
[
  {
    "id": 8,
    "titulo": "Pantalón Hombre",
    "categoria": "ropa",
    ...
  }
]
```

✅ Verás productos que coincidan con AMBOS criterios (categoría Y búsqueda).

---

### ✅ Flujo Completo Resumido

| Paso | Petición | Sección | Resultado Esperado |
|------|----------|---------|-------------------|
| **Flujo 1.1** | Registrar usuario | 3.1 | Token + Usuario |
| **Flujo 1.2** | Iniciar sesión | 3.2 | Token guardado automáticamente |
| **Flujo 2.1** | Listar productos | 2.1 | Array de todos los productos |
| **Flujo 2.2a** | Buscar por texto | 2.2 | Productos filtrados por búsqueda |
| **Flujo 2.2b** | Filtrar por categoría | 2.3 | Productos de esa categoría |
| **Flujo 2.3** | Búsqueda + Filtro | 2.4 | Productos que cumplen ambos criterios |

---

### 💡 Consejos Útiles

1. **Si obtienes error 404**: Verifica que el servidor backend está corriendo en `http://localhost:8000`
2. **Si obtienes error 422**: El JSON de la petición está mal formado. Verifica comillas y comas.
3. **Si obtienes error 400**: El usuario ya existe. Cambia el email en la petición 3.1.
4. **Para cambiar los valores de búsqueda**: 
   - En petición 2.2, reemplaza `buscar=camis` por lo que quieras buscar
   - En petición 2.3, reemplaza `categoria=electro` por otra categoría (ej: `ropa`, `hogar`, etc.)
   - En petición 2.4, cambia ambos parámetros

5. **Para probar múltiples usuarios**: Cambia el email de la petición 3.1 cada vez que registres otro usuario.

6. **Ver el token que se guardó**: Después de hacer login (3.2), el token se mostará en la sección "Authorization" de las siguientes peticiones que requieren autenticación.

---

## 🛒 Flujo de Trabajo 3-5: Carrito, Revisión y Finalización de Compra

Continúa con el mismo servidor backend y archivo `api-tests.http`. Para este flujo necesitas:
- ✅ Un usuario registrado y autenticado (token guardado de las peticiones anteriores)
- ✅ Conocer los IDs de los productos que quieres comprar

### Flujo 3: Agregar productos al carrito

#### 3.1 - Agregar un producto al carrito

Busca esta sección:
```http
### 4.2 - Agregar producto al carrito
POST {{baseUrl}}/carrito
Content-Type: {{contentType}}
Authorization: Bearer {{token}}

{
  "producto_id": 1,
  "cantidad": 2
}
```

**Instrucciones:**
1. Verifica que el `@token` esté guardado (debe estar disponible después del login en el paso anterior)
2. Reemplaza `"producto_id": 1` con el ID del producto que viste en la búsqueda anterior
3. Reemplaza `"cantidad": 2` con la cantidad que desees (ej: 1, 2, 3, etc.)
4. Haz clic en **"Send Request"** o presiona `Ctrl+Alt+R`

**Respuesta esperada:**
```json
{
  "id": 1,
  "producto_id": 1,
  "titulo": "Laptop HP",
  "precio": 45000,
  "cantidad": 2,
  "subtotal": 90000
}
```

✅ El producto se agregó exitosamente al carrito.

---

#### 3.2 - Agregar otro producto al carrito

Busca esta sección:
```http
### 4.3 - Agregar otro producto al carrito
POST {{baseUrl}}/carrito
Content-Type: {{contentType}}
Authorization: Bearer {{token}}

{
  "producto_id": 5,
  "cantidad": 1
}
```

**Instrucciones:**
1. Reemplaza `"producto_id": 5` con otro ID de producto diferente
2. Reemplaza `"cantidad": 1` con la cantidad deseada
3. Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
{
  "id": 2,
  "producto_id": 5,
  "titulo": "Tablet Samsung",
  "precio": 25000,
  "cantidad": 1,
  "subtotal": 25000
}
```

✅ Ahora tienes 2 productos en el carrito.

---

### Flujo 4: Revisar el carrito y eliminar productos

#### 4.1 - Ver el contenido actual del carrito

Busca esta sección:
```http
### 4.1 - Ver carrito actual (requiere autenticación)
GET {{baseUrl}}/carrito
Accept: {{contentType}}
Authorization: Bearer {{token}}
```

**Instrucciones:**
1. Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
{
  "usuario_id": 1,
  "items": [
    {
      "id": 1,
      "producto_id": 1,
      "titulo": "Laptop HP",
      "precio": 45000,
      "cantidad": 2,
      "subtotal": 90000
    },
    {
      "id": 2,
      "producto_id": 5,
      "titulo": "Tablet Samsung",
      "precio": 25000,
      "cantidad": 1,
      "subtotal": 25000
    }
  ],
  "total": 115000
}
```

✅ Verás todos los productos en el carrito con el total.

---

#### 4.2 - Eliminar un producto del carrito (opcional)

Busca esta sección:
```http
### 4.4 - Quitar producto del carrito
DELETE {{baseUrl}}/carrito/1
Authorization: Bearer {{token}}
```

**Instrucciones:**
1. Reemplaza el `1` en la URL con el `id` del producto que quieras eliminar (del paso 4.1)
2. Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
{
  "mensaje": "Producto eliminado del carrito"
}
```

✅ El producto ha sido eliminado.

---

#### 4.3 - Verificar que el producto fue eliminado

Vuelve a ejecutar la petición 4.1 (Ver carrito):
```http
### 4.1 - Ver carrito actual
GET {{baseUrl}}/carrito
Accept: {{contentType}}
Authorization: Bearer {{token}}
```

**Respuesta esperada:**
```json
{
  "usuario_id": 1,
  "items": [
    {
      "id": 2,
      "producto_id": 5,
      "titulo": "Tablet Samsung",
      "precio": 25000,
      "cantidad": 1,
      "subtotal": 25000
    }
  ],
  "total": 25000
}
```

✅ Verás que el primer producto fue eliminado y el total se actualizó.

---

### Flujo 5: Finalizar la compra

#### 5.1 - Asegúrate de tener productos en el carrito

Antes de finalizar, verifica que haya al menos un producto en el carrito (ejecuta nuevamente 4.1 si es necesario).

Si el carrito está vacío, agrega más productos ejecutando 3.1 o 3.2.

---

#### 5.2 - Finalizar compra con dirección y pago

Busca esta sección:
```http
### 5.2 - Finalizar compra
# @name checkout
POST {{baseUrl}}/carrito/finalizar
Content-Type: {{contentType}}
Authorization: Bearer {{token}}

{
  "direccion": "Av. Corrientes 1234, CABA",
  "tarjeta": "4111111111111111"
}
```

**Instrucciones:**
1. Reemplaza `"direccion"` con una dirección válida:
   - Ejemplo: `"Calle Falsa 123, Capital Federal, Argentina"`
   - Ejemplo: `"Avenida Libertador 950, Buenos Aires"`

2. Reemplaza `"tarjeta"` con un número de tarjeta (puede ser cualquier número, es un test):
   - Tarjeta válida de prueba: `"4111111111111111"`
   - Otra tarjeta de prueba: `"5555555555554444"`

3. Haz clic en **"Send Request"** o presiona `Ctrl+Alt+R`

**Respuesta esperada:**
```json
{
  "compra_id": 1,
  "usuario_id": 1,
  "estado": "completada",
  "fecha": "2026-03-02T15:30:45.123456",
  "direccion": "Av. Corrientes 1234, CABA",
  "total": 25000,
  "items": [
    {
      "producto_id": 5,
      "titulo": "Tablet Samsung",
      "cantidad": 1,
      "precio": 25000,
      "subtotal": 25000
    }
  ]
}
```

✅ ¡La compra fue completada exitosamente!

**Nota:** Verás el `compra_id` que necesitarás para el siguiente flujo.

---

#### 5.3 - Guardar el ID de la compra para verificar

El archivo `api-tests.http` guarda automáticamente el ID en:
```http
@compra_id = {{checkout.response.body.compra_id}}
```

Este ID se usa en las siguientes peticiones para verificar la compra.

---

### ✅ Tabla Resumida Flujos 3-5

| Paso | Petición | Sección | Resultado Esperado |
|------|----------|---------|-------------------|
| **Flujo 3.1** | Agregar producto 1 | 4.2 | Item agregado al carrito |
| **Flujo 3.2** | Agregar producto 2 | 4.3 | Segundo item agregado |
| **Flujo 4.1** | Ver carrito | 4.1 | Lista de items + total |
| **Flujo 4.2** | Eliminar producto | 4.4 | Producto eliminado |
| **Flujo 4.3** | Verificar carrito | 4.1 | Carrito actualizado sin el producto |
| **Flujo 5** | Finalizar compra | 5.2 | Compra completada + compra_id |

---

### 💡 Consejos para este flujo

1. **Para obtener IDs de productos válidos**:
   - Primero ejecuta la petición 2.1 (Listar productos) de la sección anterior
   - Los IDs válidos son: 1, 2, 3, 4, 5, 6, etc. (según los productos disponibles)
   - No uses IDs que no existan (ej: 999)

2. **Si obtienes error 401 (No autorizado)**:
   - Verifica que el token está guardado
   - Ejecuta nuevamente el login (petición 3.2) para obtener un token fresco
   - Espera 5 segundos antes de intentar de nuevo

3. **Si obtienes error 404 (Producto no encontrado)**:
   - El ID del producto no existe
   - Busca de nuevo los productos disponibles (petición 2.1)
   - Usa un ID que viste en la respuesta

4. **Si obtienes error 422**:
   - Verifica que el JSON está bien formado
   - Asegúrate de que `producto_id` y `cantidad` sean números (sin comillas)
   - Verifica que la dirección y tarjeta estén entre comillas

5. **Para probar con múltiples productos**:
   - Agrega 3-4 productos diferentes antes de hacer checkout
   - Reemplaza los IDs en cada petición (4.2 y 4.3)

6. **Para probar eliminación de productos**:
   - Agrega al menos 2 productos (pasos 3.1 y 3.2)
   - Luego elimina uno (paso 4.2) y verifica (paso 4.3)
   - Finalmente finaliza la compra (paso 5.2)

---

### 📋 Flujo Completo de Principio a Fin

Si quieres probar TODO de una vez, sigue este orden:

1. **Paso anterior**: Registrar usuario (3.1) + Login (3.2) ← Fuera de este flujo
2. **Paso 3.1**: Agregar producto 1 al carrito
3. **Paso 3.2**: Agregar producto 2 al carrito
4. **Paso 4.1**: Ver carrito (debería mostrar 2 items)
5. **Paso 4.2**: Eliminar producto 1 (opcional)
6. **Paso 4.3**: Verificar carrito (debería mostrar 1 item)
7. **Paso 5.2**: Finalizar compra

**Tiempo total:** ~2 minutos para completar el flujo completo.

---

## 📋 Flujo de Trabajo 6: Ver Historial de Compras

Una vez que has completado una compra (Flujo 5), puedes revisar tu historial de compras anteriores.

### Flujo 6.1: Ver resumen de todas las compras

#### 6.1.1 - Listar todas las compras del usuario

Busca esta sección en `api-tests.http`:
```http
### 6.1 - Ver resumen de todas las compras
GET {{baseUrl}}/compras
Accept: {{contentType}}
Authorization: Bearer {{token}}
```

**Instrucciones:**
1. Asegúrate de tener el `@token` guardado (del login anterior)
2. Haz clic en **"Send Request"** o presiona `Ctrl+Alt+R`

**Respuesta esperada:**
```json
[
  {
    "compra_id": 1,
    "usuario_id": 1,
    "estado": "completada",
    "fecha": "2026-03-02T15:30:45.123456",
    "direccion": "Av. Corrientes 1234, CABA",
    "total": 25000,
    "cantidad_items": 1
  },
  {
    "compra_id": 2,
    "usuario_id": 1,
    "estado": "completada",
    "fecha": "2026-03-02T16:15:20.654321",
    "direccion": "Calle Falsa 123, Springfield",
    "total": 115000,
    "cantidad_items": 3
  }
]
```

✅ Verás una lista de todas las compras del usuario autenticado.

**Información que ves:**
- `compra_id`: ID único de cada compra (necesario para el paso 6.2)
- `estado`: Siempre será "completada" (para compras finalizadas)
- `fecha`: Cuándo se realizó la compra
- `direccion`: Dónde se entregará
- `total`: Monto total de la compra
- `cantidad_items`: Cuántos productos tiene la compra

---

### Flujo 6.2: Ver detalle completo de una compra específica

#### 6.2.1 - Obtener detalles de una compra

Busca esta sección en `api-tests.http`:
```http
### 6.2 - Ver detalle de una compra específica
GET {{baseUrl}}/compras/{{compra_id}}
Accept: {{contentType}}
Authorization: Bearer {{token}}
```

**Instrucciones:**
1. Reemplaza `{{compra_id}}` con el ID de una compra del paso 6.1.1
   - Ejemplo: reemplaza con `1` para obtener `GET {{baseUrl}}/compras/1`
   - Otra opción: usa `{{compra_id}}` si ejecutaste el flujo 5 antes (se guarda automáticamente)

2. Haz clic en **"Send Request"**

**Respuesta esperada:**
```json
{
  "compra_id": 1,
  "usuario_id": 1,
  "numero_compra": "ORD-001",
  "estado": "completada",
  "fecha": "2026-03-02T15:30:45.123456",
  "direccion": "Av. Corrientes 1234, CABA",
  "total": 25000,
  "items": [
    {
      "producto_id": 5,
      "titulo": "Tablet Samsung",
      "cantidad": 1,
      "precio_unitario": 25000,
      "subtotal": 25000
    }
  ]
}
```

✅ Verás los detalles completos de esa compra, incluida la lista de productos.

**Información detallada:**
- `numero_compra`: Número de referencia de la compra (para reclamos o seguimiento)
- `items`: Array con todos los productos de esa compra
- `precio_unitario`: Precio de cada producto
- `subtotal`: Precio × cantidad de cada ítem

---

### ✅ Tabla Resumida Flujo 6

| Paso | Petición | Sección | Resultado Esperado |
|------|----------|---------|-------------------|
| **Flujo 6.1** | Listar compras | 6.1 | Array de todas las compras del usuario |
| **Flujo 6.2** | Ver detalle | 6.2 | Detalles completos + items de una compra |

---

### 💡 Consejos para ver historial

1. **Si obtienes lista vacía en 6.1**:
   - Significa que el usuario NO ha realizado compras
   - Completa el Flujo 5 (finalizar compra) primero
   - Luego ejecuta 6.1 nuevamente

2. **Si obtienes error 404 en 6.2**:
   - El ID de compra no existe
   - Primero ejecuta 6.1 para ver cuáles son los IDs válidos
   - Usa uno de esos IDs en la petición 6.2

3. **Si obtienes error 401**:
   - El token ha expirado
   - Haz login de nuevo (petición 3.2) para obtener un token fresco
   - Luego intenta de nuevo

4. **Para ver múltiples compras**:
   - Repite el Flujo 5 varias veces (finalizar compra con diferentes productos)
   - Luego ejecuta 6.1 para verlas todas listadas
   - Usa 6.2 para ver detalles de cada una

5. **Orden recomendado para probar**:
   - Si es la primera vez:
     1. Completa Flujo 5 (agregar productos y finalizar compra)
     2. Luego ejecuta Flujo 6.1 (debería ver 1 compra)
     3. Ejecuta Flujo 6.2 con ese ID (verás los detalles)
   
   - Si ya tienes compras:
     1. Ejecuta directamente 6.1 (verás todas tus compras)
     2. Elige uno de los IDs y ejecuta 6.2

---

### 📋 Flujo Completo Incluyendo Historial

Para probar así TODO desde cero hasta ver el historial:

1. **Registrar usuario** (3.1) - Nuevo usuario
2. **Iniciar sesión** (3.2) - Login
3. **Listar productos** (2.1) - Ver qué hay disponible
4. **Agregar al carrito** (3.1 y 3.2 del flujo carrito) - 2 productos
5. **Ver carrito** (4.1) - Verificar contenido
6. **Finalizar compra** (5.2) - Compra realizada
7. **Ver todas las compras** (6.1) - Historial (debería mostrar 1 compra)
8. **Ver detalle de compra** (6.2) - Detalles completos

**Tiempo total:** ~3-4 minutos para todo incluyendo historial.

---

## 🔒 Validación de Restricciones en el Testing

Esta sección explica cómo verificar que las reglas de uso se están cumpliendo correctamente en el sistema.

### Validación 1: Verificar que el stock se respeta

**Objetivo:** Confirmar que NO puedes agregar más productos de los disponibles.

#### Paso 1: Ver el stock disponible

1. Ejecuta la petición **2.1** (Listar todos los productos)
2. Identifica un producto con stock bajo, por ejemplo:
   ```json
   {
     "id": 7,
     "titulo": "Mouse Inalámbrico",
     "stock": 3,
     "precio": 2500
   }
   ```
   En este ejemplo, solo hay 3 unidades disponibles.

#### Paso 2: Intentar agregar más que el stock

1. En la petición **4.2** (Agregar producto al carrito), usa el producto que identificaste:
   ```http
   POST {{baseUrl}}/carrito
   Content-Type: {{contentType}}
   Authorization: Bearer {{token}}

   {
     "producto_id": 7,
     "cantidad": 5
   }
   ```
   (Intentamos agregar 5, pero solo hay 3 disponibles)

2. Haz clic en **"Send Request"**

#### Paso 3: Verificar que falla

**Respuesta esperada (Error 422):**
```json
{
  "detail": "No hay cantidad suficiente en stock"
}
```

✅ La restricción funciona correctamente.

#### Paso 4: Intentar con cantidad válida

1. Repite la petición **4.2** pero con `"cantidad": 3` (o menos):
   ```http
   {
     "producto_id": 7,
     "cantidad": 3
   }
   ```

2. Haz clic en **"Send Request"**

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "producto_id": 7,
  "titulo": "Mouse Inalámbrico",
  "cantidad": 3,
  "precio": 2500,
  "subtotal": 7500
}
```

✅ Cuando respetas el stock, se agrega exitosamente.

---

### Validación 2: Verificar que se requiere autenticación

**Objetivo:** Confirmar que NO puedes acceder a funciones protegidas sin un token válido.

#### Paso 1: Intentar ver carrito SIN autenticación

1. Busca la petición en la **Sección 7.1** de `api-tests.http`:
   ```http
   ### 7.1 - Intentar acceder al carrito sin autenticación
   GET {{baseUrl}}/carrito
   Accept: {{contentType}}
   ```
   (Nota: NO tiene `Authorization: Bearer {{token}}`)

2. Haz clic en **"Send Request"**

**Respuesta esperada (Error 401):**
```json
{
  "detail": "Not authenticated"
}
```

✅ Acceso denegado sin autenticación.

#### Paso 2: Intentar agregar al carrito SIN autenticación

1. Busca la petición en la **Sección 7.2** de `api-tests.http`:
   ```http
   ### 7.2 - Intentar agregar al carrito sin autenticación
   POST {{baseUrl}}/carrito
   Content-Type: {{contentType}}
   
   {
     "producto_id": 1,
     "cantidad": 1
   }
   ```
   (Nota: NO tiene `Authorization: Bearer {{token}}`)

2. Haz clic en **"Send Request"**

**Respuesta esperada (Error 401):**
```json
{
  "detail": "Not authenticated"
}
```

✅ No puedes agregar al carrito sin estar autenticado.

#### Paso 3: Intentar ver historial SIN autenticación

1. Busca la petición en la **Sección 7.3** de `api-tests.http`:
   ```http
   ### 7.3 - Intentar ver compras sin autenticación
   GET {{baseUrl}}/compras
   Accept: {{contentType}}
   ```
   (Nota: NO tiene `Authorization: Bearer {{token}}`)

2. Haz clic en **"Send Request"**

**Respuesta esperada (Error 401):**
```json
{
  "detail": "Not authenticated"
}
```

✅ No puedes ver el historial sin estar autenticado.

#### Paso 4: Verificar que CON autenticación funciona

1. Ejecuta nuevamente las peticiones de paso 1-3, pero esta vez CON el token:
   ```http
   Authorization: Bearer {{token}}
   ```

2. Todas deberían retornar 200 OK con los datos correspondientes.

✅ Con autenticación válida, todo funciona correctamente.

---

### ✅ Checklist de Validaciones

Usa este checklist para verificar que las restricciones se cumplen correctamente:

| Restricción | Test | Resultado Esperado | Comandos |
|---|---|---|---|
| **Stock insuficiente** | Agregar más que el stock | Error 422 | 4.2 con cantidad > stock |
| **Stock válido** | Agregar cantidad ≤ stock | 200 OK + item | 4.2 con cantidad ≤ stock |
| **Sin token - Ver carrito** | GET /carrito sin autenticación | Error 401 | 7.1 |
| **Sin token - Agregar carrito** | POST /carrito sin autenticación | Error 401 | 7.2 |
| **Sin token - Ver historial** | GET /compras sin autenticación | Error 401 | 7.3 |
| **Con token - Ver carrito** | GET /carrito + token válido | 200 OK + items | 4.1 |
| **Con token - Agregar carrito** | POST /carrito + token válido | 200 OK + item | 4.2 |
| **Con token - Ver historial** | GET /compras + token válido | 200 OK + compras | 6.1 |

---

### 📝 Ejemplo Completo: Validar Todo en 5 Minutos

Sigue estos pasos en orden para verificar todas las restricciones:

1. **Autenticar**
   - Ejecuta 3.1 (Registrar)
   - Ejecuta 3.2 (Login) - guarda el token

2. **Validar Stock**
   - Ejecuta 2.1 (Ver productos) - identifica un producto con bajo stock
   - Ejecuta 4.2 (Agregar) - intenta con cantidad > stock → debe fallar (422)
   - Ejecuta 4.2 nuevamente - intenta con cantidad ≤ stock → debe funcionar (200)

3. **Validar Autenticación**
   - Ejecuta 7.1 (Ver carrito sin token) → debe fallar (401)
   - Ejecuta 7.2 (Agregar sin token) → debe fallar (401)
   - Ejecuta 7.3 (Ver historial sin token) → debe fallar (401)
   - Ejecuta 4.1 (Ver carrito CON token) → debe funcionar (200)
   - Ejecuta 4.2 (Agregar CON token) → debe funcionar (200)
   - Ejecuta 6.1 (Ver historial CON token) → debe funcionar (200)

**Tiempo total:** ~5 minutos  
**Resultado esperado:** Todas las restricciones se cumplen correctamente ✅
