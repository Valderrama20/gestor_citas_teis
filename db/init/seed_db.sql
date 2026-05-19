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
('Profesor Coordinador', 'admin@iesteis.es', '$2a$10$1SfJIRCjzenQ6NZLzB6O7uVCwSB4evSK2DEHdwXxcAu1g3EjteI1m', TRUE); 

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

-- Cursos adicionales
INSERT INTO curso (nombre_curso, curso_academico, alumnos, descripcion, icono, nivel, id_gestor) VALUES
('Maquillaje Artístico', '2025/2026', 14, 'Técnicas de maquillaje social y artístico.', 'brush', 'Grado Medio', 1),
('Spa y Bienestar', '2025/2026', 8, 'Rituales de relajación y bienestar corporal.', 'bath', 'Grado Superior', 1);

INSERT INTO taller (nombre_taller, duracion_minutos, tipo_taller, capacidad_maxima, descripcion, icono, id_curso) VALUES
('Corte y Peinado', 60, 'Peluquería', 10, 'Aprende y disfruta de los mejores cortes y peinados adaptados a tu estilo.', 'scissors', 1),
('Colorimetría', 90, 'Peluquería', 8, 'Aplicación de tintes, mechas y tratamientos de color personalizados.', 'palette', 1),
('Limpieza Facial', 45, 'Estética', 12, 'Tratamiento profundo para purificar y revitalizar la piel del rostro.', 'sparkles', 2),
('Manicura y Pedicura', 60, 'Estética', 6, 'Cuidado completo de uñas, manos y pies con esmaltado clásico.', 'hand', 2);

-- Talleres adicionales
INSERT INTO taller (nombre_taller, duracion_minutos, tipo_taller, capacidad_maxima, descripcion, icono, id_curso) VALUES
('Maquillaje Social', 75, 'Maquillaje Artístico', 12, 'Looks de día y noche para eventos.', 'brush', 5),
('Maquillaje de Fantasía', 90, 'Maquillaje Artístico', 8, 'Técnicas creativas con color y texturas.', 'paintbrush', 5),
('Pestañas y Cejas', 50, 'Maquillaje Artístico', 10, 'Diseño, laminado y cuidado.', 'eye', 5),
('Masaje Relajante', 60, 'Spa y Bienestar', 10, 'Desconexión total con maniobras suaves.', 'activity', 6),
('Aromaterapia', 45, 'Spa y Bienestar', 9, 'Aceites esenciales para equilibrar cuerpo y mente.', 'leaf', 6),
('Hidroterapia', 60, 'Spa y Bienestar', 8, 'Circuitos de agua y estimulación circulatoria.', 'droplets', 6);

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

-- Horarios adicionales
INSERT INTO horario_taller (dia_semana, hora_apertura, hora_cierre, id_taller) VALUES
('Miércoles', '10:00:00', '13:00:00', 5),
('Viernes', '16:00:00', '19:00:00', 6),
('Jueves', '09:30:00', '12:30:00', 7),
('Sábado', '10:00:00', '14:00:00', 8),
('Domingo', '11:00:00', '13:00:00', 9),
('Lunes', '15:00:00', '18:00:00', 10);

-- ==========================================
-- 8. CITAS
-- ==========================================
-- Ajustados los id_cliente a 2 (Ana), 3 (Pedro) y 4 (Elena)
-- Los talleres tienen horarios específicos por día de la semana:
-- Taller 1: Lunes 09:00 - 14:00
-- Taller 2: Lunes 09:00 - 14:00
-- Taller 3: Martes 09:00 - 14:00
-- Taller 4: Martes 09:00 - 14:00
-- Taller 5: Miércoles 10:00 - 13:00
-- Taller 6: Viernes 16:00 - 19:00
-- Taller 7: Jueves 09:30 - 12:30
-- Taller 8: Sábado 10:00 - 14:00
-- Taller 9: Domingo 11:00 - 13:00
-- Taller 10: Lunes 15:00 - 18:00

INSERT INTO cita (fecha, hora, estado, id_cliente, id_taller, id_alumno) VALUES
('2026-05-18', '10:00:00', 'PENDIENTE', 2, 1, NULL), -- Lunes (Taller 1)
('2026-05-19', '11:00:00', 'CONFIRMADA', 3, 3, 3),   -- Martes (Taller 3)
('2026-05-18', '10:00:00', 'CANCELADA', 4, 2, 1);    -- Lunes (Taller 2)

