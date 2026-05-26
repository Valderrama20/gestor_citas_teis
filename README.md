# Gestor de Citas TEIS

> Aplicación para gestionar citas y talleres educativa (backend Java + frontend React).

## Contenido
- **backend/**: API y lógica del servidor (Spring Boot, Maven). Ver [backend/README.md](backend/README.md).
- **frontend/**: Interfaz cliente (React, Vite). Ver [frontend/README.md](frontend/README.md).
- **db/**: Dockerfile y scripts de inicialización: `init_db.sql`, `seed_db.sql`.

## Tecnologías principales
- Backend: Java 21, Spring Boot 4.x, Maven
- Frontend: React 19, Vite
- Base de datos: MariaDB (cliente en dependencias)
- Contenedores: Docker / Docker Compose

## Requisitos
- Java 21 (JDK)
- Maven (opcional si usa `./mvnw`)
- Node.js (LTS recomendado) + npm
- Docker y Docker Compose (opcional)

## Quickstart (desarrollo)

1. Backend

```bash
cd backend
# Linux / macOS
./mvnw spring-boot:run
# Windows (PowerShell)
./mvnw.cmd spring-boot:run
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

3. Ejecutar con Docker Compose

```bash
docker compose up --build
# o, si usa la versión legacy
docker-compose up --build
```

## Base de datos
Los scripts de inicialización y seed están en `db/init/`. Si usa Docker, la imagen/stack ya debería ejecutar esos scripts al iniciarse.

## Estructura rápida

- `backend/` — servidor Spring Boot (maven wrapper incluido)
- `frontend/` — aplicación cliente (Vite + React)
- `db/` — Dockerfile y scripts SQL para crear/sembrar la base de datos

## Tests y lint
- Frontend: `npm run lint` (desde `frontend/`).
- Backend: usar las configuraciones de Maven para ejecutar tests (`./mvnw test`).

## Contribuir
Abrir issues o pull requests; seguir las guías en los README específicos de frontend y backend.

## Enlaces relevantes
- README backend: [backend/README.md](backend/README.md)
- README frontend: [frontend/README.md](frontend/README.md)

## Contacto
Para dudas o coordinación, crear un issue en este repositorio o contactar al equipo de desarrollo.

---
_README generado/actualizado el 25-05-2026._
