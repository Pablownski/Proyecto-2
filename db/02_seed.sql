INSERT INTO categoria (name) VALUES
('Electrónica'), ('Ropa'), ('Hogar'), ('Deportes'), ('Juguetes'),
('Libros'), ('Belleza'), ('Alimentos'), ('Bebidas'), ('Oficina'),
('Automotriz'), ('Mascotas'), ('Salud'), ('Tecnología'), ('Accesorios'),
('Muebles'), ('Herramientas'), ('Jardín'), ('Iluminación'), ('Cocina'),
('Limpieza'), ('Calzado'), ('Infantil'), ('Gaming'), ('Fitness');

INSERT INTO proveedor (name, phone, email) VALUES
('Proveedor A','1111','a@mail.com'), ('Proveedor B','1112','b@mail.com'),
('Proveedor C','1113','c@mail.com'), ('Proveedor D','1114','d@mail.com'),
('Proveedor E','1115','e@mail.com'), ('Proveedor F','1116','f@mail.com'),
('Proveedor G','1117','g@mail.com'), ('Proveedor H','1118','h@mail.com'),
('Proveedor I','1119','i@mail.com'), ('Proveedor J','1120','j@mail.com'),
('Proveedor K','1121','k@mail.com'), ('Proveedor L','1122','l@mail.com'),
('Proveedor M','1123','m@mail.com'), ('Proveedor N','1124','n@mail.com'),
('Proveedor O','1125','o@mail.com'), ('Proveedor P','1126','p@mail.com'),
('Proveedor Q','1127','q@mail.com'), ('Proveedor R','1128','r@mail.com'),
('Proveedor S','1129','s@mail.com'), ('Proveedor T','1130','t@mail.com'),
('Proveedor U','1131','u@mail.com'), ('Proveedor V','1132','v@mail.com'),
('Proveedor W','1133','w@mail.com'), ('Proveedor X','1134','x@mail.com'),
('Proveedor Y','1135','y@mail.com');


INSERT INTO cliente (name, email, phone) VALUES
('Juan Perez','juan@mail.com','2001'), ('Maria Lopez','maria@mail.com','2002'),
('Carlos Ruiz','carlos@mail.com','2003'), ('Ana Torres','ana@mail.com','2004'),
('Luis Gomez','luis@mail.com','2005'), ('Sofia Diaz','sofia@mail.com','2006'),
('Pedro Castillo','pedro@mail.com','2007'), ('Lucia Reyes','lucia@mail.com','2008'),
('Miguel Soto','miguel@mail.com','2009'), ('Elena Cruz','elena@mail.com','2010'),
('Cliente 11','c11@mail.com','2011'), ('Cliente 12','c12@mail.com','2012'),
('Cliente 13','c13@mail.com','2013'), ('Cliente 14','c14@mail.com','2014'),
('Cliente 15','c15@mail.com','2015'), ('Cliente 16','c16@mail.com','2016'),
('Cliente 17','c17@mail.com','2017'), ('Cliente 18','c18@mail.com','2018'),
('Cliente 19','c19@mail.com','2019'), ('Cliente 20','c20@mail.com','2020'),
('Cliente 21','c21@mail.com','2021'), ('Cliente 22','c22@mail.com','2022'),
('Cliente 23','c23@mail.com','2023'), ('Cliente 24','c24@mail.com','2024'),
('Cliente 25','c25@mail.com','2025');


INSERT INTO empleado (name, position) VALUES
('Emp 1','Cajero'), ('Emp 2','Cajero'), ('Emp 3','Vendedor'),
('Emp 4','Vendedor'), ('Emp 5','Supervisor'), ('Emp 6','Cajero'),
('Emp 7','Vendedor'), ('Emp 8','Vendedor'), ('Emp 9','Cajero'),
('Emp 10','Supervisor'), ('Emp 11','Cajero'), ('Emp 12','Vendedor'),
('Emp 13','Vendedor'), ('Emp 14','Cajero'), ('Emp 15','Supervisor'),
('Emp 16','Cajero'), ('Emp 17','Vendedor'), ('Emp 18','Vendedor'),
('Emp 19','Cajero'), ('Emp 20','Supervisor'), ('Emp 21','Cajero'),
('Emp 22','Vendedor'), ('Emp 23','Vendedor'), ('Emp 24','Cajero'),
('Emp 25','Supervisor');


INSERT INTO producto (name, description, price, stock, category_id, supplier_id) VALUES
('Prod1','Desc',10,50,1,1), ('Prod2','Desc',20,40,2,2),
('Prod3','Desc',30,30,3,3), ('Prod4','Desc',40,20,4,4),
('Prod5','Desc',50,10,5,5), ('Prod6','Desc',15,60,6,6),
('Prod7','Desc',25,70,7,7), ('Prod8','Desc',35,80,8,8),
('Prod9','Desc',45,90,9,9), ('Prod10','Desc',55,100,10,10),
('Prod11','Desc',12,20,11,11), ('Prod12','Desc',22,30,12,12),
('Prod13','Desc',32,40,13,13), ('Prod14','Desc',42,50,14,14),
('Prod15','Desc',52,60,15,15), ('Prod16','Desc',18,70,16,16),
('Prod17','Desc',28,80,17,17), ('Prod18','Desc',38,90,18,18),
('Prod19','Desc',48,100,19,19), ('Prod20','Desc',58,110,20,20),
('Prod21','Desc',11,25,21,21), ('Prod22','Desc',21,35,22,22),
('Prod23','Desc',31,45,23,23), ('Prod24','Desc',41,55,24,24),
('Prod25','Desc',51,65,25,25);


INSERT INTO venta (date, total, customer_id, employee_id) VALUES
(NOW(),100,1,1),(NOW(),150,2,2),(NOW(),200,3,3),(NOW(),120,4,4),
(NOW(),180,5,5),(NOW(),160,6,6),(NOW(),140,7,7),(NOW(),130,8,8),
(NOW(),170,9,9),(NOW(),190,10,10),(NOW(),110,11,11),(NOW(),115,12,12),
(NOW(),125,13,13),(NOW(),135,14,14),(NOW(),145,15,15),(NOW(),155,16,16),
(NOW(),165,17,17),(NOW(),175,18,18),(NOW(),185,19,19),(NOW(),195,20,20),
(NOW(),105,21,21),(NOW(),115,22,22),(NOW(),125,23,23),(NOW(),135,24,24),
(NOW(),145,25,25);


INSERT INTO detalle_venta (quantity, unit_price, subtotal, sale_id, product_id) VALUES
(2,10,20,1,1),(3,20,60,2,2),(1,30,30,3,3),(4,10,40,4,1),
(2,50,100,5,5),(3,15,45,6,6),(2,25,50,7,7),(1,35,35,8,8),
(2,45,90,9,9),(1,55,55,10,10),(2,12,24,11,11),(3,22,66,12,12),
(1,32,32,13,13),(2,42,84,14,14),(3,52,156,15,15),(2,18,36,16,16),
(1,28,28,17,17),(2,38,76,18,18),(3,48,144,19,19),(1,58,58,20,20),
(2,11,22,21,21),(3,21,63,22,22),(1,31,31,23,23),(2,41,82,24,24),
(3,51,153,25,25);