-- Citas adicionales (fecha actual y futuras)
INSERT INTO cita (fecha, hora, estado, id_cliente, id_taller, id_alumno) VALUES
('2026-05-25', '09:30:00', 'PENDIENTE', 2, 1, NULL), -- Lunes
('2026-06-01', '11:00:00', 'CONFIRMADA', 3, 1, 1),   -- Lunes
('2026-06-08', '12:30:00', 'PENDIENTE', 4, 1, NULL), -- Lunes
('2026-05-25', '10:00:00', 'PENDIENTE', 3, 2, 2),    -- Lunes
('2026-06-15', '13:00:00', 'CONFIRMADA', 2, 2, 2),   -- Lunes
('2026-05-19', '10:30:00', 'CONFIRMADA', 2, 3, 3),   -- Martes
('2026-05-26', '09:45:00', 'PENDIENTE', 4, 3, NULL), -- Martes
('2026-06-02', '11:15:00', 'PENDIENTE', 3, 3, NULL), -- Martes
('2026-05-26', '11:00:00', 'PENDIENTE', 2, 4, 1),    -- Martes
('2026-06-09', '12:00:00', 'CANCELADA', 4, 4, NULL), -- Martes
('2026-05-20', '10:00:00', 'PENDIENTE', 3, 5, NULL), -- Miércoles
('2026-05-27', '12:00:00', 'CONFIRMADA', 4, 5, 2),   -- Miércoles
('2026-06-03', '11:30:00', 'PENDIENTE', 2, 5, NULL), -- Miércoles
('2026-05-22', '16:30:00', 'PENDIENTE', 2, 6, NULL), -- Viernes
('2026-05-29', '17:00:00', 'CONFIRMADA', 3, 6, 3),   -- Viernes
('2026-05-21', '09:30:00', 'PENDIENTE', 4, 7, NULL), -- Jueves
('2026-05-28', '11:00:00', 'PENDIENTE', 2, 7, 1),    -- Jueves
('2026-06-04', '10:30:00', 'CONFIRMADA', 3, 7, 2),   -- Jueves
('2026-05-23', '10:30:00', 'PENDIENTE', 2, 8, NULL), -- Sábado
('2026-05-30', '12:00:00', 'CONFIRMADA', 4, 8, 3),   -- Sábado
('2026-05-24', '11:00:00', 'PENDIENTE', 3, 9, NULL), -- Domingo
('2026-05-31', '12:00:00', 'PENDIENTE', 2, 9, NULL), -- Domingo
('2026-05-25', '16:00:00', 'PENDIENTE', 4, 10, 1),   -- Lunes
('2026-06-01', '17:00:00', 'CONFIRMADA', 3, 10, 2);  -- Lunes

