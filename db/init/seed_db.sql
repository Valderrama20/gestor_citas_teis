USE gestor_citas_db;

-- ==========================================
-- 1. CATÁLOGO DE ROLES (Requerido por Spring Security)
-- ==========================================
INSERT INTO rol (nombre_rol) VALUES 
('ROLE_ADMIN'),
('ROLE_USUARIO'),
('ROLE_PROFESOR');

-- ==========================================
-- 2. USUARIOS (Centralización de Identidad)
-- ==========================================
-- ID 1: Administrador original
INSERT INTO usuario (nombre, email, password, activo) VALUES
('Profesor Coordinador', 'admin@iesteis.es', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1QlSups.KGWQl.YqGPHqbg9J17.39i', TRUE); 

-- IDs 2, 3 y 4: Clientes originales
INSERT INTO usuario (nombre, email, password, activo) VALUES
('Ana García', 'ana.garcia@gmail.com', '$2a$10$dummyHashTemporalInvalidoParaSpringSecurity1234567890', TRUE),
('Pedro Sánchez', 'pedro.s@hotmail.com', '$2a$10$dummyHashTemporalInvalidoParaSpringSecurity1234567890', TRUE),
('Elena Martínez', 'elena.m@outlook.com', '$2a$10$wPhLFCx1F2w8', TRUE); -- Contraseña real conservada

-- ==========================================
-- 3. ASIGNACIÓN DE ROLES (Muchos a Muchos)
-- ==========================================
INSERT INTO usuario_rol (id_usuario, id_rol) VALUES
(1, 1), -- Profesor Coordinador -> ROLE_ADMIN
(2, 2), -- Ana -> ROLE_USUARIO
(3, 2), -- Pedro -> ROLE_USUARIO
(4, 2); -- Elena -> ROLE_USUARIO

-- ==========================================
-- 4. PERFILES DE DOMINIO (Extensión de clientes)
-- ==========================================
INSERT INTO perfil_cliente (id_usuario, telefono, notas_alergias) VALUES
(2, '600111222', 'Ninguna'),           -- Perfil de Ana
(3, '600333444', 'Alergia al látex'),  -- Perfil de Pedro
(4, '600555666', 'Piel sensible');     -- Perfil de Elena

-- ==========================================
-- 5. CURSOS Y TALLERES
-- ==========================================
-- Nota: id_gestor = 1 apunta al Profesor Coordinador
INSERT INTO curso (nombre_curso, curso_academico, alumnos, descripcion, icono, nivel, id_gestor) VALUES
('Peluquería', '2025/2026', 15, 'Corte, colorimetría y tratamientos capilares.', 'scissors', 'Grado Medio', 1),
('Cuidado Facial', '2025/2026', 12, 'Higiene, hidratación y maquillaje profesional.', 'sparkles', 'Grado Superior', 1),
('Tratamiento Corporal', '2025/2026', 10, 'Masajes, exfoliaciones y depilación.', 'flower', 'Grado Superior', 1),
('Manicura', '2025/2026', 9, 'Cuidado de uñas, esmaltado y pedicura.', 'hand', 'Grado Medio', 1);

INSERT INTO taller (nombre_taller, duracion_minutos, tipo_taller, capacidad_maxima, descripcion, icono, id_curso) VALUES
('Corte y Peinado', 60, 'Peluquería', 10, 'Aprende y disfruta de los mejores cortes y peinados adaptados a tu estilo.', 'scissors', 1),
('Colorimetría', 90, 'Peluquería', 8, 'Aplicación de tintes, mechas y tratamientos de color personalizados.', 'palette', 1),
('Limpieza Facial', 45, 'Estética', 12, 'Tratamiento profundo para purificar y revitalizar la piel del rostro.', 'sparkles', 2),
('Manicura y Pedicura', 60, 'Estética', 6, 'Cuidado completo de uñas, manos y pies con esmaltado clásico.', 'hand', 2);

-- ==========================================
-- 6. ALUMNOS
-- ==========================================
INSERT INTO alumno (nombre, apellidos, email, id_curso) VALUES
('María', 'Fernández', 'maria.f@iesteis.es', 1),
('Carlos', 'Ruiz', 'carlos.r@iesteis.es', 1),
('Lucía', 'Gómez', 'lucia.g@iesteis.es', 2);

-- ==========================================
-- 7. HORARIOS
-- ==========================================
INSERT INTO horario_taller (dia_semana, hora_apertura, hora_cierre, id_taller) VALUES
('Lunes', '09:00:00', '14:00:00', 1),
('Lunes', '09:00:00', '14:00:00', 2),
('Martes', '09:00:00', '14:00:00', 3),
('Martes', '09:00:00', '14:00:00', 4);

-- ==========================================
-- 8. CITAS
-- ==========================================
-- Ajustados los id_cliente a 2 (Ana), 3 (Pedro) y 4 (Elena)
INSERT INTO cita (fecha, hora, estado, id_cliente, id_taller, id_alumno) VALUES
('2026-04-22', '10:00:00', 'PENDIENTE', 2, 1, NULL), -- Cita de Ana (MVP sin alumno)
('2026-04-22', '11:00:00', 'CONFIRMADA', 3, 3, 3),   -- Cita de Pedro asignada a Lucía
('2026-04-23', '10:00:00', 'CANCELADA', 4, 2, 1);    -- Cita de Elena asignada a María