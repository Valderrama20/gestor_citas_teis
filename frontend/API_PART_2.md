# Requerimientos API Frontend - Parte 2 (Talleres y Horarios)

Este archivo es parte 2 de 3. Las tareas estan mezcladas (publico + admin).

---

## Tareas de Base de Datos y Backend Asociadas

**Tabla `taller`**
- **Campos existentes a mapear:** `id_taller`, `nombre_taller`, `duracion_minutos`, `tipo_taller`, `capacidad_maxima`, `id_curso`.
- **Campos NUEVOS que se deben anadir en BD y en la entidad JPA `Taller`:**
  - `descripcion` (`TEXT NOT NULL`): Descripcion corta visible en tarjetas y listados.
  - `icono` (`VARCHAR(50) NOT NULL`): Clave de icono especifica del taller.
- **Campos existentes que deben seguir presentes en admin:** `duracion_minutos`, `tipo_taller` y `capacidad_maxima` ya existen en la DB y no se pueden perder en el contrato admin.

**Tabla `horario_taller`**
- No necesita campos nuevos obligatorios en esta fase.
- El backend debe generar los huecos concretos a partir de `dia_semana`, `hora_apertura`, `hora_cierre` y `taller.duracion_minutos`.
- Como `id_horario` identifica la configuracion base y no un slug tipo `slot-1`, la creacion de citas debe enviar tambien `fecha` y `hora` para fijar el hueco exacto seleccionado.

**API Java**
- Ampliar `es.iesdeteis.gestorcitas.model.Taller` con `descripcion` e `icono`.
- Ajustar DTOs y controladores para devolver claves en espanol (`id_curso`, `id_taller`, `titulo`, `descripcion`, `icono`, `duracion_minutos`, `tipo_taller`, `capacidad_maxima`).
- Crear DTOs especificos para horarios disponibles con `id_horario`, `fecha`, `hora`, `etiqueta` y `disponible`.

**Renombres frontend -> espanol**
- `courseId` -> `id_curso`
- `workshopId` -> `id_taller`
- `title` -> `titulo`
- `description` -> `descripcion`
- `iconKey` -> `icono`
- `slotId` -> `id_horario`
- `date` -> `fecha`
- `time` -> `hora`
- `label` -> `etiqueta`
- `available` -> `disponible`

---

## 2.2 Obtener detalle de una especialidad

### Endpoint

```http
GET /cursos/:id_curso
```

### Ejemplo de respuesta

```json
{
  "id_curso": 1,
  "nombre": "Peluqueria",
  "nivel": "Grado Medio",
  "curso_academico": "2025/2026",
  "numero_estudiantes": 15,
  "icono": "scissors",
  "descripcion_especialidad": "Corte, colorimetria y tratamientos capilares.",
  "descripcion_taller": "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles."
}
```

---

## 2.3 Obtener talleres por especialidad

### Endpoint

```http
GET /cursos/:id_curso/talleres
```

### Ejemplo de respuesta

```json
[
  {
    "id_taller": 1,
    "id_curso": 1,
    "titulo": "Corte y peinado",
    "descripcion": "Cortes clasicos, brushing y acabados para el dia a dia.",
    "icono": "scissors"
  },
  {
    "id_taller": 2,
    "id_curso": 1,
    "titulo": "Coloracion",
    "descripcion": "Tintes, matices y retoque de raiz con asesoria previa.",
    "icono": "sparkles"
  }
]
```

### Valores admitidos actualmente en `icono`

- `scissors`
- `sparkles`
- `droplets`
- `waves`
- `brush`
- `flower`
- `hand`

---

## 2.4 Obtener todos los talleres para el select de reserva

### Endpoint

```http
GET /talleres
```

### Ejemplo de respuesta

```json
[
  {
    "id_taller": 1,
    "id_curso": 1,
    "titulo": "Corte y peinado",
    "descripcion": "Cortes clasicos, brushing y acabados para el dia a dia.",
    "icono": "scissors"
  }
]
```

---

## 2.5 Obtener horarios disponibles de un taller

Los horarios disponibles se calculan a partir de `horario_taller` y de la ocupacion actual de `citas`.

### Endpoint

```http
GET /talleres/:id_taller/horarios
```

### Ejemplo de respuesta recomendada

```json
[
  {
    "id_horario": 7,
    "id_taller": 1,
    "fecha": "2026-04-22",
    "hora": "10:00",
    "etiqueta": "Miercoles 22 de abril - 10:00",
    "disponible": true
  }
]
```

### Nota de sincronizacion con la DB

La tabla `horario_taller` guarda la configuracion del horario, no un slug de hueco. Por eso, cuando el frontend cree una cita, debera enviar `id_horario`, `fecha` y `hora`.

---

## 3.6 Crear taller en un curso

### Endpoint

```http
POST /admin/cursos/:id_curso/talleres
```

### Que envia el frontend

```json
{
  "titulo": "Ritual detox facial",
  "descripcion": "Tratamiento express con limpieza y mascarilla.",
  "icono": "sparkles",
  "duracion_minutos": 45,
  "tipo_taller": "Facial",
  "capacidad_maxima": 6
}
```

### Respuesta esperada

```json
{
  "id_taller": 5,
  "id_curso": 1,
  "titulo": "Ritual detox facial",
  "descripcion": "Tratamiento express con limpieza y mascarilla.",
  "icono": "sparkles",
  "duracion_minutos": 45,
  "tipo_taller": "Facial",
  "capacidad_maxima": 6
}
```
