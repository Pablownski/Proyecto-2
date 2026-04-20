-- Categorías reales
INSERT INTO categoria (name) VALUES
('Electrónica'), ('Ropa y Moda'), ('Hogar y Decoración'), ('Deportes'), ('Juguetes'),
('Libros y Papelería'), ('Belleza y Cuidado Personal'), ('Alimentos'), ('Bebidas'), ('Oficina'),
('Automotriz'), ('Mascotas'), ('Salud y Farmacia'), ('Tecnología'), ('Accesorios'),
('Muebles'), ('Ferretería'), ('Jardín y Plantas'), ('Iluminación'), ('Cocina'),
('Limpieza'), ('Calzado'), ('Artículos Infantiles'), ('Videojuegos'), ('Fitness y Gimnasio');

-- Proveedores guatemaltecos reales
INSERT INTO proveedor (name, phone, email) VALUES
('Distribuidora El Éxito',        '24201000', 'ventas@elexito.com.gt'),
('Importaciones Quetzal S.A.',    '23680000', 'contacto@quetzalimport.gt'),
('Grupo Buen Precio Guatemala',   '22500100', 'info@buenprecio.gt'),
('Suministros La Bodeguita',      '24451200', 'pedidos@labodeguita.gt'),
('Tecnología Chapina S.R.L.',     '23310500', 'soporte@tecchapina.gt'),
('Distribuidora Maya Export',     '22789000', 'export@mayadist.gt'),
('Comercial San Marcos GT',       '76440200', 'ventas@sanmarcosgt.com'),
('Almacenes Mixco',               '24690300', 'almacenes@mixco.gt'),
('Ferretería Tikal',              '23560700', 'ferreteria@tikal.gt'),
('Agroexport Los Cuchumatanes',   '79320800', 'agro@cuchumatanes.gt'),
('Farmacias Cruz Verde GT',       '24120900', 'proveedores@cruzverde.gt'),
('Textiles Antigua',              '78321100', 'textiles@antigua.gt'),
('Distribuidora Petén S.A.',      '79260400', 'peten@distpeten.gt'),
('Comercializadora Xela',         '77220600', 'xela@comxela.gt'),
('Empaques y Suministros GT',     '24330150', 'empaquesgt@suministros.gt'),
('Importadora Chiquimula',        '79424500', 'chiquimula@importadora.gt'),
('Distribuidora Cobán',           '79520100', 'coban@distcoban.gt'),
('Almacenes El Quiché',           '75521300', 'elquiche@almacenes.gt'),
('Comercial Jutiapa',             '77441700', 'jutiapa@comercial.gt'),
('Suministros Izabal',            '79480900', 'izabal@suministros.gt'),
('Distribuidora Zacapa',          '79422100', 'zacapa@distrib.gt'),
('Tecnología Escuintla',          '78881500', 'escuintla@tec.gt'),
('Comercial Sololá',              '77622200', 'solola@comercial.gt'),
('Importadora Jalapa',            '79222400', 'jalapa@import.gt'),
('Distribuidora Retalhuleu',      '77710800', 'reu@distrib.gt');

-- Clientes guatemaltecos reales
INSERT INTO cliente (name, email, phone) VALUES
('Carlos Enrique Recinos',    'carlos.recinos@gmail.com',   '55201100'),
('María José Castillo',       'mariajo.castillo@yahoo.com', '55312200'),
('José Luis Pérez',           'jlperez@hotmail.com',        '55423300'),
('Ana Lucía Méndez',          'ana.mendez@gmail.com',       '55534400'),
('Roberto Tzoc',              'roberto.tzoc@gmail.com',     '55645500'),
('Fernanda Ajú',              'fernanda.aju@outlook.com',   '55756600'),
('Diego Cojulún',             'diego.cojulun@gmail.com',    '55867700'),
('Luisa Xocop',               'luisa.xocop@gmail.com',      '55978800'),
('Héctor Batz',               'hector.batz@yahoo.com',      '56089900'),
('Carmen Ajanel',             'carmen.ajanel@gmail.com',    '56190000'),
('Pedro Chocoj',              'pedro.chocoj@gmail.com',     '56201100'),
('Sofía Yaxón',               'sofia.yaxon@hotmail.com',    '56312200'),
('Alejandro Sipac',           'alex.sipac@gmail.com',       '56423300'),
('Verónica Cac',              'vero.cac@gmail.com',         '56534400'),
('Mauricio Tol',              'mauricio.tol@outlook.com',   '56645500'),
('Claudia Maxia',             'claudia.maxia@gmail.com',    '56756600'),
('Erick Chitay',              'erick.chitay@gmail.com',     '56867700'),
('Patricia Tambriz',          'patricia.tambriz@yahoo.com', '56978800'),
('Jonathan Cucul',            'jonathan.cucul@gmail.com',   '57089900'),
('Rebeca Oxlaj',              'rebeca.oxlaj@gmail.com',     '57190000'),
('Brenda Saquimux',           'brenda.saquimux@outlook.com','57201100'),
('Oswaldo Tacam',             'oswaldo.tacam@gmail.com',    '57312200'),
('Ingrid Simaj',              'ingrid.simaj@gmail.com',     '57423300'),
('Samuel Ajtzalam',           'samuel.ajtzalam@yahoo.com',  '57534400'),
('Andrea Tzunún',             'andrea.tzunun@gmail.com',    '57645500');

