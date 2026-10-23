CREATE DATABASE IF NOT EXISTS `taqueriadb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `taqueriadb`;

CREATE TABLE IF NOT EXISTS `mesas` (
  `idMesa` int(11) NOT NULL AUTO_INCREMENT,
  `estado` varchar(10) DEFAULT 'Libre',
  PRIMARY KEY (`idMesa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cuentas` (
  `idCuenta` int(11) NOT NULL AUTO_INCREMENT,
  `idMesa` int(11) DEFAULT NULL,
  PRIMARY KEY (`idCuenta`),
  KEY `idMesa` (`idMesa`),
  CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`idMesa`) REFERENCES `mesas` (`idMesa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `finanzas` (
  `idTransaccion` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(20) DEFAULT NULL,
  `Categoria` varchar(100) NOT NULL,
  `monto` double DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idTransaccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inventario` (
  `idProd` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `controla_stock` tinyint(1) DEFAULT 0,
  `disponible` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`idProd`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `personas` (
  `idPersona` int(11) NOT NULL AUTO_INCREMENT,
  `idCuenta` int(11) DEFAULT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idPersona`),
  KEY `idCuenta` (`idCuenta`),
  CONSTRAINT `personas_ibfk_1` FOREIGN KEY (`idCuenta`) REFERENCES `cuentas` (`idCuenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pedidos` (
  `idPedido` int(11) NOT NULL AUTO_INCREMENT,
  `idPersona` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `producto` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  PRIMARY KEY (`idPedido`),
  KEY `idPersona` (`idPersona`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`idPersona`) REFERENCES `personas` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `rol` varchar(50) NOT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 3. INSERTAR DATOS (IGNORE EVITA QUE SE DUPLIQUEN SI YA EXISTEN)

INSERT IGNORE INTO `mesas` (`idMesa`, `estado`) VALUES
(1, 'Atendida'), (2, 'Atendida'), (3, 'Libre'), (4, 'Libre'), 
(5, 'Libre'), (6, 'Atendida'), (7, 'Atendida'), (8, 'Atendida'), 
(9, 'Libre'), (10, 'Libre'), (11, 'Libre'), (12, 'Libre');

INSERT IGNORE INTO `cuentas` (`idCuenta`, `idMesa`) VALUES
(17, 1), (15, 2), (16, 6), (5, 7), (13, 8);

INSERT IGNORE INTO `finanzas` (`idTransaccion`, `tipo`, `Categoria`, `monto`, `detalle`, `fecha`) VALUES
(5, 'GASTO', 'Servicios (Luz, Agua)', -66, 'comida', '2026-06-06 22:40:08');

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
(20, 'Fanta 35ml', 'Bebida', 20.00, 50, 1, 1),
(21, 'Sprite 350ml', 'Bebida', 20.00, 50, 1, 1),
(22, 'Mundet 350ml', 'Bebida', 20.00, 50, 1, 1),
(23, 'Jamaica 1L', 'Bebida', 45.00, 50, 1, 1),
(24, 'Mango 1L', 'Bebida', 45.00, 50, 1, 1),
(25, 'Horchata 1L', 'Bebida', 45.00, 30, 1, 1),
(26, 'Jamaica medioL', 'Bebida', 35.00, 50, 1, 1),
(27, 'Mango medioL', 'Bebida', 35.00, 50, 1, 1),
(28, 'Horchata medioL', 'Bebida', 35.00, 30, 1, 1),
(29, 'Queso', 'Extra', 15.00, 0, 0, 1);

INSERT IGNORE INTO `personas` (`idPersona`, `idCuenta`, `nombre`) VALUES
(10, 5, 'Persona 1'), (11, 5, 'Persona 2'), (29, 13, 'Persona 1'),
(30, 13, 'Persona 2'), (32, 15, 'Persona 1'), (33, 15, 'Persona 2'),
(34, 16, 'Persona 1'), (35, 17, 'Persona 1');

INSERT IGNORE INTO `pedidos` (`idPedido`, `idPersona`, `cantidad`, `producto`, `precio`, `estado`) VALUES
(17, 10, 2, 'Tortas bis', 110.00, 'Terminado'),
(18, 11, 4, 'Ques p s/cil', 220.00, 'Terminado'),
(19, 11, 1, 'Tacos p', 20.00, 'Terminado'),
(53, 29, 1, 'Tacos p', 20.00, 'Terminado'),
(54, 29, 1, 'Tacos p', 20.00, 'Terminado'),
(55, 29, 1, 'Tacos p', 20.00, 'Terminado'),
(56, 30, 1, 'Tacos p', 20.00, 'Terminado'),
(57, 30, 1, 'Tacos p', 20.00, 'Terminado'),
(58, 30, 1, 'Tacos p', 20.00, 'Terminado'),
(61, 32, 1, 'Tacos p', 20.00, 'Terminado'),
(62, 32, 1, 'Tacos p', 20.00, 'Terminado'),
(63, 33, 1, 'Tacos p', 20.00, 'Terminado'),
(64, 33, 1, 'Tacos p', 20.00, 'Terminado'),
(65, 34, 6, 'Tacos p s/ceb', 120.00, 'Terminado'),
(66, 35, 4, 'Tacos p s/ceb', 80.00, 'Terminado'),
(67, 35, 1, 'Coca Vidrio 600ml', 35.00, 'Terminado');

INSERT IGNORE INTO `usuarios` (`usuario`, `password`, `rol`) VALUES
('Admin', '12345', 'Administrador'),
('juan', '54321', 'trabajador');