-- SCRIPT DE BASE DE DATOS - TALLER 2

CREATE DATABASE IF NOT EXISTS taller2;
USE taller2;

-- 1. TABLA: libro
CREATE TABLE IF NOT EXISTS libro (
    id INT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Genero INT NOT NULL, -- 2 = Ficcion, 3 = Comedia
    Autor VARCHAR(255) NOT NULL,
    fecha_recepcion DATE NOT NULL,
    cantidad_copias INT NOT NULL DEFAULT 0,
    edad_sugerida INT NOT NULL DEFAULT 0,
    editorial VARCHAR(255) NOT NULL,
    precio INT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1
);

-- 2. TABLA: rol
CREATE TABLE IF NOT EXISTS rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL
);

-- 3. TABLA: usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    rut VARCHAR(12) NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1
);

-- 4. TABLA: trabajador
CREATE TABLE IF NOT EXISTS trabajador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    bono INT NOT NULL DEFAULT 0,
    sueldo INT NOT NULL,
    RolId INT,
    FOREIGN KEY (RolId) REFERENCES rol(id)
);

-- 5. TABLA: copia_libro
CREATE TABLE IF NOT EXISTS copia_libro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barra VARCHAR(100) NOT NULL UNIQUE,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    LibroId INT,
    FOREIGN KEY (LibroId) REFERENCES libro(id)
);

-- 6. TABLA: transaccion
CREATE TABLE IF NOT EXISTS transaccion (
    id BIGINT PRIMARY KEY,
    Fecha DATE NOT NULL,
    precio_total INT NOT NULL,
    es_venta TINYINT(1) NOT NULL DEFAULT 0,
    es_prestamo TINYINT(1) NOT NULL DEFAULT 0,
    semestre INT NOT NULL,
    TrabajadorId INT,
    Usuarioid INT,
    FOREIGN KEY (TrabajadorId) REFERENCES trabajador(id),
    FOREIGN KEY (Usuarioid) REFERENCES usuario(id)
);

-- DATOS DE PRUEBA

INSERT INTO rol (id, nombre_rol) VALUES (1, 'Bibliotecaria'), (2, 'Encargado');

INSERT INTO trabajador (id, rut, nombre, correo, contrasena, sueldo, RolId) 
VALUES (1, '18999888-K', 'Bibliotecaria de Turno', 'biblioteca@ucn.cl', '1234', 500000, 1);

INSERT INTO libro (id, Nombre, Genero, Autor, fecha_recepcion, cantidad_copias, edad_sugerida, editorial, precio, estado)
VALUES (1, 'El Resplandor', 2, 'Stephen King', '2026-06-06', 5, 18, 'Debolsillo', 16800, 1);

INSERT INTO copia_libro (id, codigo_barra, estado, LibroId) 
VALUES (1, '111111', 1, 1), (3, '333333', 0, 1), (5, '555555', 1, 1);