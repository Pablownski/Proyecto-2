# Proyecto 2 — Bases de Datos 1

Sistema de gestión de tienda con PostgreSQL, FastAPI y Next.js, desplegado con Docker Compose.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

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
POSTGRES_PASSWORD=secret         # Contraseña (⚠️ cambiar en producción)
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

## CRUD disponible

- **Productos** (`/productos`): crear, listar, editar, eliminar
- **Clientes** (`/gestion-clientes`): crear, listar, editar, eliminar

## Variables de entorno

Las credenciales están en el archivo `.env` (no versionado en Git). Para cambiarlas:

1. Editar `.env` con los nuevos valores
2. Ejecutar `docker-compose down -v` para limpiar datos anteriores
3. Ejecutar `docker-compose up --build -d` para aplicar los cambios

Ver sección **"Configuración de credenciales (.env)"** arriba para detalles de cada variable.
