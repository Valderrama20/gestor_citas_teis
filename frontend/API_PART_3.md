# Requerimientos API Frontend - Parte 3 (Citas y Auth)

Este archivo es parte 3 de 3. Las tareas estan mezcladas (publico + admin).

---

## Tareas de Base de Datos y Backend Asociadas

Para alinear el sistema de reservas y citas con esta parte de la API y el frontend, deben hacerse los siguientes cambios:

**Tabla `citas`**
- **Campos existentes a mapear:** `id_cita`, `fecha`, `hora`, `estado`, `id_cliente`, `id_taller`, `id_alumno`.
- **Anadir o modificar en BD:**
  - `fecha_creacion` (`TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`): Momento exacto en el que se registro la cita.
  - Ampliar `estado` para permitir tambien `'cancelada'`, ademas de `'pendiente'`, `'confirmada'` y `'completada'`.

**Tabla `cliente`**
- **Campos existentes a mapear:** `id_cliente`, `nombre`, `email`, `telefono`, `password`, `notas_alergias`.
- **Sin campos nuevos en esta fase:** la tarea es guardar o actualizar por `email` el `nombre` y `notas_alergias` recibidos desde el frontend.

**API Java (Citas, Clientes y Auth)**
- Corregir `es.iesdeteis.gestorcitas.model.Cita` para que apunte a `@Table(name = "citas")`.
- Anadir `fechaCreacion` a la entidad `Cita` y a sus DTOs.
- Ajustar `EstadoCita` para que soporte exactamente `PENDIENTE`, `CONFIRMADA`, `COMPLETADA` y `CANCELADA`.
- Los endpoints de alta de cita deben resolver el hueco concreto con `id_horario`, `fecha` y `hora`, y persistir el resultado en `citas.fecha` y `citas.hora`.
- La API debe crear o actualizar `cliente` por email antes de guardar la cita.
- El login admin debe responder con claves en espanol: `usuario`, `id_admin`, `nombre`, `email`, `rol`.

**Renombres frontend -> espanol**
- `user` -> `usuario`
- `role` -> `rol`
- `appointmentId` -> `id_cita`
- `courseId` -> `id_curso`
- `workshopId` -> `id_taller`
- `slotId` -> `id_horario`
- `client` -> `cliente`
- `name` -> `nombre`
- `date` -> `fecha`
- `time` -> `hora`
- `status` -> `estado`
- `allergies` -> `notas_alergias`
- `createdAt` -> `fecha_creacion`

---

## 3.1 Login admin

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
  "usuario": {
    "id_admin": 1,
    "nombre": "Profesor Coordinador",
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

### Que envia el frontend

```json
{
  "nombre": "Ana Garcia",
  "email": "ana@email.com",
  "id_taller": 1,
  "id_horario": 7,
  "fecha": "2026-04-22",
  "hora": "10:00",
  "notas_alergias": "Piel sensible"
}
```

### Campos enviados

| Campo | Tabla DB destino | Obligatorio | Descripcion |
|---|---|---:|---|
| `nombre` | `cliente.nombre` | Si | Nombre del cliente |
| `email` | `cliente.email` | Si | Email del cliente |
| `id_taller` | `citas.id_taller` | Si | Taller elegido |
| `id_horario` | `horario_taller.id_horario` + logica | Si | Configuracion horaria seleccionada |
| `fecha` | `citas.fecha` | Si | Fecha concreta del hueco elegido |
| `hora` | `citas.hora` | Si | Hora concreta del hueco elegido |
| `notas_alergias` | `cliente.notas_alergias` | No | Observaciones o alergias |

### Respuesta esperada

```json
{
  "id_cita": 101,
  "cliente": "Ana Garcia",
  "email": "ana@email.com",
  "id_taller": 1,
  "id_horario": 7,
  "fecha": "2026-04-22",
  "hora": "10:00",
  "estado": "pendiente",
  "notas_alergias": "Piel sensible",
  "fecha_creacion": "2026-04-22T10:20:00Z"
}
```

---

## 3.4 Obtener citas de un curso

El frontend soporta filtros opcionales.

### Endpoint

```http
GET /admin/cursos/:id_curso/citas?fecha=2026-04-22&id_taller=1
```

### Respuesta esperada

```json
[
  {
    "id_cita": 1,
    "id_curso": 1,
    "cliente": "Ana Garcia",
    "id_taller": 1,
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

### Que envia el frontend

```json
{
  "estado": "confirmada"
}
```

Estados validos: `pendiente`, `confirmada`, `completada`, `cancelada`.

### Respuesta esperada

```json
{
  "id_cita": 1,
  "id_curso": 1,
  "cliente": "Ana Garcia",
  "id_taller": 1,
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

### Que envia el frontend

```json
{
  "nombre": "Maria Alonso",
  "email": "maria@correo.com",
  "id_taller": 1,
  "id_horario": 7,
  "fecha": "2026-04-22",
  "hora": "10:00",
  "notas_alergias": "Piel sensible"
}
```

### Respuesta esperada

```json
{
  "id_cita": 120,
  "id_curso": 1,
  "cliente": "Maria Alonso",
  "email": "maria@correo.com",
  "id_taller": 1,
  "titulo_taller": "Corte y peinado",
  "fecha": "2026-04-22",
  "hora": "10:00",
  "estado": "pendiente",
  "notas_alergias": "Piel sensible",
  "fecha_creacion": "2026-04-22T10:20:00Z"
}
```

---

## 5. Resumen para Backend (Mapeo completo en espanol)

Backend deberia implementar:

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
