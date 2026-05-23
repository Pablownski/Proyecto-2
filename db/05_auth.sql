CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE usuario (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    customer_id INT REFERENCES cliente(customer_id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer'
);

CREATE TABLE sesion (
    token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL REFERENCES usuario(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Usuario inicial: prueba / prueba123
INSERT INTO usuario (username, password_hash)
VALUES ('prueba', crypt('prueba123', gen_salt('bf', 12)));
