# Proyecto 2 — Bases de Datos 1

Sistema de gestión de tienda con PostgreSQL, FastAPI y Next.js, desplegado con Docker Compose.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

## Pruebas unitarias

Las pruebas corren con **Vitest** y cubren la lógica de negocio del frontend.

```bash
cd frontend
npm install
npm run test
```

Resultado esperado:

```
✓ lib/utils.test.ts (9 tests)

Test Files  1 passed (1)
      Tests  9 passed (9)
```

Las pruebas verifican:
- `formatPrice` — formato de precios con prefijo Q y dos decimales
- `getStockStatus` — clasificación de stock en Sin stock / Bajo / OK
- `calcCartTotal` — cálculo correcto del total del carrito

## Linter

```bash
cd frontend
npm run lint
```

Resultado esperado: `✔ No ESLint warnings or errors`

## Levantar el proyecto

```bash
# Desde la raíz del repositorio:
docker-compose up --build -d
```

Esperar ~60 segundos a que los tres servicios estén listos.

| Servicio | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (FastAPI) | http://localhost:8000 |
| Docs API (Swagger) | http://localhost:8000/docs |

## Configuración de credenciales (.env)

Las credenciales están centralizadas en el archivo `.env`. Para el desarrollo con valores por defecto:

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

El `.env` dentro ya contiene las credenciales de desarrollo. Para cambiarlas en producción:

**Variables disponibles en `.env`:**

```bash
# PostgreSQL Database
POSTGRES_USER=proy2              # Usuario de la DB
POSTGRES_PASSWORD=secret         # Contraseña 
POSTGRES_DB=tienda              # Nombre de la base de datos

# Backend
DB_HOST=db                       # Host (no cambiar en Docker)
DB_USER=proy2                    # Mismo que POSTGRES_USER
DB_PASSWORD=secret               # Misma que POSTGRES_PASSWORD
DB_NAME=tienda                   # Mismo que POSTGRES_DB

# Frontend
API_URL=http://backend:8000      # URL del API (no cambiar en Docker)
```

⚠️ **Importante**: No commitar `.env` a Git. El archivo está incluido en `.gitignore`.

## Bajar el proyecto

```bash
# Solo detener
docker-compose down

# Detener Y borrar datos de la base de datos
docker-compose down -v
```

## Estructura

```
├── backend/          FastAPI + psycopg2
│   ├── main.py       Todos los endpoints REST
│   ├── db.py         Conexión a PostgreSQL
│   ├── requirements.txt
│   └── Dockerfile
├── db/               Scripts SQL ejecutados al iniciar Postgres
│   ├── 01_schema.sql DDL — tablas y constraints
│   ├── 02_seed.sql   Datos de ejemplo (Guatemala)
│   ├── 03_index.sql  Índices
│   └── 04_views.sql  Vista reporte_ventas
├── frontend/         Next.js 14 (App Router)
│   ├── app/          Páginas y API routes
│   └── Dockerfile
└── docker-compose.yml
```

## Funcionalidades SQL cubiertas

| Requerimiento | Endpoint | Página |
|---|---|---|
| JOIN 1 — ventas con cliente y empleado | `GET /ventas` | `/ventas` |
| JOIN 2 — detalle con producto y venta | `GET /detalle` | `/detalle` |
| JOIN 3 — productos con categoría y proveedor | `GET /productos` | `/productos` |
| Subquery IN — productos vendidos > 5 uds. | `GET /top-productos` | `/top-productos` |
| Subquery EXISTS — ventas con artículos en bulto | `GET /ventas-bulto` | `/ventas-detalle` |
| GROUP BY + HAVING + SUM | `GET /clientes-top` | `/clientes` |
| CTE (WITH) | `GET /ranking` | `/ranking` |
| VIEW `reporte_ventas` | `GET /reporte` | `/reporte` |
| Transacción explícita + ROLLBACK | `POST /venta`, `POST /venta-rollback` | `/` |

## Documentación de la API REST

