# Requerimientos API Frontend

Este documento resume los endpoints que el frontend necesita actualmente para poder integrarse con backend.

Objetivo:
- que backend conozca exactamente qué rutas debe exponer
- qué datos debe recibir
- qué estructura debe devolver
- qué filtros y estados espera el frontend

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
- Los errores deberían devolver un mensaje legible para el frontend.

### Respuesta de error recomendada

```json
{
  "message": "Mensaje descriptivo del error"
}
```

### Estados de cita válidos

El frontend trabaja con estos estados exactos:

- `Pendiente`
- `Confirmada`
- `Completada`
- `Cancelada`

### Identificadores

Actualmente el frontend usa sobre todo IDs tipo string para catálogos:

- `courseId`
- `workshopId`
- `slotId`

El `appointmentId` puede ser numérico o string, pero debe mantenerse consistente.

---

## 2. Área pública

### 2.1 Obtener especialidades para Home

Usado en:
- `src/pages/Home/Home.jsx`

#### Endpoint

```http
GET /courses/public
```

#### Qué devuelve

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

#### Campos esperados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `id` | `string` | Sí | ID de la especialidad |
| `title` | `string` | Sí | Título mostrado en Home |
| `description` | `string` | Sí | Texto corto descriptivo |
| `iconKey` | `string` | Sí | Clave de icono usada por frontend |

#### Valores admitidos actualmente en `iconKey`

- `scissors`
- `sparkles`
- `flower`
- `hand`

---

### 2.2 Obtener detalle de una especialidad

Usado en:
- `src/pages/Talleres/Talleres.jsx`
- `src/pages/AdminDashboard/AdminDashboard.jsx`

#### Endpoint

```http
GET /courses/:courseId
```

#### Ejemplo de respuesta

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

#### Campos esperados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `id` | `string` | Sí | ID del curso/especialidad |
| `name` | `string` | Sí | Nombre visible |
| `level` | `string` | Sí | Nivel formativo |
| `period` | `string` | Sí | Curso académico |
| `studentCount` | `number` | Sí | Número de alumnos |
| `iconKey` | `string` | Sí | Clave de icono |
| `specialtyDescription` | `string` | Sí | Descripción pública |
| `workshopPageDescription` | `string` | Sí | Descripción usada en la página de talleres |

---

### 2.3 Obtener talleres por especialidad

Usado en:
- `src/pages/Talleres/Talleres.jsx`
- `src/pages/AdminDashboard/AdminDashboard.jsx` para el filtro por taller

#### Endpoint

```http
GET /courses/:courseId/workshops
```

#### Ejemplo de respuesta

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

#### Campos esperados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `id` | `string` | Sí | ID del taller |
| `courseId` | `string` | Sí | ID de la especialidad |
| `title` | `string` | Sí | Nombre del taller |
| `description` | `string` | Sí | Descripción corta |
| `iconKey` | `string` | Sí | Clave de icono |

#### Valores admitidos actualmente en `iconKey`

- `scissors`
- `sparkles`
- `droplets`
- `waves`
- `brush`
- `flower`
- `hand`

---

### 2.4 Obtener todos los talleres para el select de reserva

Usado en:
- `src/pages/Booking/Booking.jsx`

#### Endpoint

```http
GET /workshops
```

#### Ejemplo de respuesta

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

### 2.5 Obtener horarios disponibles de un taller

Usado en:
- `src/pages/Booking/Booking.jsx`

#### Endpoint

```http
GET /workshops/:workshopId/slots
```

#### Ejemplo de respuesta mínima

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

#### Respuesta recomendada para crecer mejor

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

#### Campos esperados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `id` | `string` | Sí | ID del hueco |
| `workshopId` | `string` | Sí | ID del taller |
| `label` | `string` | Sí | Texto mostrado en el select |
| `date` | `string` | Recomendado | Fecha en formato `YYYY-MM-DD` |
| `time` | `string` | Recomendado | Hora en formato `HH:mm` |
| `available` | `boolean` | Recomendado | Si está libre o no |

---

### 2.6 Crear una cita

