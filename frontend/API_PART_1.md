# Requerimientos API Frontend - Parte 1 (Cursos y Convenciones)

Este archivo es parte 1 de 3. Las tareas estan mezcladas (publico + admin).

Base URL esperada por el frontend:

```txt
/api
```

---

## Tareas de Base de Datos y Backend Asociadas

Objetivo de esta fase: sincronizar primero la DB y la API Java, y dejar documentado el renombre del frontend a claves en espanol.

**Tabla `curso`**
- **Campos existentes a mapear:** `id_curso`, `nombre_curso`, `curso_academico`, `id_admin`.
- **Campos NUEVOS que se deben anadir en BD y en la entidad JPA `Curso`:**
  - `nivel` (`VARCHAR(50) NOT NULL`): Nivel formativo del curso.
  - `icono` (`VARCHAR(50) NOT NULL`): Clave del icono que usa el frontend.
  - `descripcion_especialidad` (`TEXT NOT NULL`): Texto corto para la home publica.
  - `descripcion_taller` (`TEXT NOT NULL`): Texto para la cabecera de la pagina de talleres/reserva.
- **Campo calculado:** `numero_estudiantes` no debe persistirse en `curso`. Debe calcularse en backend con `COUNT(alumno.id_alumno)` agrupado por `id_curso` y exponerse solo en DTOs de salida.
- **Impacto en scripts SQL:** `db/init/init_db.sql` y `db/init/seed_db.sql` tendran que contemplar los campos nuevos cuando se haga la migracion.

**API Java**
- Ampliar `es.iesdeteis.gestorcitas.model.Curso` con los nuevos atributos.
- Crear o ajustar DTOs para separar salida publica y salida admin, siempre con claves en espanol.
- Actualizar servicios y controladores para exponer contratos alineados con `/cursos/publico`, `/cursos/:id_curso` y `/admin/cursos`.
- `POST /admin/cursos` no debe persistir `numero_estudiantes`; ese valor se calcula despues a partir de `alumno`.

**Renombres frontend -> espanol**
- `id` -> `id_curso`
- `name` -> `nombre`
- `title` -> `titulo`
- `period` -> `curso_academico`
- `studentCount` -> `numero_estudiantes`
- `iconKey` -> `icono`
- `specialtyDescription` -> `descripcion_especialidad`
- `workshopPageDescription` -> `descripcion_taller`

---

## 1. Convenciones generales

### Formato

- `Content-Type: application/json`
- Las respuestas deben venir en JSON.
- Los errores deben devolver un mensaje legible para el frontend.

### Respuesta de error recomendada

```json
{
  "mensaje": "Mensaje descriptivo del error"
}
```

### Estados de cita validos

El frontend y el backend deben trabajar con estos estados exactos en minusculas:

- `pendiente`
- `confirmada`
- `completada`
- `cancelada`

### Identificadores

Para evitar seguir mezclando ingles y espanol, los identificadores comunes de la API quedan asi:

- `id_admin`
- `id_cliente`
- `id_curso`
- `id_taller`
- `id_horario`
- `id_cita`
- `id_alumno`

---

## 2.1 Obtener especialidades para Home

### Endpoint

```http
GET /cursos/publico
```

### Que devuelve

```json
[
  {
    "id_curso": 1,
    "titulo": "Peluqueria",
    "descripcion_especialidad": "Corte, colorimetria y tratamientos capilares.",
    "icono": "scissors"
  },
  {
    "id_curso": 2,
    "titulo": "Cuidado Facial",
    "descripcion_especialidad": "Higiene, hidratacion y maquillaje profesional.",
    "icono": "sparkles"
  }
]
```

### Campos esperados

| Campo | Tipo | Obligatorio | Descripcion |
|---|---|---:|---|
| `id_curso` | `number` | Si | ID real de la especialidad |
| `titulo` | `string` | Si | Texto mostrado en Home (sale de `nombre_curso`) |
| `descripcion_especialidad` | `string` | Si | Texto corto descriptivo |
| `icono` | `string` | Si | Clave de icono usada por frontend |

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
    "id_curso": 1,
    "nombre": "Peluqueria",
    "nivel": "Grado Medio",
    "curso_academico": "2025/2026",
    "numero_estudiantes": 15
  },
  {
    "id_curso": 2,
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

### Que envia el frontend

```json
{
  "nombre": "Peluqueria avanzada",
  "nivel": "Grado Medio",
  "curso_academico": "2025/2026",
  "icono": "scissors",
  "descripcion_especialidad": "Corte, colorimetria y tratamientos capilares.",
  "descripcion_taller": "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles."
}
```

### Respuesta esperada

```json
{
  "id_curso": 1,
  "nombre": "Peluqueria avanzada",
  "nivel": "Grado Medio",
  "curso_academico": "2025/2026",
  "numero_estudiantes": 0,
  "icono": "scissors",
  "descripcion_especialidad": "Corte, colorimetria y tratamientos capilares.",
  "descripcion_taller": "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles."
}
```

### Nota de sincronizacion con la DB

`numero_estudiantes` no se envia como dato persistido porque no existe en la tabla `curso`. Si mas adelante se quiere cargar alumnado inicial, eso ira en una tarea separada sobre la tabla `alumno`.
