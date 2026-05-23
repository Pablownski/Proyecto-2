-- ─────────────────────────────────────────────────────────────────────────────
-- 08_app_users.sql  —  Usuarios de aplicación para cada rol
-- ─────────────────────────────────────────────────────────────────────────────
-- Credenciales:
--   admin_user     / admin123
--   inventory_user / inventory123
--   sales_user     / sales123
--   report_user    / report123
--   service_user   / service123

INSERT INTO usuario (username, password_hash, role) VALUES
    ('admin_user',     crypt('admin123',     gen_salt('bf', 12)), 'admin'),
    ('inventory_user', crypt('inventory123', gen_salt('bf', 12)), 'inventory'),
    ('sales_user',     crypt('sales123',     gen_salt('bf', 12)), 'sales'),
    ('report_user',    crypt('report123',    gen_salt('bf', 12)), 'reporting'),
    ('service_user',   crypt('service123',   gen_salt('bf', 12)), 'customer_service');