Usado en:
- `src/pages/Booking/Booking.jsx`

#### Endpoint

```http
POST /appointments
```

#### Qué envía el frontend

```json
{
  "name": "Ana Garcia",
  "email": "ana@email.com",
  "workshopId": "corte",
  "slotId": "slot-1",
  "allergies": "Piel sensible"
}
```

#### Campos enviados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `name` | `string` | Sí | Nombre del cliente |
| `email` | `string` | Sí | Email del cliente |
| `workshopId` | `string` | Sí | Taller elegido |
| `slotId` | `string` | Sí | Hueco seleccionado |
| `allergies` | `string` | No | Observaciones o alergias |

#### Respuesta esperada

```json
{
  "id": 101,
  "client": "Ana Garcia",
  "email": "ana@email.com",
  "workshopId": "corte",
  "slotId": "slot-1",
  "status": "Pendiente",
  "allergies": "Piel sensible",
  "createdAt": "2026-04-22T10:20:00.000Z"
}
```

---

## 3. Área admin

### 3.1 Login admin

Usado en:
- `src/pages/AdminLogin/AdminLogin.jsx`

Actualmente el frontend todavía navega directamente tras enviar el formulario, pero este endpoint será necesario para la integración real.

#### Endpoint

```http
POST /admin/auth/login
```

#### Qué envía el frontend

```json
{
  "email": "profesor@teis.es",
  "password": "secret"
}
```

#### Respuesta esperada

```json
{
  "token": "jwt-o-token-de-sesion",
  "user": {
    "id": "teacher-1",
    "name": "Profesor",
    "email": "profesor@teis.es",
    "role": "admin"
  }
}
```

---

### 3.2 Obtener cursos para el panel admin

Usado en:
- `src/pages/AdminCourses/AdminCourses.jsx`

#### Endpoint

```http
GET /admin/courses
```

#### Respuesta esperada

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

### 3.3 Crear curso

Usado en:
- `src/components/CreateCourseModal/CreateCourseModal.jsx`

#### Endpoint

```http
POST /admin/courses
```

#### Qué envía el frontend

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

#### Respuesta esperada

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

---

### 3.4 Obtener citas de un curso

Usado en:
- `src/pages/AdminDashboard/AdminDashboard.jsx`

El frontend ya soporta filtros por:
- `date`
- `workshopId`

Por tanto, se recomienda que backend los acepte desde ya.

#### Endpoint recomendado

```http
GET /admin/courses/:courseId/appointments?date=2026-04-22&workshopId=corte
```

Ambos query params son opcionales.

#### Parámetros query

| Parámetro | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `date` | `string` | No | Fecha exacta en formato `YYYY-MM-DD` |
| `workshopId` | `string` | No | ID del taller |

#### Respuesta esperada

```json
[
  {
    "id": 1,
    "courseId": "1",
    "client": "Ana Garcia",
    "workshopId": "corte",
    "workshopTitle": "Corte y peinado",
    "date": "2026-04-22",
    "time": "10:00",
    "status": "Pendiente"
  },
  {
    "id": 2,
    "courseId": "1",
    "client": "Pedro Sanchez",
    "workshopId": "color",
    "workshopTitle": "Coloracion",
    "date": "2026-04-22",
    "time": "11:00",
    "status": "Confirmada"
  }
]
```

#### Campos esperados

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `id` | `number|string` | Sí | ID de la cita |
| `courseId` | `string` | Sí | ID del curso |
| `client` | `string` | Sí | Nombre del cliente |
| `workshopId` | `string` | Sí | ID del taller |
| `workshopTitle` | `string` | Sí | Nombre del taller ya resuelto |
| `date` | `string` | Sí | Fecha en formato `YYYY-MM-DD` |
| `time` | `string` | Sí | Hora en formato `HH:mm` |
| `status` | `string` | Sí | Uno de los estados válidos |

---

### 3.5 Actualizar estado de una cita

Usado en:
- `src/pages/AdminDashboard/AdminDashboard.jsx`

#### Endpoint

```http
PATCH /admin/appointments/:appointmentId/status
```

#### Qué envía el frontend

