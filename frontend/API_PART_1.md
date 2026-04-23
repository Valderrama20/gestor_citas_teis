# Requerimientos API Frontend - Parte 1 (Cursos y Convenciones)

Este archivo es parte 1 de 3. Las tareas estan mezcladas (publico + admin).
La numeracion de secciones se mantiene respecto al documento original.

Base URL esperada por el frontend:

```txt
/api
```

Ejemplo en local:

```txt
http://localhost:3000/api
```

---

## 1. Convenciones generales

### Formato

- `Content-Type: application/json`
- Las respuestas deben venir en JSON.
- Los errores deberian devolver un mensaje legible para el frontend.

### Respuesta de error recomendada

```json
{
  "message": "Mensaje descriptivo del error"
}
```

### Estados de cita validos

El frontend trabaja con estos estados exactos:

- `Pendiente`
- `Confirmada`
- `Completada`
- `Cancelada`

### Identificadores

Actualmente el frontend usa sobre todo IDs tipo string para catalogos:

- `courseId`
- `workshopId`
- `slotId`

El `appointmentId` puede ser numerico o string, pero debe mantenerse consistente.

---

## 2.1 Obtener especialidades para Home

Usado en:
- `src/pages/Home/Home.jsx`

### Endpoint

```http
GET /courses/public
```

### Que devuelve

```json
[
  {
    "id": "1",
    "title": "Peluqueria",
    "description": "Corte, colorimetria y tratamientos capilares.",
    "iconKey": "scissors"
  },
  {
    "id": "2",
    "title": "Cuidado Facial",
    "description": "Higiene, hidratacion y maquillaje profesional.",
    "iconKey": "sparkles"
  }
]
```

### Campos esperados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `id` | `string` | Si | ID de la especialidad |
| `title` | `string` | Si | Titulo mostrado en Home |
| `description` | `string` | Si | Texto corto descriptivo |
| `iconKey` | `string` | Si | Clave de icono usada por frontend |

### Valores admitidos actualmente en `iconKey`

- `scissors`
- `sparkles`
- `flower`
- `hand`

---

## 3.2 Obtener cursos para el panel admin

Usado en:
- `src/pages/AdminCourses/AdminCourses.jsx`

### Endpoint

```http
GET /admin/courses
```

### Respuesta esperada

```json
[
  {
    "id": "1",
    "name": "Peluqueria",
    "level": "Grado Medio",
    "period": "2025/2026",
    "studentCount": 15
  },
  {
    "id": "2",
    "name": "Cuidado Facial",
    "level": "Grado Superior",
    "period": "2025/2026",
    "studentCount": 12
  }
]
```

---

## 3.3 Crear curso

Usado en:
- `src/components/CreateCourseModal/CreateCourseModal.jsx`

### Endpoint

```http
POST /admin/courses
```

### Que envia el frontend

```json
{
  "name": "Peluqueria avanzada",
  "level": "Grado Medio",
  "period": "2025/2026",
  "studentCount": 15,
  "iconKey": "scissors",
  "specialtyDescription": "Corte, colorimetria y tratamientos capilares.",
  "workshopPageDescription": "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles."
}
```

> `workshopPageDescription` puede venir como string vacio si el formulario no lo solicita aun.

### Respuesta esperada

```json
{
  "id": "1",
  "name": "Peluqueria avanzada",
  "level": "Grado Medio",
  "period": "2025/2026",
  "studentCount": 15,
  "iconKey": "scissors",
  "specialtyDescription": "Corte, colorimetria y tratamientos capilares.",
  "workshopPageDescription": "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles."
}
```