-- Empleados guatemaltecos con puestos reales
INSERT INTO empleado (name, position) VALUES
('Marco Tuyuc',        'Cajero'),
('Isabel Sontay',      'Vendedora'),
('Rolando Cuc',        'Vendedor'),
('Miriam Ixcamey',     'Cajera'),
('Alfredo Chiroy',     'Supervisor'),
('Wendy Balam',        'Cajera'),
('César Chitay',       'Vendedor'),
('Rosa Chávez',        'Vendedora'),
('Fredy Oxom',         'Cajero'),
('Sonia Acabal',       'Supervisora'),
('Daniel Ajú',         'Cajero'),
('Lorena Tziná',       'Vendedora'),
('Víctor Sajquiy',     'Vendedor'),
('Karla Sipac',        'Cajera'),
('Hugo Culajay',       'Supervisor'),
('Teresa Cojulún',     'Cajera'),
('Álvaro Tzoy',        'Vendedor'),
('Flor Sical',         'Vendedora'),
('Gustavo Cojtí',      'Cajero'),
('Norma Ajanel',       'Supervisora'),
('Julio Cuxil',        'Cajero'),
('Marisol Toj',        'Vendedora'),
('Edwin Cumez',        'Vendedor'),
('Yanira Chun',        'Cajera'),
('René Cholotío',      'Supervisor');

-- Productos reales vendidos en Guatemala
INSERT INTO producto (name, description, price, stock, category_id, supplier_id) VALUES
('Televisor Samsung 43" 4K',         'Smart TV UHD con WiFi integrado',              2850.00, 30, 1,  1),
('Camisa de cuadros Reserva',        'Camisa casual para hombre talla M',              185.00, 80, 2, 12),
('Licuadora Oster 600W',             'Licuadora de vidrio con 12 velocidades',         450.00, 50, 20,  3),
('Pelota de fútbol Mikasa',          'Balón oficial talla 5',                          220.00, 60, 4,  6),
('Muñeca Baby Alive',                'Muñeca interactiva con accesorios',              380.00, 40, 5,  1),
('Biblia Reina Valera 1960',         'Edición de estudio con concordancia',             95.00, 70, 6,  4),
('Shampoo Pantene 400ml',            'Fórmula reparadora para cabello dañado',          42.00,150, 7, 11),
('Arroz Pacífico 5 libras',          'Arroz blanco extra largo premium',               32.00,200, 8, 10),
('Gaseosa Coca-Cola 2.5L',           'Refresco familiar sabor original',               18.50,300, 9,  2),
('Resma de papel Bond 80gr',         'Paquete de 500 hojas tamaño carta',              55.00,120,10,  4),
('Aceite Castrol 20W-50 1L',         'Lubricante para motor gasolina',                 75.00, 90,11,  5),
('Alimento Dog Chow 4kg',            'Alimento balanceado para perro adulto',          210.00, 45,12, 11),
('Paracetamol Infatrim Forte',       'Analgésico y antipirético 500mg x20',            24.00,200,13, 11),
('Laptop Lenovo IdeaPad 15',         'Procesador Intel i5, 8GB RAM, 256GB SSD',       5200.00, 15,14,  5),
('Mochila Totto Campus 20L',         'Mochila escolar con porta laptop',               320.00, 55,15,  6),
('Comedor 4 sillas madera pino',     'Juego de comedor estilo colonial guatemalteco',  2400.00, 10,16,  8),
('Martillo Stanley 16oz',            'Martillo de uña con mango de fibra',              145.00, 65,17,  9),
('Maceta barro artesanal Chinautla', 'Maceta de barro pintada a mano 30cm',             85.00, 80,18, 23),
('Bombillo LED 9W Sylvania',         'Ahorro energético luz blanca E27',                22.00,250,19,  3),
('Sartén antiadherente Tramontina',  'Sartén 26cm apto para vitrocerámica',            285.00, 40,20,  3),
('Detergente Ariel 1kg',             'Detergente en polvo con aroma fresco',            52.00,180,21,  2),
('Zapatos Maenner Casual',           'Zapato de cuero negro talla 42',                  450.00, 35,22,  7),
('Set didáctico Lego Classic',       'Caja con 300 piezas para construcción libre',     480.00, 25,23,  1),
('Control PS5 DualSense',            'Control inalámbrico para PlayStation 5',          750.00, 20,24,  1),
('Pesa Dumbell 5kg par',             'Mancuernas recubiertas de neopreno',              380.00, 30,25,  6);

