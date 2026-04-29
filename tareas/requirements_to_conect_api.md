# 1. Vista de Home (Cliente)

## Campos actuales 

- `id_curso`
- `nombre_curso`
- `curso_academico`
- `id_admin`

## Campos necesarios devueltos por la API

- `id_curso`
- `nombre_curso`
- `curso_academico`
- `alumnos` *(agregar: número de alumnos)*
- `descripcion` *(agregar: tipo varchar)*
- `icono` *(agregar: tipo varchar)*
- `nivel` *(agregar tipo. ejemplo: grado medio, grado superior)*
- `id_admin`

### Tareas:
- [ ] Actualizar la tabla en la base de datos
- [ ] Actualizar las entidades en la API
- [ ] Verificar la respuesta de la API

---

# 2. Vista de Talleres (Cliente)

## Campos actuales 

- `id_taller`
- `nombre_taller`
- `duracion_minutos`
- `tipo_taller`
- `capacidad_maxima`
- `id_curso`

## Campos necesarios devueltos por la API

- `id_taller`
- `nombre_taller`
- `duracion_minutos`
- `tipo_taller`
- `capacidad_maxima`
- `descripcion` *(agregar: tipo varchar)*
- `icono` *(agregar: tipo varchar)*
- `id_curso`

### Tareas:
- [ ] Actualizar la tabla en la base de datos
- [ ] Actualizar las entidades en la API
- [ ] Verificar la respuesta de la API

---

# 3. Vista de Formulario (Cliente)

## 3.1. Obtener horarios de un taller específico
**Ruta para traer los horarios de un taller:** La ruta debe tomar el ID de un taller y retornar sus horarios.

### Campos actuales

- `id_horario`
- `dia_semana`
- `hora_apertura`
- `hora_cierre` *(Verificar si es necesario el campo hora cierre)*
- `id_taller`

![alt text](image.png)

> **Nota:** Ya que solo tenemos el día de la semana, implementar la lógica para saber qué número es el próximo día indicado.

## 3.2. Crear una cita
**Ruta para crear una cita:**

### Datos enviados por el formulario

- `name`
- `email`
- `taller_id` (`initialWorkshopId`)
- `horario_id`
- `allergies`

### Tabla a crear / actual

- `id_cita`
- `fecha`
- `hora`
- `estado` *(default: pendiente)*
- `id_cliente`
- `id_taller`
- `id_alumno`

---

# 4. Vista de Home (Profesores)

- [ ] Crear ruta para obtener todos los cursos de un profesor.

---

# 5. Cursos (Profesores)

- [ ] Crear ruta para crear un curso.

---

# 6. Vista de Citas y Talleres (Profesores)

## 6.1. Obtener citas
- [ ] Crear ruta para obtener todas las citas de un curso.

## 6.2. Actualizar cita
- [ ] Crear ruta para actualizar una cita. *(Esta será para los cambios de estado: "pendiente", "confirmada", "completada" y "cancelada")*.

## 6.3. Crear taller
- [ ] Crear ruta para crear un taller.
