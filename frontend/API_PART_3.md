# Requerimientos API Frontend - Parte 3 (Citas y Auth)

Este archivo es parte 3 de 3. Las tareas estan mezcladas (publico + admin).
La numeracion de secciones se mantiene respecto al documento original.

---

## 3.1 Login admin

Usado en:
- `src/pages/AdminLogin/AdminLogin.jsx`

Actualmente el frontend todavia navega directamente tras enviar el formulario, pero este endpoint sera necesario para la integracion real.

### Endpoint

```http
POST /admin/auth/login
```

### Que envia el frontend

```json
{
  "email": "profesor@teis.es",
  "password": "secret"
}
```

### Respuesta esperada

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

## 2.6 Crear una cita

Usado en:
- `src/pages/Booking/Booking.jsx`

### Endpoint

```http
POST /appointments
```

### Que envia el frontend

```json
{
  "name": "Ana Garcia",
  "email": "ana@email.com",
  "workshopId": "corte",
  "slotId": "slot-1",
  "allergies": "Piel sensible"
}
```

### Campos enviados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `name` | `string` | Si | Nombre del cliente |
| `email` | `string` | Si | Email del cliente |
| `workshopId` | `string` | Si | Taller elegido |
| `slotId` | `string` | Si | Hueco seleccionado |
| `allergies` | `string` | No | Observaciones o alergias |

### Respuesta esperada

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

## 3.4 Obtener citas de un curso

Usado en:
- `src/pages/AdminDashboard/AdminDashboard.jsx`

El frontend ya soporta filtros por:
- `date`
- `workshopId`

Por tanto, se recomienda que backend los acepte desde ya.

### Endpoint recomendado

```http
GET /admin/courses/:courseId/appointments?date=2026-04-22&workshopId=corte
```

Ambos query params son opcionales.

### Parametros query

| Parametro | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `date` | `string` | No | Fecha exacta en formato `YYYY-MM-DD` |
| `workshopId` | `string` | No | ID del taller |

### Respuesta esperada

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

### Campos esperados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `id` | `number|string` | Si | ID de la cita |
| `courseId` | `string` | Si | ID del curso |
| `client` | `string` | Si | Nombre del cliente |
| `workshopId` | `string` | Si | ID del taller |
| `workshopTitle` | `string` | Si | Nombre del taller ya resuelto |
| `date` | `string` | Si | Fecha en formato `YYYY-MM-DD` |
| `time` | `string` | Si | Hora en formato `HH:mm` |
| `status` | `string` | Si | Uno de los estados validos |

---

## 3.5 Actualizar estado de una cita

Usado en:
- `src/pages/AdminDashboard/AdminDashboard.jsx`

### Endpoint

```http
PATCH /admin/appointments/:appointmentId/status
```

### Que envia el frontend

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

### Transiciones que hoy hace el frontend

- `Pendiente` -> `Confirmada`
- `Confirmada` -> `Completada`
- `Confirmada` -> `Cancelada`

### Respuesta esperada

Opcion preferida:

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

Opcion tambien valida:
- devolver la lista completa de citas actualizada del curso

---

## 3.7 Crear cita manual (admin)

Usado en:
- `src/components/CreateAppointmentModal/CreateAppointmentModal.jsx`

### Endpoint

```http
POST /admin/courses/:courseId/appointments
```

### Que envia el frontend

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

### Respuesta esperada

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

En `src/services/appointmentService.js` todavia existe una funcion antigua para consultar disponibilidad por fecha.

Si backend quiere soportarla:

```http
GET /appointments/available?date=2026-04-22
```

### Respuesta sugerida

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

Si este endpoint no va a existir, despues conviene limpiar esa funcion del servicio.

---

## 5. Resumen minimo para backend

Backend deberia implementar como minimo:

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

## 6. Recomendacion para integrar rapido

La forma mas directa de conectar backend con este frontend es:

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

4. Incluir `workshopTitle` ya resuelto en las citas del panel admin para evitar logica extra en frontend.