-- Citas para llenar aforo (dejar 1 libre por taller y fecha para testing de colores)
INSERT INTO cita (fecha, hora, estado, id_cliente, id_taller, id_alumno) VALUES
-- Taller 1 (capacidad 10) -> 2026-05-25 (9 citas en total)
('2026-05-25', '09:00:00', 'PENDIENTE', 3, 1, NULL),
('2026-05-25', '10:00:00', 'PENDIENTE', 4, 1, NULL),
('2026-05-25', '10:30:00', 'PENDIENTE', 2, 1, NULL),
('2026-05-25', '11:00:00', 'CONFIRMADA', 3, 1, NULL),
('2026-05-25', '12:00:00', 'PENDIENTE', 2, 1, NULL),
('2026-05-25', '13:00:00', 'PENDIENTE', 4, 1, NULL),
-- Taller 2 (capacidad 8) -> 2026-05-25 (7 citas en total)
('2026-05-25', '09:00:00', 'PENDIENTE', 2, 2, NULL),
('2026-05-25', '09:30:00', 'PENDIENTE', 3, 2, NULL),
('2026-05-25', '11:00:00', 'CONFIRMADA', 2, 2, NULL),
('2026-05-25', '11:30:00', 'PENDIENTE', 3, 2, NULL),
('2026-05-25', '12:00:00', 'PENDIENTE', 4, 2, NULL),
-- Taller 3 (capacidad 12) -> 2026-05-19 (11 citas en total)
('2026-05-19', '09:00:00', 'PENDIENTE', 2, 3, NULL),
('2026-05-19', '09:30:00', 'PENDIENTE', 3, 3, NULL),
('2026-05-19', '10:00:00', 'PENDIENTE', 4, 3, NULL),
('2026-05-19', '11:00:00', 'PENDIENTE', 2, 3, NULL),
('2026-05-19', '12:00:00', 'PENDIENTE', 4, 3, NULL),
('2026-05-19', '12:30:00', 'PENDIENTE', 2, 3, NULL),
('2026-05-19', '13:00:00', 'PENDIENTE', 3, 3, NULL),
('2026-05-19', '13:30:00', 'PENDIENTE', 4, 3, NULL),
('2026-05-19', '14:00:00', 'PENDIENTE', 2, 3, NULL),
-- Taller 4 (capacidad 6) -> 2026-05-26 (5 citas en total)
('2026-05-26', '09:00:00', 'PENDIENTE', 2, 4, NULL),
('2026-05-26', '10:00:00', 'PENDIENTE', 3, 4, NULL),
('2026-05-26', '12:00:00', 'PENDIENTE', 4, 4, NULL),
('2026-05-26', '13:00:00', 'PENDIENTE', 2, 4, NULL),
-- Taller 5 (capacidad 12) -> 2026-05-20 (11 citas en total)
('2026-05-20', '10:15:00', 'PENDIENTE', 2, 5, NULL),
('2026-05-20', '10:30:00', 'PENDIENTE', 3, 5, NULL),
('2026-05-20', '10:45:00', 'PENDIENTE', 4, 5, NULL),
('2026-05-20', '11:00:00', 'PENDIENTE', 2, 5, NULL),
('2026-05-20', '11:15:00', 'CONFIRMADA', 3, 5, NULL),
('2026-05-20', '11:30:00', 'PENDIENTE', 4, 5, NULL),
('2026-05-20', '11:45:00', 'PENDIENTE', 2, 5, NULL),
('2026-05-20', '12:00:00', 'PENDIENTE', 3, 5, NULL),
('2026-05-20', '12:15:00', 'PENDIENTE', 4, 5, NULL),
('2026-05-20', '12:30:00', 'PENDIENTE', 2, 5, NULL),
-- Taller 6 (capacidad 8) -> 2026-05-22 (7 citas en total)
('2026-05-22', '16:00:00', 'PENDIENTE', 2, 6, NULL),
('2026-05-22', '17:00:00', 'PENDIENTE', 3, 6, NULL),
('2026-05-22', '17:30:00', 'PENDIENTE', 4, 6, NULL),
('2026-05-22', '18:00:00', 'CONFIRMADA', 2, 6, NULL),
('2026-05-22', '18:30:00', 'PENDIENTE', 3, 6, NULL),
('2026-05-22', '19:00:00', 'PENDIENTE', 4, 6, NULL),
-- Taller 7 (capacidad 10) -> 2026-05-21 (9 citas en total)
('2026-05-21', '09:45:00', 'PENDIENTE', 2, 7, NULL),
('2026-05-21', '10:00:00', 'PENDIENTE', 3, 7, NULL),
('2026-05-21', '10:15:00', 'PENDIENTE', 4, 7, NULL),
('2026-05-21', '10:30:00', 'PENDIENTE', 2, 7, NULL),
('2026-05-21', '11:15:00', 'PENDIENTE', 2, 7, NULL),
('2026-05-21', '11:30:00', 'PENDIENTE', 3, 7, NULL),
-- Taller 8 (capacidad 10) -> 2026-05-23 (9 citas en total)
('2026-05-23', '10:00:00', 'PENDIENTE', 2, 8, NULL),
('2026-05-23', '11:00:00', 'PENDIENTE', 3, 8, NULL),
('2026-05-23', '11:30:00', 'PENDIENTE', 4, 8, NULL),
('2026-05-23', '14:00:00', 'PENDIENTE', 3, 8, NULL),
-- Taller 9 (capacidad 9) -> 2026-05-24 (8 citas en total)
('2026-05-24', '11:15:00', 'PENDIENTE', 2, 9, NULL),
('2026-05-24', '11:30:00', 'PENDIENTE', 3, 9, NULL),
('2026-05-24', '11:45:00', 'PENDIENTE', 4, 9, NULL),
('2026-05-24', '12:00:00', 'PENDIENTE', 2, 9, NULL),
-- Taller 10 (capacidad 8) -> 2026-05-25 (7 citas en total)
('2026-05-25', '15:00:00', 'PENDIENTE', 2, 10, NULL),
('2026-05-25', '15:30:00', 'PENDIENTE', 3, 10, NULL),
('2026-05-25', '16:30:00', 'PENDIENTE', 4, 10, NULL),
('2026-05-25', '17:00:00', 'PENDIENTE', 2, 10, NULL),