from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from db import get_connection

app = FastAPI(
    title="Tienda GT — API REST",
    description="API REST para gestión de tienda: productos, clientes, ventas y reportes.",
    version="1.0.0",
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Schemas ────────────────────────────────────────────────────────────────────

class ClienteIn(BaseModel):
    name: str
    email: str
    phone: str

class ProductoIn(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category_id: int
    supplier_id: int

class CompraItem(BaseModel):
    product_id: int
    quantity: int

class CompraIn(BaseModel):
    items: list[CompraItem]
    session_token: str | None = None

class LoginIn(BaseModel):
    username: str
    password: str

class RegisterIn(BaseModel):
    username: str
    password: str
    name: str
    email: str
    phone: str

# ── AUTH ───────────────────────────────────────────────────────────────────────

@app.post("/auth/login")
def auth_login(data: LoginIn):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT user_id, customer_id FROM usuario WHERE username=%s AND password_hash=crypt(%s, password_hash);",
            (data.username, data.password)
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        user_id, customer_id = row[0], row[1]
        cursor.execute("INSERT INTO sesion (user_id) VALUES (%s) RETURNING token::text;", (user_id,))
        token = cursor.fetchone()[0]
        conn.commit()
        return {"token": token, "username": data.username, "customer_id": customer_id}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/auth/logout")
def auth_logout(token: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM sesion WHERE token=%s::uuid;", (token,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.post("/auth/register")
def auth_register(data: RegisterIn):
    if not data.username.strip():
        raise HTTPException(status_code=400, detail="El nombre de usuario no puede estar vacío")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")
    if not data.name.strip() or not data.email.strip() or not data.phone.strip():
        raise HTTPException(status_code=400, detail="Nombre, email y teléfono son obligatorios")
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO cliente (name, email, phone) VALUES (%s, %s, %s) RETURNING customer_id;",
            (data.name.strip(), data.email.strip(), data.phone.strip())
        )
        customer_id = cursor.fetchone()[0]
        cursor.execute(
            "INSERT INTO usuario (username, password_hash, customer_id) VALUES (%s, crypt(%s, gen_salt('bf', 12)), %s) RETURNING user_id;",
            (data.username.strip(), data.password, customer_id)
        )
        user_id = cursor.fetchone()[0]
        cursor.execute("INSERT INTO sesion (user_id) VALUES (%s) RETURNING token::text;", (user_id,))
        token = cursor.fetchone()[0]
        conn.commit()
        return {"token": token, "username": data.username.strip(), "customer_id": customer_id}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        if "unique" in str(e).lower():
            raise HTTPException(status_code=409, detail="El nombre de usuario ya está en uso")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.get("/auth/verify")
def auth_verify(token: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT u.username FROM sesion s JOIN usuario u ON s.user_id=u.user_id WHERE s.token=%s::uuid;",
        (token,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Sesión inválida")
    return {"username": row[0]}

# ── JOIN 1 ─────────────────────────────────────────────────────────────────────
@app.get("/ventas")
def get_ventas():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.sale_id, v.date, c.name, e.name, v.total
        FROM venta v
        JOIN cliente c ON v.customer_id = c.customer_id
        JOIN empleado e ON v.employee_id = e.employee_id
        ORDER BY v.date DESC;
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── JOIN 2 ─────────────────────────────────────────────────────────────────────
@app.get("/detalle")
def get_detalle():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.sale_id, p.name, d.quantity, d.unit_price, d.subtotal
        FROM detalle_venta d
        JOIN producto p ON d.product_id = p.product_id
        JOIN venta v ON d.sale_id = v.sale_id
        ORDER BY v.sale_id;
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── JOIN 3 ─────────────────────────────────────────────────────────────────────
@app.get("/productos")
def get_productos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.product_id, p.name, c.name, s.name, p.price, p.stock
        FROM producto p
        JOIN categoria c ON p.category_id = c.category_id
        JOIN proveedor s ON p.supplier_id = s.supplier_id
        ORDER BY p.product_id;
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── SUBQUERY 1 (IN) ────────────────────────────────────────────────────────────
@app.get("/top-productos")
def top_productos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.name,
               (SELECT SUM(quantity) FROM detalle_venta d WHERE d.product_id = p.product_id) AS total_vendido
        FROM producto p
        WHERE product_id IN (
            SELECT product_id
            FROM detalle_venta
            GROUP BY product_id
            HAVING SUM(quantity) > 5
        )
        ORDER BY total_vendido DESC;
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── SUBQUERY 2 (EXISTS) ────────────────────────────────────────────────────────
@app.get("/ventas-bulto")
def ventas_bulto():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.sale_id, c.name AS cliente, v.date, v.total
        FROM venta v
        JOIN cliente c ON v.customer_id = c.customer_id
        WHERE EXISTS (
            SELECT 1 FROM detalle_venta d
            WHERE d.sale_id = v.sale_id AND d.quantity >= 2
        )
        ORDER BY v.date DESC;
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── GROUP BY + HAVING ──────────────────────────────────────────────────────────
@app.get("/clientes-top")
def clientes_top():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.name, SUM(v.total) AS total_gastado
        FROM venta v
        JOIN cliente c ON v.customer_id = c.customer_id
        GROUP BY c.name
        HAVING SUM(v.total) > 200
        ORDER BY total_gastado DESC;
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── CTE ────────────────────────────────────────────────────────────────────────
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

# ── VIEW ───────────────────────────────────────────────────────────────────────
@app.get("/reporte")
def reporte():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reporte_ventas ORDER BY date DESC;")
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── HELPERS (dropdowns) ────────────────────────────────────────────────────────
@app.get("/categorias")
def get_categorias():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT category_id, name FROM categoria ORDER BY name;")
    rows = cursor.fetchall()
    conn.close()
    return rows

@app.get("/proveedores-lista")
def get_proveedores_lista():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT supplier_id, name FROM proveedor ORDER BY name;")
    rows = cursor.fetchall()
    conn.close()
    return rows

# ── CRUD PRODUCTOS ─────────────────────────────────────────────────────────────
@app.get("/producto/{producto_id}")
def get_producto_by_id(producto_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT product_id, name, description, price, stock, category_id, supplier_id FROM producto WHERE product_id=%s;",
        (producto_id,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return row

@app.post("/producto")
def crear_producto(data: ProductoIn):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO producto (name, description, price, stock, category_id, supplier_id) VALUES (%s,%s,%s,%s,%s,%s) RETURNING product_id;",
            (data.name, data.description, data.price, data.stock, data.category_id, data.supplier_id)
        )
        conn.commit()
        return {"id": cursor.fetchone()[0]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.put("/producto/{producto_id}")
def actualizar_producto(producto_id: int, data: ProductoIn):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE producto SET name=%s, description=%s, price=%s, stock=%s, category_id=%s, supplier_id=%s WHERE product_id=%s;",
            (data.name, data.description, data.price, data.stock, data.category_id, data.supplier_id, producto_id)
        )
        conn.commit()
        return {"ok": True}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.delete("/producto/{producto_id}")
def eliminar_producto(producto_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM producto WHERE product_id=%s;", (producto_id,))
        conn.commit()
        return {"ok": True}
    except psycopg2.errors.ForeignKeyViolation:
        conn.rollback()
        raise HTTPException(status_code=409, detail="No se puede eliminar: este producto tiene ventas registradas.")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# ── CRUD CLIENTES ──────────────────────────────────────────────────────────────
@app.get("/cliente")
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT customer_id, name, email, phone FROM cliente ORDER BY customer_id;")
    rows = cursor.fetchall()
    conn.close()
    return rows

@app.post("/cliente")
def crear_cliente(data: ClienteIn):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO cliente (name, email, phone) VALUES (%s,%s,%s) RETURNING customer_id;",
            (data.name, data.email, data.phone)
        )
        conn.commit()
        return {"id": cursor.fetchone()[0]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.put("/cliente/{cliente_id}")
def actualizar_cliente(cliente_id: int, data: ClienteIn):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE cliente SET name=%s, email=%s, phone=%s WHERE customer_id=%s;",
            (data.name, data.email, data.phone, cliente_id)
        )
        conn.commit()
        return {"ok": True}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

@app.delete("/cliente/{cliente_id}")
def eliminar_cliente(cliente_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM cliente WHERE customer_id=%s;", (cliente_id,))
        conn.commit()
        return {"ok": True}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# ── STATS / DASHBOARD ──────────────────────────────────────────────────────────

@app.get("/stats/resumen")
def stats_resumen():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM venta;")
        total_ventas = cursor.fetchone()[0]
        cursor.execute("SELECT COALESCE(SUM(total), 0) FROM venta;")
        ingresos = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM producto;")
        total_productos = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM cliente;")
        total_clientes = cursor.fetchone()[0]
        return {
            "total_ventas": total_ventas,
            "ingresos_totales": float(ingresos),
            "total_productos": total_productos,
            "total_clientes": total_clientes,
        }
    finally:
        conn.close()

@app.get("/stats/ventas-por-mes")
def stats_ventas_por_mes():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT TO_CHAR(date, 'YYYY-MM') AS mes,
                   COUNT(*)               AS cantidad,
                   SUM(total)             AS ingresos
            FROM venta
            GROUP BY mes
            ORDER BY mes;
        """)
        rows = cursor.fetchall()
        return [{"mes": r[0], "cantidad": r[1], "ingresos": float(r[2])} for r in rows]
    finally:
        conn.close()

@app.get("/stats/stock-por-categoria")
def stats_stock_por_categoria():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.name, SUM(p.stock) AS stock_total
            FROM producto p
            JOIN categoria c ON p.category_id = c.category_id
            GROUP BY c.name
            ORDER BY stock_total DESC
            LIMIT 8;
        """)
        rows = cursor.fetchall()
        return [{"categoria": r[0], "stock": int(r[1])} for r in rows]
    finally:
        conn.close()

# ── COMPRA (carrito) ───────────────────────────────────────────────────────────

@app.post("/compra")
def crear_compra(data: CompraIn):
    if not data.items:
        raise HTTPException(status_code=400, detail="El carrito está vacío")
    conn = get_connection()
    cursor = conn.cursor()
    try:
        conn.autocommit = False

        # Validar stock y calcular total dentro de la misma transacción
        total = 0.0
        precios: dict[int, float] = {}
        for item in data.items:
            cursor.execute(
                "SELECT name, price, stock FROM producto WHERE product_id=%s FOR UPDATE",
                (item.product_id,)
            )
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail=f"Producto {item.product_id} no encontrado")
            name, price, stock = row[0], float(row[1]), row[2]
            if stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Stock insuficiente para '{name}': disponible {stock}, solicitado {item.quantity}"
                )
            precios[item.product_id] = price
            total += price * item.quantity

        # Resolver customer_id desde session_token
        customer_id = 1
        if data.session_token:
            cursor.execute(
                "SELECT u.customer_id FROM sesion s JOIN usuario u ON s.user_id=u.user_id WHERE s.token=%s::uuid;",
                (data.session_token,)
            )
            row = cursor.fetchone()
            if row and row[0]:
                customer_id = row[0]

        # Insertar venta
        cursor.execute(
            "INSERT INTO venta (date, total, customer_id, employee_id) VALUES (NOW(), %s, %s, 1) RETURNING sale_id",
            (total, customer_id)
        )
        sale_id = cursor.fetchone()[0]

        # Insertar detalles y descontar stock
        for item in data.items:
            price = precios[item.product_id]
            cursor.execute(
                "INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id) VALUES (%s, %s, %s, %s, %s)",
                (item.quantity, price, price * item.quantity, sale_id, item.product_id)
            )
            cursor.execute(
                "UPDATE producto SET stock = stock - %s WHERE product_id = %s",
                (item.quantity, item.product_id)
            )

        conn.commit()
        return {"sale_id": sale_id, "total": round(total, 2)}
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# ── TRANSACCIÓN ────────────────────────────────────────────────────────────────
@app.post("/venta")
def crear_venta():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        conn.autocommit = False
        cursor.execute("INSERT INTO venta (date, total, customer_id, employee_id) VALUES (NOW(), 100, 1, 1) RETURNING sale_id;")
        sale_id = cursor.fetchone()[0]
        cursor.execute("INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id) VALUES (2, 10, 20, %s, 1);", (sale_id,))
        cursor.execute("UPDATE producto SET stock = stock - 2 WHERE product_id = 1;")
        conn.commit()
        return {"message": "Venta creada"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/venta-rollback")
def venta_rollback():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        conn.autocommit = False
        cursor.execute("INSERT INTO venta (date, total, customer_id, employee_id) VALUES (NOW(), 999, 1, 1) RETURNING sale_id;")
        sale_id = cursor.fetchone()[0]
        # quantity = -1 viola CHECK (quantity > 0) → ROLLBACK
        cursor.execute("INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id) VALUES (-1, 10, -10, %s, 1);", (sale_id,))
        conn.commit()
        return {"message": "No debería llegar aquí"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=422, detail=f"ROLLBACK ejecutado. Razón: {str(e)}")
    finally:
        conn.close()