-- Ventas con fechas variadas
INSERT INTO venta (date, total, customer_id, employee_id) VALUES
('2025-01-05 09:15:00', 2850.00,  1,  1),
('2025-01-08 10:30:00',  370.00,  2,  2),
('2025-01-10 14:00:00',  670.00,  3,  3),
('2025-01-12 11:45:00',  440.00,  4,  4),
('2025-01-15 16:20:00', 5200.00,  5,  5),
('2025-01-18 09:00:00',  535.00,  6,  6),
('2025-01-20 13:30:00',  480.00,  7,  7),
('2025-01-22 10:00:00', 2685.00,  8,  8),
('2025-01-25 15:45:00',  630.00,  9,  9),
('2025-01-28 08:30:00',  410.00, 10, 10),
('2025-02-01 11:00:00',  285.00, 11, 11),
('2025-02-03 14:15:00', 1500.00, 12, 12),
('2025-02-05 09:45:00',  220.00, 13, 13),
('2025-02-07 16:00:00',  595.00, 14, 14),
('2025-02-10 10:30:00',  760.00, 15, 15),
('2025-02-12 13:00:00',  230.00, 16, 16),
('2025-02-14 11:15:00', 4800.00, 17, 17),
('2025-02-17 09:30:00',  572.00, 18, 18),
('2025-02-20 14:45:00',  370.00, 19, 19),
('2025-02-22 10:00:00',  855.00, 20, 20),
('2025-03-01 09:15:00',  660.00, 21, 21),
('2025-03-05 11:30:00', 1080.00, 22, 22),
('2025-03-08 15:00:00',  285.00, 23, 23),
('2025-03-10 10:45:00', 3200.00, 24, 24),
('2025-03-12 13:30:00',  450.00, 25, 25);

-- Detalle de ventas
INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id) VALUES
(1, 2850.00, 2850.00,  1,  1),  -- TV Samsung
(2,   185.00,  370.00,  2,  2),  -- Camisas
(1,   450.00,  450.00,  3,  3),  -- Licuadora
(1,   220.00,  220.00,  3,  4),  -- Pelota
(1,   440.00,  440.00,  4,  4),  -- 2 pelotas
(1,  5200.00, 5200.00,  5, 14),  -- Laptop
(1,   320.00,  320.00,  6, 15),  -- Mochila
(5,    42.00,  210.00,  6,  7),  -- Shampoo x5
(1,   480.00,  480.00,  7, 23),  -- Lego
(1,  2400.00, 2400.00,  8, 16),  -- Comedor
(1,   285.00,  285.00,  8, 20),  -- Sartén
(3,   210.00,  630.00,  9, 12),  -- Dog Chow x3
(6,    55.00,  330.00, 10, 10),  -- Resmas x6
(2,    40.00,   80.00, 10, 13),  -- Paracetamol x2
(1,   285.00,  285.00, 11, 20),  -- Sartén
(3,   500.00, 1500.00, 12,  1),  -- TV x3 (mayorista)
(1,   220.00,  220.00, 13,  4),  -- Pelota
(1,   450.00,  450.00, 14,  3),  -- Licuadora
(1,   145.00,  145.00, 14, 17),  -- Martillo
(1,   750.00,  750.00, 15, 24),  -- Control PS5
(2,     5.00,   10.00, 15, 13),  -- Medicamento
(10,   22.00,  220.00, 16, 19),  -- Bombillos x10
(2,  2400.00, 4800.00, 17, 16),  -- 2 comedores
(1,   320.00,  320.00, 18, 15),  -- Mochila
(2,   126.00,  252.00, 18,  9),  -- Coca-Cola x2 cajas
(1,   370.00,  370.00, 19,  2),  -- Camisa x2
(3,   285.00,  855.00, 20, 20),  -- Sartenes x3
(2,   330.00,  660.00, 21, 15),  -- Mochilas x2
(3,   360.00, 1080.00, 22, 24),  -- Control PS5 x3 (regalos)
(1,   285.00,  285.00, 23, 20),  -- Sartén
(1,  3200.00, 3200.00, 24,  1),  -- TV grande
(1,   450.00,  450.00, 25,  3);  -- Licuadora
