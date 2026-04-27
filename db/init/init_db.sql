-- -----------------------------------------------------
-- Esquema: gestor_citas
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS gestor_citas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestor_citas_db;

-- 1. Tablas Independientes (Sin claves foráneas)
CREATE TABLE administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    password VARCHAR(255) NULL, -- Nulo para el MVP
    notas_alergias TEXT
) ENGINE=InnoDB;

-- 2. Tablas dependientes (Necesitan Curso o Admin)
CREATE TABLE curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(100) NOT NULL,
    curso_academico VARCHAR(20) NOT NULL,
    id_admin INT, -- Relación "gestiona"
    FOREIGN KEY (id_admin) REFERENCES administrador(id_admin)
) ENGINE=InnoDB;

CREATE TABLE alumno (
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    id_curso INT,
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
) ENGINE=InnoDB;

CREATE TABLE taller (
    id_taller INT AUTO_INCREMENT PRIMARY KEY,
    nombre_taller VARCHAR(100) NOT NULL,
    duracion_minutos INT NOT NULL,
    tipo_taller VARCHAR(50),
    capacidad_maxima INT NOT NULL,
    descripcion VARCHAR (500),
    icono VARCHAR (255),
    id_curso INT,
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
) ENGINE=InnoDB;

-- 3. Tabla de horarios (Depende de Taller)
CREATE TABLE horario_taller (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    id_taller INT,
    FOREIGN KEY (id_taller) REFERENCES taller(id_taller)
) ENGINE=InnoDB;

-- 4. Tabla de Cita (Depende de Cliente, Taller y Alumno)
CREATE TABLE cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada') NOT NULL,
    id_cliente INT,
    id_taller INT,
    id_alumno INT NULL, -- Nulo en MVP, se asignará en el futuro
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_taller) REFERENCES taller(id_taller),
    FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
) ENGINE=InnoDB;