La documentación interactiva (Swagger UI) está disponible en **http://localhost:8000/docs** una vez levantado el proyecto.

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión. Body: `{ "username": "...", "password": "..." }` → `{ "token": "...", "username": "...", "customer_id": N }` |
| `POST` | `/auth/register` | Registrar usuario. Body: `{ "username", "password", "name", "email", "phone" }` → `{ "token", "username", "customer_id" }` |
| `POST` | `/auth/logout` | Cerrar sesión. Query: `?token=<uuid>` |
| `GET`  | `/auth/verify` | Verificar token. Query: `?token=<uuid>` → `{ "username": "..." }` |

### Productos (CRUD completo)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`    | `/productos` | Listar todos los productos con categoría y proveedor |
| `POST`   | `/producto` | Crear producto. Body: `{ "name", "description", "price", "stock", "category_id", "supplier_id" }` → `{ "id": N }` |
| `PUT`    | `/producto/{id}` | Actualizar producto. Body: mismo que POST |
| `DELETE` | `/producto/{id}` | Eliminar producto. Error 409 si tiene ventas registradas |

**Ejemplo `POST /producto`:**
```json
{
  "name": "Laptop HP 15",
  "description": "Intel i5, 8GB RAM",
  "price": 4500.00,
  "stock": 10,
  "category_id": 14,
  "supplier_id": 5
}
```

### Clientes (CRUD completo)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`    | `/cliente` | Listar todos los clientes |
| `POST`   | `/cliente` | Crear cliente. Body: `{ "name", "email", "phone" }` → `{ "id": N }` |
| `PUT`    | `/cliente/{id}` | Actualizar cliente. Body: mismo que POST |
| `DELETE` | `/cliente/{id}` | Eliminar cliente |

### Ventas y Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/ventas` | Ventas con cliente y empleado (JOIN) |
| `GET` | `/detalle` | Detalle de ventas con producto (JOIN) |
| `GET` | `/clientes-top` | Clientes con mayor gasto — `GROUP BY + HAVING + SUM` |
| `GET` | `/ranking` | Ranking de productos más vendidos — CTE (`WITH`) |
| `GET` | `/reporte` | Reporte consolidado desde VIEW `reporte_ventas` |
| `GET` | `/top-productos` | Productos vendidos más de 5 unidades — Subquery `IN` |
| `GET` | `/ventas-bulto` | Ventas con artículos en bulto — Subquery `EXISTS` |
| `POST` | `/compra` | Realizar compra (transacción explícita con rollback automático si falla stock). Body: `{ "items": [{ "product_id": N, "quantity": N }], "session_token": "..." }` |

**Ejemplo `POST /compra`:**
```json
{
  "items": [
    { "product_id": 3, "quantity": 2 },
    { "product_id": 7, "quantity": 1 }
  ],
  "session_token": "uuid-del-usuario-logueado"
}
```
Respuesta: `{ "sale_id": 30, "total": 942.00 }`

### Estadísticas (datos agregados)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/stats/dashboard` | KPIs: total ventas, ingresos, productos, clientes |
| `GET` | `/stats/ventas-por-mes` | Ventas agrupadas por mes para gráfica |
| `GET` | `/stats/top-categorias` | Categorías con más productos |

**Ejemplo respuesta `/stats/dashboard`:**
```json
{
  "total_ventas": 29,
  "ingresos_totales": 34521.50,
  "total_productos": 25,
  "total_clientes": 26
}
```

### Códigos HTTP utilizados

| Código | Significado |
|--------|-------------|
| `200` | OK — operación exitosa |
| `201` | Created — recurso creado |
| `400` | Bad Request — datos inválidos |
| `401` | Unauthorized — credenciales incorrectas |
| `404` | Not Found — recurso no encontrado |
| `409` | Conflict — violación de FK (ej. eliminar producto con ventas) |
| `500` | Internal Server Error — error inesperado del servidor |

## CRUD disponible

- **Productos** (`/admin/productos`): crear, listar, editar, eliminar
- **Clientes** (`/admin/gestion-clientes`): crear, listar, editar, eliminar

## Variables de entorno

Las credenciales están en el archivo `.env` (no versionado en Git). Para cambiarlas:

1. Editar `.env` con los nuevos valores
2. Ejecutar `docker-compose down -v` para limpiar datos anteriores
3. Ejecutar `docker-compose up --build -d` para aplicar los cambios

Ver sección **"Configuración de credenciales (.env)"** arriba para detalles de cada variable.
