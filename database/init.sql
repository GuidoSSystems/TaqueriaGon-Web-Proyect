CREATE DATABASE IF NOT EXISTS `taqueriadb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `taqueriadb`;

-- 1. TABLA USUARIOS (USERS)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'trabajador',
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA MESAS (TABLES)
CREATE TABLE IF NOT EXISTS `mesas` (
  `idMesa` int(11) NOT NULL AUTO_INCREMENT,
  `numero_mesa` int(11) NOT NULL UNIQUE,
  `estado` enum('Libre', 'Esperando', 'Atendida') NOT NULL DEFAULT 'Libre',
  PRIMARY KEY (`idMesa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA ORDENES (ORDERS - Soporte DINE_IN y TAKEAWAY con ID autoincremental FIFO)
CREATE TABLE IF NOT EXISTS `ordenes` (
  `idOrden` int(11) NOT NULL AUTO_INCREMENT,
  `idMesa` int(11) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `tipo_servicio` enum('Comedor', 'ParaLlevar') NOT NULL DEFAULT 'Comedor',
  `numero_ticket` int(11) DEFAULT NULL,
  `estado` enum('Pendiente', 'Servido', 'Pagado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
  `prioridad` int(11) DEFAULT 0,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idOrden`),
  KEY `fk_ordenes_mesas` (`idMesa`),
  KEY `fk_ordenes_usuarios` (`idUsuario`),
  CONSTRAINT `ordenes_fk_mesa` FOREIGN KEY (`idMesa`) REFERENCES `mesas` (`idMesa`) ON DELETE SET NULL,
  CONSTRAINT `ordenes_fk_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA PERSONAS (PERSONS - Comensales dentro de una comanda)
CREATE TABLE IF NOT EXISTS `personas` (
  `idPersona` int(11) NOT NULL AUTO_INCREMENT,
  `idOrden` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT 'Persona 1',
  `estado` enum('Pendiente', 'Completado') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`idPersona`),
  KEY `fk_personas_ordenes` (`idOrden`),
  CONSTRAINT `personas_fk_orden` FOREIGN KEY (`idOrden`) REFERENCES `ordenes` (`idOrden`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA INVENTARIO (INVENTORY)
CREATE TABLE IF NOT EXISTS `inventario` (
  `idProd` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `controla_stock` tinyint(1) DEFAULT 0,
  `disponible` tinyint(1) DEFAULT 1,
  `tiempo_estimado_min` int(11) DEFAULT 5,
  PRIMARY KEY (`idProd`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA PEDIDOS / DETALLE ITEMS (ORDER_ITEMS - Con FK a Inventario y modificadores)
CREATE TABLE IF NOT EXISTS `pedidos` (
  `idPedido` int(11) NOT NULL AUTO_INCREMENT,
  `idPersona` int(11) NOT NULL,
  `idProd` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `producto` varchar(255) DEFAULT NULL,
  `variante_carne` varchar(50) DEFAULT NULL,
  `notas_extras` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` enum('Pendiente', 'Terminado') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`idPedido`),
  KEY `fk_pedidos_personas` (`idPersona`),
  KEY `fk_pedidos_inventario` (`idProd`),
  CONSTRAINT `pedidos_fk_persona` FOREIGN KEY (`idPersona`) REFERENCES `personas` (`idPersona`) ON DELETE CASCADE,
  CONSTRAINT `pedidos_fk_inventario` FOREIGN KEY (`idProd`) REFERENCES `inventario` (`idProd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA FINANZAS (FINANCES - Registros de ventas e ingresos/egresos con FK)
CREATE TABLE IF NOT EXISTS `finanzas` (
  `idTransaccion` int(11) NOT NULL AUTO_INCREMENT,
  `idOrden` int(11) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `tipo` enum('INGRESO', 'GASTO') NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `detalle` text DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idTransaccion`),
  KEY `fk_finanzas_ordenes` (`idOrden`),
  KEY `fk_finanzas_usuarios` (`idUsuario`),
  CONSTRAINT `finanzas_fk_orden` FOREIGN KEY (`idOrden`) REFERENCES `ordenes` (`idOrden`) ON DELETE SET NULL,
  CONSTRAINT `finanzas_fk_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DATOS SEMILLA (SEEDS)
-- --------------------------------------------------------

-- Usuarios iniciales con contraseñas hasheadas en Bcrypt (Admin: 12345, juan: 54321)
INSERT IGNORE INTO `usuarios` (`idUsuario`, `usuario`, `password`, `rol`, `activo`) VALUES
(1, 'Admin', '$2b$10$scaX3s5tBHlvmO9wuT.kxON6q/4rPsPNlZVWCUDXkY4XSJHpBJAJe', 'Administrador', 1),
(2, 'juan', '$2b$10$Bv2lzqrj5.CHQVyNMJgH5OlY8.GbqcDXGD.0bl0m2yg.cCLp4xA52', 'trabajador', 1);

-- Mesas físicas
INSERT IGNORE INTO `mesas` (`idMesa`, `numero_mesa`, `estado`) VALUES
(1, 1, 'Atendida'), (2, 2, 'Atendida'), (3, 3, 'Libre'), (4, 4, 'Libre'), 
(5, 5, 'Libre'), (6, 6, 'Atendida'), (7, 7, 'Atendida'), (8, 8, 'Atendida'), 
(9, 9, 'Libre'), (10, 10, 'Libre'), (11, 11, 'Libre'), (12, 12, 'Libre');

-- Catálogo de Inventario
INSERT IGNORE INTO `inventario` (`idProd`, `nombre`, `categoria`, `precio`, `stock`, `controla_stock`, `disponible`) VALUES
(1, 'Tacos', 'Antojito', 20.00, 0, 0, 1),
(2, 'Tortas', 'Antojito', 55.00, 0, 1, 0),
(3, 'Quesadillas', 'Antojito', 55.00, 0, 0, 1),
(4, 'Burros', 'Antojito', 75.00, 0, 0, 1),
(5, 'Volcanes', 'Antojito', 35.00, 0, 0, 1),
(6, 'Hamburguesa', 'Snack', 70.00, 10, 1, 1),
(7, 'HotDogs', 'Snack', 25.00, 10, 1, 1),
(8, 'Pastor', 'Carne', 0.00, 0, 0, 1),
(9, 'Bisteck', 'Carne', 0.00, 0, 0, 1),
(10, 'Chorizo', 'Carne', 0.00, 0, 0, 1),
(11, 'Birria', 'Carne', 0.00, 0, 0, 1),
(12, 'Lechon', 'Carne', 0.00, 0, 0, 1),
(13, 'Coca 600ml', 'Bebida', 35.00, 50, 1, 1),
(14, 'Coca Vidrio 600ml', 'Bebida', 35.00, 50, 1, 1),
(15, 'Fanta 600ml', 'Bebida', 35.00, 50, 1, 1),
(16, 'Sprite 600ml', 'Bebida', 35.00, 50, 1, 1),
(17, 'Mundet 600ml', 'Bebida', 35.00, 50, 1, 1),
(18, 'Coca 350ml', 'Bebida', 20.00, 50, 1, 1),
(19, 'Coca Vidrio 350ml', 'Bebida', 20.00, 50, 1, 1),
(20, 'Fanta 350ml', 'Bebida', 20.00, 50, 1, 1),
(21, 'Sprite 350ml', 'Bebida', 20.00, 50, 1, 1),
(22, 'Mundet 350ml', 'Bebida', 20.00, 50, 1, 1),
(23, 'Jamaica 1L', 'Bebida', 45.00, 50, 1, 1),
(24, 'Mango 1L', 'Bebida', 45.00, 50, 1, 1),
(25, 'Horchata 1L', 'Bebida', 45.00, 30, 1, 1),
(26, 'Jamaica medioL', 'Bebida', 35.00, 50, 1, 1),
(27, 'Mango medioL', 'Bebida', 35.00, 50, 1, 1),
(28, 'Horchata medioL', 'Bebida', 35.00, 30, 1, 1),
(29, 'Queso', 'Extra', 15.00, 0, 0, 1);

-- Órdenes activas (ejemplo: Comedor y Para Llevar)
INSERT IGNORE INTO `ordenes` (`idOrden`, `idMesa`, `idUsuario`, `tipo_servicio`, `numero_ticket`, `estado`) VALUES
(1, 1, 2, 'Comedor', NULL, 'Servido'),
(2, 2, 2, 'Comedor', NULL, 'Servido'),
(3, 6, 2, 'Comedor', NULL, 'Pendiente'),
(4, NULL, 2, 'ParaLlevar', 101, 'Pendiente');

-- Personas en comanda
INSERT IGNORE INTO `personas` (`idPersona`, `idOrden`, `nombre`, `estado`) VALUES
(1, 1, 'Persona 1', 'Completado'),
(2, 1, 'Persona 2', 'Completado'),
(3, 2, 'Persona 1', 'Completado'),
(4, 3, 'Persona 1', 'Pendiente'),
(5, 4, 'Cliente Mostrador', 'Pendiente');

-- Pedidos detallados vinculados a Inventario
INSERT IGNORE INTO `pedidos` (`idPedido`, `idPersona`, `idProd`, `cantidad`, `producto`, `variante_carne`, `notas_extras`, `precio`, `estado`) VALUES
(1, 1, 1, 4, 'Tacos', 'Pastor', 'Con todo', 80.00, 'Terminado'),
(2, 1, 14, 1, 'Coca Vidrio 600ml', NULL, NULL, 35.00, 'Terminado'),
(3, 2, 2, 1, 'Tortas', 'Bisteck', 'Sin cebolla', 55.00, 'Terminado'),
(4, 3, 3, 2, 'Quesadillas', 'Chorizo', NULL, 110.00, 'Terminado'),
(5, 4, 1, 5, 'Tacos', 'Pastor', 'Sin verdura', 100.00, 'Pendiente'),
(6, 5, 4, 1, 'Burros', 'Bisteck', 'Extra queso', 75.00, 'Pendiente');

-- Finanzas históricas
INSERT IGNORE INTO `finanzas` (`idTransaccion`, `idOrden`, `idUsuario`, `tipo`, `categoria`, `monto`, `detalle`, `fecha`) VALUES
(1, 1, 1, 'INGRESO', 'Venta Comedor', 115.00, 'Cobro comanda Mesa 1', '2026-10-28 14:30:00'),
(2, NULL, 1, 'GASTO', 'Servicios (Luz, Agua)', -66.00, 'Pago de servicio de agua', '2026-10-28 15:00:00');
