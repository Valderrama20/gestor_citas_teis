# Requerimientos API Frontend - Parte 2 (Talleres y Slots)

Este archivo es parte 2 de 3. Las tareas están mezcladas (público + admin).

---

## Tareas de Base de Datos y Backend Asociadas

**Tabla `taller`**
- **Campos existentes a mapear:** `id_taller`, `nombre_taller` (mapeado a `titulo`), `duracion_minutos`, `tipo_taller`, `capacidad_maxima`, `id_curso`.
- **Campos NUEVOS que se deben añadir a la BD:**
  - `descripcion` (TEXT): Descripción corta visible al elegir el taller en las tarjetas de la web pública.
  - `icono` (VARCHAR): Clave de icono específica del taller (ej. "brush", "sparkles").

**API Java:**
- Actualizar el modelo JPA `Taller` para mapear `descripcion` e `icono`.
- Actualizar DTOs y controladores relacionados con Talleres e interfaces de Cursos para devolver propiedades en español (`id_curso`, `id_taller`, `titulo`, `descripcion`, `icono`).

---

## 2.2 Obtener detalle de una especialidad

### Endpoint

```http
GET /cursos/:id_curso
```

### Ejemplo de respuesta

```json
{
  "id_curso": "1",
  "nombre": "Peluquería",
  "nivel": "Grado Medio",
  "curso_academico": "2025/2026",
  "numero_estudiantes": 15,
  "icono": "scissors",
  "descripcion_especialidad": "Corte, colorimetría y tratamientos capilares.",
  "descripcion_taller": "Selecciona un taller de ejemplo para ver cómo podríamos organizar los servicios..."
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
    "id_taller": "corte",
    "id_curso": "1",
    "titulo": "Corte y peinado",
    "descripcion": "Cortes clásicos, brushing y acabados para el día a día.",
    "icono": "scissors"
  },
  {
    "id_taller": "color",
    "id_curso": "1",
    "titulo": "Coloración",
    "descripcion": "Tintes, matices y retoque de raíz con asesoría previa.",
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
    "id_taller": "corte",
    "id_curso": "1",
    "titulo": "Corte y peinado",
    "descripcion": "Cortes clásicos, brushing y acabados para el día a día.",
    "icono": "scissors"
  }
]
```

---

## 2.5 Obtener horarios disponibles de un taller

*(Se ha renombrado el concepto de Slot a Horario/Hueco, devolviendo `id_horario` en lugar de `slotId`. Estos datos salen de la tabla `horario_taller` y de la disponibilidad calculada según citas previas).*

### Endpoint

```http
GET /talleres/:id_taller/horarios
```

### Ejemplo de respuesta recomendada

```json
[
  {
    "id_horario": "slot-1",
    "id_taller": "corte",
    "fecha": "2026-04-22",
    "hora": "10:00",
    "etiqueta": "Martes 22 de abril - 10:00",
    "disponible": true
  }
]
```

---

## 3.6 Crear taller en un curso

### Endpoint

```http
POST /admin/cursos/:id_curso/talleres
```

### Qué envía el frontend

```json
{
  "titulo": "Ritual detox facial",
  "descripcion": "Tratamiento express con limpieza y mascarilla.",
  "icono": "sparkles"
}
```

### Respuesta esperada

```json
{
  "id_taller": "ritual-detox-facial",
  "id_curso": "1",
  "titulo": "Ritual detox facial",
  "descripcion": "Tratamiento express con limpieza y mascarilla.",
  "icono": "sparkles"
}
```