Ejemplo 1:

```json
{
  "status": "Confirmada"
}
```

Ejemplo 2:

```json
{
  "status": "Completada"
}
```

Ejemplo 3:

```json
{
  "status": "Cancelada"
}
```

#### Transiciones que hoy hace el frontend

- `Pendiente` -> `Confirmada`
- `Confirmada` -> `Completada`
- `Confirmada` -> `Cancelada`

#### Respuesta esperada

Opción preferida:

```json
{
  "id": 2,
  "courseId": "1",
  "client": "Pedro Sanchez",
  "workshopId": "color",
  "workshopTitle": "Coloracion",
  "date": "2026-04-22",
  "time": "11:00",
  "status": "Completada"
}
```

Opción también válida:
- devolver la lista completa de citas actualizada del curso

---

### 3.6 Crear taller en un curso

Usado en:
- `src/components/CreateWorkshopModal/CreateWorkshopModal.jsx`

#### Endpoint

```http
POST /admin/courses/:courseId/workshops
```

#### Qué envía el frontend

```json
{
  "title": "Ritual detox facial",
  "description": "Tratamiento express con limpieza y mascarilla.",
  "iconKey": "sparkles"
}
```

#### Respuesta esperada

```json
{
  "id": "ritual-detox-facial",
  "courseId": "1",
  "title": "Ritual detox facial",
  "description": "Tratamiento express con limpieza y mascarilla.",
  "iconKey": "sparkles"
}
```

---

### 3.7 Crear cita manual (admin)

Usado en:
- `src/components/CreateAppointmentModal/CreateAppointmentModal.jsx`

#### Endpoint

```http
POST /admin/courses/:courseId/appointments
```

#### Qué envía el frontend

```json
{
  "client": "Maria Alonso",
  "email": "maria@correo.com",
  "workshopId": "corte",
  "slotId": "slot-1",
  "allergies": "Piel sensible"
}
```

> El frontend selecciona `slotId` desde `GET /workshops/:workshopId/slots`.
> Se recomienda que backend derive `date` y `time` a partir del slot.

#### Respuesta esperada

```json
{
  "id": 120,
  "courseId": "1",
  "client": "Maria Alonso",
  "email": "maria@correo.com",
  "workshopId": "corte",
  "workshopTitle": "Corte y peinado",
  "date": "2026-04-22",
  "time": "10:00",
  "status": "Pendiente",
  "allergies": "Piel sensible"
}
```

---

## 4. Endpoint legado opcional

En `src/services/appointmentService.js` todavía existe una función antigua para consultar disponibilidad por fecha.

Si backend quiere soportarla:

```http
GET /appointments/available?date=2026-04-22
```

#### Respuesta sugerida

```json
[
  {
    "id": "slot-1",
    "workshopId": "corte",
    "date": "2026-04-22",
    "time": "10:00",
    "label": "Martes 22 de abril - 10:00"
  }
]
```

Si este endpoint no va a existir, después conviene limpiar esa función del servicio.

---

## 5. Resumen mínimo para backend

Backend debería implementar como mínimo:

- `POST /admin/auth/login`
- `GET /courses/public`
- `GET /courses/:courseId`
- `GET /courses/:courseId/workshops`
- `GET /workshops`
- `GET /workshops/:workshopId/slots`
- `POST /appointments`
- `GET /admin/courses`
- `POST /admin/courses`
- `GET /admin/courses/:courseId/appointments`
- `POST /admin/courses/:courseId/appointments`
- `POST /admin/courses/:courseId/workshops`
- `PATCH /admin/appointments/:appointmentId/status`

---

## 6. Recomendación para integrar rápido

La forma más directa de conectar backend con este frontend es:

1. Devolver exactamente las estructuras documentadas arriba.
2. Soportar filtros en:

```http
GET /admin/courses/:courseId/appointments?date=&workshopId=
```

3. Mantener exactamente estos estados:

- `Pendiente`
- `Confirmada`
- `Completada`
- `Cancelada`

4. Incluir `workshopTitle` ya resuelto en las citas del panel admin para evitar lógica extra en frontend.
