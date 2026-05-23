-- ─────────────────────────────────────────────────────────────────────────────
-- 07_procedures.sql  —  Stored Procedures / Functions
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. sp_create_sale ─────────────────────────────────────────────────────────
-- Registra una venta completa con validación de stock y rollback automático
-- Parámetros IN: customer_id, employee_id, items (JSONB array)
-- Parámetro OUT: sale_id del registro creado
CREATE OR REPLACE PROCEDURE sp_create_sale(
    IN  p_customer_id  INT,
    IN  p_employee_id  INT,
    IN  p_items        JSONB,
    OUT p_sale_id      INT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_item    JSONB;
    v_prod_id INT;
    v_qty     INT;
    v_price   NUMERIC(10,2);
    v_stock   INT;
    v_total   NUMERIC(10,2) := 0;
BEGIN
    -- Fase 1: validar stock con bloqueo de filas
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_prod_id := (v_item->>'product_id')::INT;
        v_qty     := (v_item->>'quantity')::INT;

        SELECT price, stock INTO v_price, v_stock
          FROM producto WHERE product_id = v_prod_id FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Producto % no encontrado', v_prod_id;
        END IF;
        IF v_stock < v_qty THEN
            RAISE EXCEPTION 'Stock insuficiente para producto % (disponible: %, solicitado: %)',
                v_prod_id, v_stock, v_qty;
        END IF;
        v_total := v_total + v_price * v_qty;
    END LOOP;

    -- Fase 2: insertar cabecera de venta
    INSERT INTO venta (date, total, customer_id, employee_id, status)
    VALUES (NOW(), v_total, p_customer_id, p_employee_id, 'active')
    RETURNING sale_id INTO p_sale_id;

    -- Fase 3: insertar detalles y descontar stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_prod_id := (v_item->>'product_id')::INT;
        v_qty     := (v_item->>'quantity')::INT;
        SELECT price INTO v_price FROM producto WHERE product_id = v_prod_id;

        INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id)
        VALUES (v_qty, v_price, v_price * v_qty, p_sale_id, v_prod_id);

        UPDATE producto SET stock = stock - v_qty WHERE product_id = v_prod_id;
    END LOOP;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;  -- re-lanza; el bloque EXCEPTION hace rollback al savepoint implícito
END;
$$;

-- ── 2. sp_update_stock ───────────────────────────────────────────────────────
-- Ajusta el stock de un producto (p_delta puede ser positivo o negativo)
CREATE OR REPLACE PROCEDURE sp_update_stock(
    IN p_product_id INT,
    IN p_delta      INT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_current INT;
BEGIN
    SELECT stock INTO v_current
      FROM producto WHERE product_id = p_product_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto % no encontrado', p_product_id;
    END IF;
    IF v_current + p_delta < 0 THEN
        RAISE EXCEPTION 'Stock insuficiente (actual: %, ajuste: %)', v_current, p_delta;
    END IF;

    UPDATE producto SET stock = stock + p_delta WHERE product_id = p_product_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- ── 3. sp_generate_sales_report ─────────────────────────────────────────────
-- Retorna reporte de ventas activas en un rango de fechas
-- (función que retorna tabla — es un stored routine en PostgreSQL)
CREATE OR REPLACE FUNCTION sp_generate_sales_report(
    p_start DATE,
    p_end   DATE
)
RETURNS TABLE (
    sale_id   INT,
    fecha     TIMESTAMP,
    cliente   VARCHAR,
    empleado  VARCHAR,
    total     NUMERIC,
    num_items BIGINT
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT v.sale_id,
           v.date,
           c.name::VARCHAR,
           e.name::VARCHAR,
           v.total,
           COUNT(d.detail_id)
      FROM venta v
      JOIN cliente          c ON v.customer_id = c.customer_id
      JOIN empleado         e ON v.employee_id  = e.employee_id
      LEFT JOIN detalle_venta d ON d.sale_id    = v.sale_id
     WHERE v.date BETWEEN p_start AND p_end + INTERVAL '1 day'
       AND v.status = 'active'
     GROUP BY v.sale_id, v.date, c.name, e.name, v.total
     ORDER BY v.date DESC;
END;
$$;

-- ── 4. sp_create_customer ────────────────────────────────────────────────────
-- Crea un cliente con validaciones básicas
-- Parámetro OUT: customer_id del registro creado
CREATE OR REPLACE PROCEDURE sp_create_customer(
    IN  p_name        VARCHAR,
    IN  p_email       VARCHAR,
    IN  p_phone       VARCHAR,
    OUT p_customer_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    IF p_name IS NULL OR TRIM(p_name) = '' THEN
        RAISE EXCEPTION 'El nombre del cliente no puede estar vacío';
    END IF;
    IF p_email IS NULL OR TRIM(p_email) = '' THEN
        RAISE EXCEPTION 'El email del cliente no puede estar vacío';
    END IF;

    INSERT INTO cliente (name, email, phone)
    VALUES (TRIM(p_name), TRIM(p_email), TRIM(COALESCE(p_phone, '')))
    RETURNING customer_id INTO p_customer_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- ── 5. sp_cancel_sale ────────────────────────────────────────────────────────
-- Cancela una venta y restaura el stock de cada ítem
CREATE OR REPLACE PROCEDURE sp_cancel_sale(
    IN p_sale_id INT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_status VARCHAR;
    v_detail RECORD;
BEGIN
    SELECT status INTO v_status
      FROM venta WHERE sale_id = p_sale_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Venta % no encontrada', p_sale_id;
    END IF;
    IF v_status = 'cancelled' THEN
        RAISE EXCEPTION 'La venta % ya está cancelada', p_sale_id;
    END IF;

    -- Restaurar stock de cada ítem
    FOR v_detail IN
        SELECT product_id, quantity FROM detalle_venta WHERE sale_id = p_sale_id
    LOOP
        UPDATE producto
           SET stock = stock + v_detail.quantity
         WHERE product_id = v_detail.product_id;
    END LOOP;

    -- Marcar como cancelada
    UPDATE venta SET status = 'cancelled' WHERE sale_id = p_sale_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- ── GRANT EXECUTE a los roles correspondientes ────────────────────────────────
GRANT EXECUTE ON PROCEDURE sp_create_sale(INT, INT, JSONB)        TO sales_role,     admin_role;
GRANT EXECUTE ON PROCEDURE sp_update_stock(INT, INT)              TO inventory_role,  admin_role;
GRANT EXECUTE ON FUNCTION  sp_generate_sales_report(DATE, DATE)   TO reporting_role,  admin_role;
GRANT EXECUTE ON PROCEDURE sp_create_customer(VARCHAR, VARCHAR, VARCHAR) TO customer_service_role, admin_role;
GRANT EXECUTE ON PROCEDURE sp_cancel_sale(INT)                    TO sales_role,      admin_role;
