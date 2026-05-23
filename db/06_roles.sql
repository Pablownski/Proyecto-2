-- ─────────────────────────────────────────────────────────────────────────────
-- 06_roles.sql  —  Roles, permisos y usuarios de base de datos
-- ─────────────────────────────────────────────────────────────────────────────

-- Columna de estado para ventas (usada por sp_cancel_sale)
ALTER TABLE venta ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

-- ── 1. Crear roles en el DBMS ─────────────────────────────────────────────────
CREATE ROLE admin_role;
CREATE ROLE inventory_role;
CREATE ROLE sales_role;
CREATE ROLE reporting_role;
CREATE ROLE customer_service_role;

-- ── 2. admin_role: acceso total ───────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public                TO admin_role;

-- ── 3. inventory_role: gestión de inventario ─────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON producto   TO inventory_role;
GRANT SELECT                  ON categoria  TO inventory_role;
GRANT SELECT                  ON proveedor  TO inventory_role;
GRANT SELECT                  ON venta      TO inventory_role;
GRANT USAGE, SELECT ON SEQUENCE producto_product_id_seq TO inventory_role;
-- Sin permiso de DELETE en productos
REVOKE DELETE ON producto FROM inventory_role;

-- ── 4. sales_role: registro de ventas ─────────────────────────────────────────
GRANT SELECT, INSERT ON venta         TO sales_role;
GRANT INSERT          ON detalle_venta TO sales_role;
GRANT SELECT          ON producto      TO sales_role;
GRANT SELECT          ON cliente       TO sales_role;
GRANT SELECT          ON empleado      TO sales_role;
GRANT USAGE, SELECT ON SEQUENCE venta_sale_id_seq          TO sales_role;
GRANT USAGE, SELECT ON SEQUENCE detalle_venta_detail_id_seq TO sales_role;

-- ── 5. reporting_role: sólo lectura para reportes ────────────────────────────
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting_role;

-- ── 6. customer_service_role: atención al cliente ────────────────────────────
GRANT SELECT, INSERT, UPDATE ON cliente TO customer_service_role;
GRANT SELECT                  ON venta   TO customer_service_role;
GRANT USAGE, SELECT ON SEQUENCE cliente_customer_id_seq TO customer_service_role;
-- Sin permiso de DELETE en clientes
REVOKE DELETE ON cliente FROM customer_service_role;

-- ── 7. Usuarios PostgreSQL de prueba ─────────────────────────────────────────
CREATE USER admin_user     WITH PASSWORD 'admin123';
CREATE USER inventory_user WITH PASSWORD 'inventory123';
CREATE USER sales_user     WITH PASSWORD 'sales123';
CREATE USER report_user    WITH PASSWORD 'report123';
CREATE USER service_user   WITH PASSWORD 'service123';

GRANT admin_role              TO admin_user;
GRANT inventory_role          TO inventory_user;
GRANT sales_role              TO sales_user;
GRANT reporting_role          TO report_user;
GRANT customer_service_role   TO service_user;
