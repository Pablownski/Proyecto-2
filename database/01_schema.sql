CREATE TABLE categoria (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE proveedor (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    category_id INT NOT NULL,
    supplier_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categoria(category_id),
    FOREIGN KEY (supplier_id) REFERENCES proveedor(supplier_id)
);

CREATE TABLE cliente (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE empleado (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL
);

CREATE TABLE venta (
    sale_id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    customer_id INT NOT NULL,
    employee_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES cliente(customer_id),
    FOREIGN KEY (employee_id) REFERENCES empleado(employee_id)
);

CREATE TABLE detalle_venta (
    detail_id SERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES venta(sale_id),
    FOREIGN KEY (product_id) REFERENCES producto(product_id),
    UNIQUE (sale_id, product_id)
);



ALTER TABLE producto
ADD CONSTRAINT chk_stock CHECK (stock >= 0);

ALTER TABLE detalle_venta
ADD CONSTRAINT chk_quantity CHECK (quantity > 0);