# Proyecto 3 — Bases de Datos 1

Sistema de gestión de tienda con PostgreSQL, FastAPI y Next.js, desplegado con Docker Compose.
Extiende el Proyecto 2 incorporando **roles en el DBMS**, **stored procedures** y **ORM (SQLAlchemy)**.

## Levantar el proyecto

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Levantar todos los servicios
docker compose up --build
```

Esperar ~60 segundos a que los tres servicios estén listos.

> Las credenciales fijas de calificación están en `.env.example`: usuario **proy3**, contraseña **secret**.
> El proyecto corre exclusivamente en local — no hay despliegue en servidor.

---

## Usuarios de prueba (uno por rol)

| Usuario | Contraseña | Rol | Acceso |
|---|---|---|---|
| `admin_user` | `admin123` | admin | Todo el panel |
| `inventory_user` | `inventory123` | inventory | Gestión de inventario |
| `sales_user` | `sales123` | sales | Registro de ventas |
| `report_user` | `report123` | reporting | Reportes |
| `service_user` | `service123` | customer_service | Gestión de clientes |

Login del panel: **http://localhost:3000/login**

---

## Esquema de roles (DBMS)

Los roles se crean en PostgreSQL mediante `CREATE ROLE` con permisos granulares por tabla y operación (`GRANT` / `REVOKE`). Ver [db/06_roles.sql](db/06_roles.sql).

| Rol | Tablas con SELECT | INSERT | UPDATE | DELETE | EXECUTE procedures |
|---|---|---|---|---|---|
| `admin_role` | Todas | Todas | Todas | Todas | Todos los SP |
| `inventory_role` | producto, categoria, proveedor, venta | producto | producto | — (REVOKE) | `sp_update_stock` |
| `sales_role` | producto, cliente, empleado, venta | venta, detalle_venta | — | — | `sp_create_sale`, `sp_cancel_sale` |
| `reporting_role` | Todas (solo lectura) | — | — | — | `sp_generate_sales_report` |
| `customer_service_role` | cliente, venta | cliente | cliente | — (REVOKE) | `sp_create_customer` |

---

## Stored Procedures

Definidos en [db/07_procedures.sql](db/07_procedures.sql) e invocados desde el backend en `/sp/*`.

| Procedure | Descripción | Parámetros IN | OUT | Endpoint |
|---|---|---|---|---|
| `sp_create_sale` | Registra venta completa, valida stock, descuenta inventario | customer_id, employee_id, items (JSONB) | sale_id | `POST /sp/crear-venta` |
| `sp_update_stock` | Ajusta stock de un producto (delta +/-) | product_id, delta | — | `POST /sp/actualizar-stock` |
| `sp_generate_sales_report` | Reporte de ventas activas por rango de fechas | start DATE, end DATE | tabla | `GET /sp/reporte-ventas` |
| `sp_create_customer` | Crea cliente con validaciones | name, email, phone | customer_id | `POST /sp/crear-cliente` |
| `sp_cancel_sale` | Cancela venta y restaura stock; incluye `COMMIT`/`ROLLBACK` explícitos | sale_id | — | `POST /sp/cancelar-venta` |

`sp_cancel_sale` maneja su propia transacción: hace `COMMIT` al confirmar la cancelación y `ROLLBACK` explícito en el bloque `EXCEPTION`, deshaciendo los UPDATE de stock si ocurre un error.

---

## ORM (SQLAlchemy)

Configurado en [backend/database.py](backend/database.py) y [backend/models.py](backend/models.py).
Endpoints ORM disponibles en `/orm/*`:

| Operación | Endpoint |
|---|---|
| Listar / obtener productos | `GET /orm/productos`, `GET /orm/producto/{id}` |
| Crear producto | `POST /orm/producto` |
| Actualizar producto | `PUT /orm/producto/{id}` |
| Eliminar producto | `DELETE /orm/producto/{id}` |
| Listar / obtener clientes | `GET /orm/clientes`, `GET /orm/cliente/{id}` |
| Crear cliente | `POST /orm/cliente` |
| Actualizar cliente | `PUT /orm/cliente/{id}` |
| Eliminar cliente | `DELETE /orm/cliente/{id}` |
| Listar categorías | `GET /orm/categorias` |
| Listar proveedores | `GET /orm/proveedores` |

---

## URLs del panel por rol

| Rol | Página | URL local |
|---|---|---|
| Todos | Login | http://localhost:3000/login |
| admin | Dashboard | http://localhost:3000/admin-panel |
| admin / inventory | Inventario | http://localhost:3000/inventory |
| admin / sales | Ventas | http://localhost:3000/sales |
| admin / reporting | Reportes | http://localhost:3000/reports |
| admin / customer_service | Clientes | http://localhost:3000/customers |

## URLs de la tienda (clientes)

| Página | URL local |
|---|---|
| Inicio | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Registro | http://localhost:3000/registro |
| Productos | http://localhost:3000/productos |
| Carrito | http://localhost:3000/carrito |

---

## Estructura del proyecto

```
├── backend/
│   ├── main.py         Endpoints REST (raw SQL + ORM + stored procedures)
│   ├── db.py           Conexión psycopg2
│   ├── database.py     Sesión SQLAlchemy
│   ├── models.py       Modelos ORM (Categoria, Proveedor, Producto, Cliente)
│   └── Dockerfile
├── db/
│   ├── 01_schema.sql   DDL — tablas y constraints
│   ├── 02_seed.sql     Datos de ejemplo
│   ├── 03_index.sql    Índices
│   ├── 04_views.sql    Vista reporte_ventas
│   ├── 05_auth.sql     Tablas usuario y sesion
│   ├── 06_roles.sql    CREATE ROLE, GRANT, REVOKE, usuarios PostgreSQL
│   ├── 07_procedures.sql  Stored procedures
│   └── 08_app_users.sql   Usuarios de aplicación por rol
├── frontend/
│   ├── app/(panel)/    Panel de roles (inventory, sales, reports, customers, admin-panel)
│   ├── app/(main)/     Tienda pública
│   └── Dockerfile
└── docker-compose.yml
```

---

## Configuración de variables de entorno

```bash
cp .env.example .env
```

Los valores de `.env.example` funcionan directamente para desarrollo local — no es necesario modificar nada.

| Variable | Valor | Descripción |
|---|---|---|
| `POSTGRES_USER` | `proy3` | Usuario PostgreSQL |
| `POSTGRES_PASSWORD` | `secret` | Contraseña PostgreSQL |
| `POSTGRES_DB` | `store` | Nombre de la base de datos |
| `DB_HOST` | `db` | Host de la DB (nombre del servicio Docker) |
| `API_URL` | `http://backend:8000` | URL del backend dentro de Docker |
| `SESSION_SECRET` | `supersecret` | Secreto para cookies de sesión |

---

## Bajar el proyecto

```bash
# Solo detener
docker compose down

# Detener y borrar datos de la base de datos
docker compose down -v
```

---

## Pruebas unitarias (frontend)

```bash
cd frontend
npm install
npm run test
```

Resultado esperado: `✓ lib/utils.test.ts (9 tests)`

## Linter

```bash
cd frontend
npm run lint
```
