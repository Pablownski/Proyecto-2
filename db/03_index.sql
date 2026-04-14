-- Búsqueda frecuente por categoría
CREATE INDEX idx_producto_categoria ON producto(category_id);

-- Consultas de ventas por cliente (reportes)
CREATE INDEX idx_venta_cliente ON venta(customer_id);

-- JOIN frecuente en detalle de venta
CREATE INDEX idx_detalle_producto ON detalle_venta(product_id);