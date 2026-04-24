# Requerimientos API Frontend - Parte 1 (Cursos y Convenciones)

Este archivo es parte 1 de 3. Las tareas están mezcladas (público + admin).

Base URL esperada por el frontend:

```txt
/api
```

---

## Tareas de Base de Datos y Backend Asociadas

Para alinear la base de datos y la API (Java) con el JSON que espera y envía el frontend, deben realizarse las siguientes operaciones:

**Tabla `curso`**
- **Campos existentes a mapear:** `id_curso`, `nombre_curso` (como `nombre` / `titulo`), `curso_academico`.
- **Campos NUEVOS que se deben añadir a la base de datos:**
  - `nivel` (VARCHAR): Almacena el nivel formativo (ej. "Grado Medio", "Grado Superior").
  - `icono` (VARCHAR): Clave del icono (ej. "scissors", "sparkles").
  - `descripcion_especialidad` (TEXT): Descripción mostrada en la web pública.
  - `descripcion_taller` (TEXT): Descripción en la cabecera de la página de reserva.
- **Dato calculado:** `numero_estudiantes` no está en la tabla `curso`. Deberá calcularse en el backend haciendo un `COUNT(id_alumno)` de la tabla `alumno` asociada, o crear un campo físico si se prefiere.

**API Java:**
- Actualizar la entidad `Curso` (`es.iesdeteis.gestorcitas.model.Curso`) con los campos nuevos.
- Ajustar los DTOs de salida (`GET`) y entrada (`POST`) para que todas las claves JSON coincidan exactamente con el español detallado abajo (`id_curso`, `titulo`, `nombre`, etc.).

---

## 1. Convenciones generales

### Formato

- `Content-Type: application/json`
- Las respuestas deben venir en JSON.
- Los errores deberían devolver un mensaje legible para el frontend.

### Respuesta de error recomendada

```json
{
  "mensaje": "Mensaje descriptivo del error"
}
```

### Estados de cita válidos

El frontend trabaja con estos estados exactos (ahora adaptado a español y añadiendo cancelada en BD):

- `pendiente`
- `confirmada`
- `completada`
- `cancelada`

### Identificadores

Ahora el frontend y el backend usarán los identificadores en español, coherentes con la DB:

- `id_curso` (antes courseId)
- `id_taller` (antes workshopId)
- `id_horario` (antes slotId)
- `id_cita` (antes appointmentId)

---

## 2.1 Obtener especialidades para Home

### Endpoint (Sugerido adaptado)

```http
GET /cursos/publico
```

### Qué devuelve

```json
[
  {
    "id_curso": "1",
    "titulo": "Peluquería",
    "descripcion_especialidad": "Corte, colorimetría y tratamientos capilares.",
    "icono": "scissors"
  },
  {
    "id_curso": "2",
    "titulo": "Cuidado Facial",
    "descripcion_especialidad": "Higiene, hidratación y maquillaje profesional.",
    "icono": "sparkles"
  }
]
```

### Campos esperados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `id_curso` | `string|number` | Sí | ID de la especialidad |
| `titulo` | `string` | Sí | Título mostrado en Home (mapeado de `nombre_curso`) |
| `descripcion_especialidad` | `string` | Sí | Texto corto descriptivo |
| `icono` | `string` | Sí | Clave de icono usada por frontend |

---

## 3.2 Obtener cursos para el panel admin

### Endpoint

```http
GET /admin/cursos
```

### Respuesta esperada

```json
[
  {
    "id_curso": "1",
    "nombre": "Peluquería",
    "nivel": "Grado Medio",
    "curso_academico": "2025/2026",
    "numero_estudiantes": 15
  },
  {
    "id_curso": "2",
    "nombre": "Cuidado Facial",
    "nivel": "Grado Superior",
    "curso_academico": "2025/2026",
    "numero_estudiantes": 12
  }
]
```

---

## 3.3 Crear curso

### Endpoint

```http
POST /admin/cursos
```

### Qué envía el frontend

```json
{
  "nombre": "Peluquería avanzada",
  "nivel": "Grado Medio",
  "curso_academico": "2025/2026",
  "numero_estudiantes": 15,
  "icono": "scissors",
  "descripcion_especialidad": "Corte, colorimetría y tratamientos capilares.",
  "descripcion_taller": "Selecciona un taller de ejemplo para ver cómo podríamos organizar los servicios..."
}
```

### Respuesta esperada

```json
{
  "id_curso": "1",
  "nombre": "Peluquería avanzada",
  "nivel": "Grado Medio",
  "curso_academico": "2025/2026",
  "numero_estudiantes": 15,
  "icono": "scissors",
  "descripcion_especialidad": "Corte, colorimetría y tratamientos capilares.",
  "descripcion_taller": "Selecciona un taller de ejemplo para ver cómo podríamos organizar los servicios..."
}
```
