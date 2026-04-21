-- -----------------------------------------------------
-- Inserción de Datos de Prueba (Seed Data)
-- -----------------------------------------------------
USE gestor_citas_db;

-- 1. ADMINISTRADOR
INSERT INTO administrador (nombre, email, password) 
VALUES ('Profesor Coordinador', 'admin@iesteis.es', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1QlSups.KGWQl.YqGPHqbg9J17.39i'); 
-- Contraseña encriptada: 'admin123' (solo como ejemplo)

-- 2. CURSOS
INSERT INTO curso (nombre_curso, curso_academico, id_admin) VALUES 
('Peluquería', '2025/2026', 1),
('Estética Integral', '2025/2026', 1);

-- 3. ALUMNOS
INSERT INTO alumno (nombre, apellidos, email, id_curso) VALUES 
('María', 'Fernández', 'maria.f@iesteis.es', 1),
('Carlos', 'Ruiz', 'carlos.r@iesteis.es', 1),
('Lucía', 'Gómez', 'lucia.g@iesteis.es', 2);

-- 4. CLIENTES (MVP: algunos con password nulo)
INSERT INTO cliente (nombre, email, telefono, password, notas_alergias) VALUES 
('Ana García', 'ana.garcia@gmail.com', '600111222', NULL, 'Ninguna'),
('Pedro Sánchez', 'pedro.s@hotmail.com', '600333444', NULL, 'Alergia al látex'),
('Elena Martínez', 'elena.m@outlook.com', '600555666', '$2a$10$wPhLFCx1F2w8', 'Piel sensible'); 
-- Elena sí tiene contraseña porque ya se registró

-- 5. TALLERES (Capacidad Máxima incluida)
INSERT INTO taller (nombre_taller, duracion_minutos, tipo_taller, capacidad_maxima, id_curso) VALUES 
('Corte y Peinado', 60, 'Peluquería', 10, 1),
('Colorimetría', 90, 'Peluquería', 8, 1),
('Limpieza Facial', 45, 'Estética', 12, 2),
('Manicura y Pedicura', 60, 'Estética', 6, 2);

-- 6. HORARIOS
INSERT INTO horario_taller (dia_semana, hora_apertura, hora_cierre, id_taller) VALUES 
('Lunes', '09:00:00', '14:00:00', 1),
('Lunes', '09:00:00', '14:00:00', 2),
('Martes', '09:00:00', '14:00:00', 3),
('Martes', '09:00:00', '14:00:00', 4);

-- 7. CITAS (Algunas con id_alumno, otras nulas como en el MVP)
INSERT INTO citas (fecha, hora, estado, id_cliente, id_taller, id_alumno) VALUES 
('2026-04-22', '10:00:00', 'Pendiente', 1, 1, NULL), -- Cita sin alumno asignado (MVP)
('2026-04-22', '11:00:00', 'Confirmada', 2, 3, 3),    -- Cita asignada a Lucía (id 3)
('2026-04-23', '10:00:00', 'Completada', 3, 2, 1);    -- Cita pasada, atendida por María (id 1)
