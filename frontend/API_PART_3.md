# Requerimientos API Frontend - Parte 3 (Citas y Auth)

Este archivo es parte 3 de 3. Las tareas están mezcladas (público + admin).

---

## Tareas de Base de Datos y Backend Asociadas

Para alinear el sistema de reservas y citas con esta parte de la API y el Frontend, deben hacerse los siguientes cambios:

**Tabla `citas`**
- **Campos existentes a mapear:** `id_cita`, `fecha`, `hora`, `estado`, `id_cliente`, `id_taller`, `id_alumno`.
- **Añadir/Modificar en BD:**
  - `fecha_creacion` (TIMESTAMP): Campo NUEVO para guardar el momento exacto en el que el usuario o el administrador reservó la cita.
  - En el campo `estado` (`ENUM`), hay que añadir el valor `'cancelada'`, ya que actualmente sólo se permiten `'pendiente', 'confirmada', 'completada'`.

**Tabla `cliente`**
- **Campos existentes a mapear:** `id_cliente`, `nombre` (mapeado a `cliente` en requests), `email`, `telefono` (aunque el payload del frontend no nos pida teléfono, podríamos querer recibirlo en el futuro, pero de momento es irrelevante), `notas_alergias`.

**API Java (Citas y Clientes):**
- La entidad `Cita` debe añadir el mapeo del nuevo atributo `fechaCreacion`.
- El enumerado `EstadoCita` debe incluir `CANCELADA`.
- Los controladores expuestos que atiendan peticiones de creación (y los DTOs) deben interpretar el `id_taller` (antes workshopId) e interrogar la tabla de horarios o el calculador de huecos a través del `id_horario` que ahora viaja en el payload.
- Es vital recibir el nombre, email y notas_alergias del payload de Cita y guardarlo/actualizarlo en la tabla `cliente`.

---

## 3.1 Login admin

### Endpoint

```http
POST /admin/auth/login
```

### Qué envía el frontend

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
  "usuario": {
    "id": "teacher-1",
    "nombre": "Profesor",
    "email": "profesor@teis.es",
    "rol": "admin"
  }
}
```

---

## 2.6 Crear una cita

### Endpoint

```http
POST /citas
```

### Qué envía el frontend

```json
{
  "nombre": "Ana Garcia",
  "email": "ana@email.com",
  "id_taller": "corte",
  "id_horario": "slot-1",
  "notas_alergias": "Piel sensible"
}
```

### Campos enviados

| Campo | Tabla DB Destino | Obligatorio | Descripción |
|---|---|---:|---|
| `nombre` | `cliente.nombre` | Sí | Nombre del cliente |
| `email` | `cliente.email` | Sí | Email del cliente |
| `id_taller` | `citas.id_taller` | Sí | Taller elegido |
| `id_horario` | *(Lógica de fecha)* | Sí | Hueco/Horario seleccionado |
| `notas_alergias` | `cliente.notas_alergias` | No | Observaciones o alergias |

### Respuesta esperada

```json
{
  "id_cita": 101,
  "cliente": "Ana Garcia",
  "email": "ana@email.com",
  "id_taller": "corte",
  "id_horario": "slot-1",
  "estado": "pendiente",
  "notas_alergias": "Piel sensible",
  "fecha_creacion": "2026-04-22T10:20:00.000Z"
}
```

---

## 3.4 Obtener citas de un curso

El frontend soporta filtros opcionales.

### Endpoint

```http
GET /admin/cursos/:id_curso/citas?fecha=2026-04-22&id_taller=corte
```

### Respuesta esperada

```json
[
  {
    "id_cita": 1,
    "id_curso": "1",
    "cliente": "Ana Garcia",
    "id_taller": "corte",
    "titulo_taller": "Corte y peinado",
    "fecha": "2026-04-22",
    "hora": "10:00",
    "estado": "pendiente"
  }
]
```

---

## 3.5 Actualizar estado de una cita

### Endpoint

```http
PATCH /admin/citas/:id_cita/estado
```

### Qué envía el frontend

```json
{
  "estado": "confirmada"
}
```

Estados válidos: `pendiente`, `confirmada`, `completada`, `cancelada`.

### Respuesta esperada

```json
{
  "id_cita": 1,
  "id_curso": "1",
  "cliente": "Ana Garcia",
  "id_taller": "corte",
  "titulo_taller": "Corte y peinado",
  "fecha": "2026-04-22",
  "hora": "10:00",
  "estado": "confirmada"
}
```

---

## 3.7 Crear cita manual (admin)

### Endpoint

```http
POST /admin/cursos/:id_curso/citas
```

### Qué envía el frontend

```json
{
  "cliente": "Maria Alonso",
  "email": "maria@correo.com",
  "id_taller": "corte",
  "id_horario": "slot-1",
  "notas_alergias": "Piel sensible"
}
```

### Respuesta esperada

```json
{
  "id_cita": 120,
  "id_curso": "1",
  "cliente": "Maria Alonso",
  "email": "maria@correo.com",
  "id_taller": "corte",
  "titulo_taller": "Corte y peinado",
  "fecha": "2026-04-22",
  "hora": "10:00",
  "estado": "pendiente",
  "notas_alergias": "Piel sensible"
}
```

---

## 5. Resumen para Backend (Mapeo Completo Español)

Backend debería implementar:

- `POST /admin/auth/login`
- `GET /cursos/publico`
- `GET /cursos/:id_curso`
- `GET /cursos/:id_curso/talleres`
- `GET /talleres`
- `GET /talleres/:id_taller/horarios`
- `POST /citas`
- `GET /admin/cursos`
- `POST /admin/cursos`
- `GET /admin/cursos/:id_curso/citas`
- `POST /admin/cursos/:id_curso/citas`
- `POST /admin/cursos/:id_curso/talleres`
- `PATCH /admin/citas/:id_cita/estado`
