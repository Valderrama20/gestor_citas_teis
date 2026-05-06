-- -----------------------------------------------------
-- Esquema: gestor_citas Refactorizado (RBAC)
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS gestor_citas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestor_citas_db;

-- ==========================================
-- BLOQUE 1: SEGURIDAD Y ACCESO (RBAC)
-- ==========================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Centralizamos las contraseñas aquí
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE -- Ej: 'ROLE_ADMIN', 'ROLE_USUARIO', 'ROLE_PROFESOR'
) ENGINE=InnoDB;

CREATE TABLE usuario_rol (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- BLOQUE 2: PERFILES DE DOMINIO (Datos extra)
-- ==========================================

-- El cliente ahora es una extensión del usuario. Solo guarda datos de negocio.
CREATE TABLE perfil_cliente (
    id_usuario INT PRIMARY KEY, -- Clave primaria y foránea al mismo tiempo (Relación 1 a 1)
    telefono VARCHAR(20),
    notas_alergias TEXT, -- Mantenemos este requerimiento
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- BLOQUE 3: ENTIDADES DEL NEGOCIO
-- ==========================================

-- La tabla curso original tenía un id_admin. 
-- Ahora apunta a un usuario (que mediante RBAC tendrá el rol de ADMIN o PROFESOR).
CREATE TABLE curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(100) NOT NULL,
    curso_academico VARCHAR(20) NOT NULL,
    alumnos INT,
    descripcion VARCHAR(255) NOT NULL,
    icono VARCHAR(255) NOT NULL,
    nivel VARCHAR(255) NOT NULL,
    id_gestor INT, -- Reemplaza a id_admin
    FOREIGN KEY (id_gestor) REFERENCES usuario(id_usuario)
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

CREATE TABLE horario_taller (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    id_taller INT,
    FOREIGN KEY (id_taller) REFERENCES taller(id_taller)
) ENGINE=InnoDB;

-- La tabla cita original vinculaba cliente, taller y alumno.
-- Ahora vincula directamente el id_usuario (que asume el perfil cliente) con el taller y alumno.
CREATE TABLE cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA') NOT NULL,
    id_cliente INT NOT NULL, -- Apunta a usuario(id_usuario) que hace la reserva
    id_taller INT NOT NULL,
    id_alumno INT NULL, 
    FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_taller) REFERENCES taller(id_taller),
    FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
) ENGINE=InnoDB;