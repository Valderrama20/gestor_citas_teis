# Local

La primera vez, copia la plantilla local:

- PowerShell: Copy-Item .env.local.example .env

Despues levanta la app sin Caddy, con:

- frontend: http://localhost:5173
- backend: http://localhost:9001
- base de datos: localhost:3306

- docker compose up --build --remove-orphans

# Servidor

La primera vez, copia la plantilla del servidor:

- cp .env.server.example .env

Despues levanta la app con Caddy y los dominios configurados en `Caddyfile`:

- docker compose up --build -d

# Parar contenedores

- Servidor: docker compose down
- Local: docker compose down --remove-orphans
