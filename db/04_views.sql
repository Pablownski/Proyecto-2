CREATE VIEW reporte_ventas AS
SELECT v.sale_id, c.name AS cliente, v.total, v.date
FROM venta v
JOIN cliente c ON v.customer_id = c.customer_id;