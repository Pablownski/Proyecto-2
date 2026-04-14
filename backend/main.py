from fastapi import FastAPI, HTTPException
from db import get_connection

app = FastAPI()

# -----------------------
# JOIN 1
# -----------------------
@app.get("/ventas")
def get_ventas():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT v.sale_id, v.date, c.name, e.name, v.total
        FROM venta v
        JOIN cliente c ON v.customer_id = c.customer_id
        JOIN empleado e ON v.employee_id = e.employee_id;
    """)

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# JOIN 2
# -----------------------
@app.get("/detalle")
def get_detalle():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT v.sale_id, p.name, d.quantity, d.unit_price, d.subtotal
        FROM detalle_venta d
        JOIN producto p ON d.product_id = p.product_id
        JOIN venta v ON d.sale_id = v.sale_id;
    """)

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# JOIN 3
# -----------------------
@app.get("/productos")
def get_productos():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.name, c.name, s.name, p.price, p.stock
        FROM producto p
        JOIN categoria c ON p.category_id = c.category_id
        JOIN proveedor s ON p.supplier_id = s.supplier_id;
    """)

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# SUBQUERY
# -----------------------
@app.get("/top-productos")
def top_productos():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name
        FROM producto
        WHERE product_id IN (
            SELECT product_id
            FROM detalle_venta
            GROUP BY product_id
            HAVING SUM(quantity) > 5
        );
    """)

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# GROUP BY
# -----------------------
@app.get("/clientes-top")
def clientes_top():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.name, SUM(v.total)
        FROM venta v
        JOIN cliente c ON v.customer_id = c.customer_id
        GROUP BY c.name
        HAVING SUM(v.total) > 200;
    """)

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# CTE
# -----------------------
@app.get("/ranking")
def ranking():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        WITH ventas_producto AS (
            SELECT product_id, SUM(quantity) AS total_vendido
            FROM detalle_venta
            GROUP BY product_id
        )
        SELECT p.name, vp.total_vendido
        FROM ventas_producto vp
        JOIN producto p ON vp.product_id = p.product_id
        ORDER BY vp.total_vendido DESC;
    """)

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# VIEW
# -----------------------
@app.get("/reporte")
def reporte():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM reporte_ventas;")

    rows = cursor.fetchall()
    conn.close()
    return rows


# -----------------------
# TRANSACCION
# -----------------------
@app.post("/venta")
def crear_venta():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        conn.autocommit = False

        cursor.execute("""
            INSERT INTO venta (date, total, customer_id, employee_id)
            VALUES (NOW(), 100, 1, 1)
            RETURNING sale_id;
        """)

        sale_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id)
            VALUES (2, 10, 20, %s, 1);
        """, (sale_id,))

        cursor.execute("""
            UPDATE producto
            SET stock = stock - 2
            WHERE product_id = 1;
        """)

        conn.commit()
        return {"message": "Venta creada"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        conn.close()