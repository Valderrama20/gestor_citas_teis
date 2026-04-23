# Requerimientos API Frontend - Parte 2 (Talleres y Slots)

Este archivo es parte 2 de 3. Las tareas estan mezcladas (publico + admin).
La numeracion de secciones se mantiene respecto al documento original.

---

## 2.2 Obtener detalle de una especialidad

Usado en:
- `src/pages/Talleres/Talleres.jsx`
- `src/pages/AdminDashboard/AdminDashboard.jsx`

### Endpoint

```http
GET /courses/:courseId
```

### Ejemplo de respuesta

```json
{
  "id": "1",
  "name": "Peluqueria",
  "level": "Grado Medio",
  "period": "2025/2026",
  "studentCount": 15,
  "iconKey": "scissors",
  "specialtyDescription": "Corte, colorimetria y tratamientos capilares.",
  "workshopPageDescription": "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles."
}
```

### Campos esperados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `id` | `string` | Si | ID del curso/especialidad |
| `name` | `string` | Si | Nombre visible |
| `level` | `string` | Si | Nivel formativo |
| `period` | `string` | Si | Curso academico |
| `studentCount` | `number` | Si | Numero de alumnos |
| `iconKey` | `string` | Si | Clave de icono |
| `specialtyDescription` | `string` | Si | Descripcion publica |
| `workshopPageDescription` | `string` | Si | Descripcion usada en la pagina de talleres |

---

## 2.3 Obtener talleres por especialidad

Usado en:
- `src/pages/Talleres/Talleres.jsx`
- `src/pages/AdminDashboard/AdminDashboard.jsx` para el filtro por taller

### Endpoint

```http
GET /courses/:courseId/workshops
```

### Ejemplo de respuesta

```json
[
  {
    "id": "corte",
    "courseId": "1",
    "title": "Corte y peinado",
    "description": "Cortes clasicos, brushing y acabados para el dia a dia.",
    "iconKey": "scissors"
  },
  {
    "id": "color",
    "courseId": "1",
    "title": "Coloracion",
    "description": "Tintes, matices y retoque de raiz con asesoria previa.",
    "iconKey": "sparkles"
  }
]
```

### Campos esperados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `id` | `string` | Si | ID del taller |
| `courseId` | `string` | Si | ID de la especialidad |
| `title` | `string` | Si | Nombre del taller |
| `description` | `string` | Si | Descripcion corta |
| `iconKey` | `string` | Si | Clave de icono |

### Valores admitidos actualmente en `iconKey`

- `scissors`
- `sparkles`
- `droplets`
- `waves`
- `brush`
- `flower`
- `hand`

---

## 2.4 Obtener todos los talleres para el select de reserva

Usado en:
- `src/pages/Booking/Booking.jsx`

### Endpoint

```http
GET /workshops
```

### Ejemplo de respuesta

```json
[
  {
    "id": "corte",
    "courseId": "1",
    "title": "Corte y peinado",
    "description": "Cortes clasicos, brushing y acabados para el dia a dia.",
    "iconKey": "scissors"
  }
]
```

---

## 2.5 Obtener horarios disponibles de un taller

Usado en:
- `src/pages/Booking/Booking.jsx`

### Endpoint

```http
GET /workshops/:workshopId/slots
```

### Ejemplo de respuesta minima

```json
[
  {
    "id": "slot-1",
    "workshopId": "corte",
    "label": "Martes 22 de abril - 10:00"
  },
  {
    "id": "slot-2",
    "workshopId": "corte",
    "label": "Jueves 24 de abril - 12:30"
  }
]
```

### Respuesta recomendada para crecer mejor

```json
[
  {
    "id": "slot-1",
    "workshopId": "corte",
    "date": "2026-04-22",
    "time": "10:00",
    "label": "Martes 22 de abril - 10:00",
    "available": true
  }
]
```

### Campos esperados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `id` | `string` | Si | ID del hueco |
| `workshopId` | `string` | Si | ID del taller |
| `label` | `string` | Si | Texto mostrado en el select |
| `date` | `string` | Recomendado | Fecha en formato `YYYY-MM-DD` |
| `time` | `string` | Recomendado | Hora en formato `HH:mm` |
| `available` | `boolean` | Recomendado | Si esta libre o no |

---

## 3.6 Crear taller en un curso

Usado en:
- `src/components/CreateWorkshopModal/CreateWorkshopModal.jsx`

### Endpoint

```http
POST /admin/courses/:courseId/workshops
```

### Que envia el frontend

```json
{
  "title": "Ritual detox facial",
  "description": "Tratamiento express con limpieza y mascarilla.",
  "iconKey": "sparkles"
}
```

### Respuesta esperada

```json
{
  "id": "ritual-detox-facial",
  "courseId": "1",
  "title": "Ritual detox facial",
  "description": "Tratamiento express con limpieza y mascarilla.",
  "iconKey": "sparkles"
}
```
