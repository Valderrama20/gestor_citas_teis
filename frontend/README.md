# 💇‍♀️ Gestor de Citas y Cursos TEIS (Frontend)

¡Hola! Este proyecto es la **parte frontal (Frontend)** de nuestra aplicación diseñada para la gestión de citas, talleres y cursos. Está construida utilizando herramientas modernas de desarrollo web para ofrecer una interfaz rápida, interactiva y fácil de usar tanto para los clientes como para los administradores.

A continuación, explicamos de forma sencilla y directa cómo está organizado el código, las tecnologías que utilizamos y cómo puedes trabajar con él.

---

## 🛠️ Tecnologías Principales

- **React 19**: Biblioteca principal para construir la interfaz de usuario.
- **Vite 8**: Empaquetador y servidor de desarrollo ultrarrápido.
- **Zustand**: Gestor de estado global (utilizado para la sesión y autenticación en `authStore.js`).
- **React Router DOM 7**: Encargado del enrutamiento y la navegación entre páginas.
- **Axios**: Cliente HTTP para realizar peticiones al servidor (Backend).
- **Lucide React**: Biblioteca de iconos modernos.
- **Docker & Nginx**: Configurado para contenerización y despliegue a producción.

---

## 🗺️ Arquitectura y Flujo Principal

La aplicación está dividida en dos grandes secciones:
1. **Área Pública**: Donde los usuarios pueden ver los servicios, explorar talleres y solicitar citas.
2. **Área de Administración**: Un panel protegido (mediante `ProtectedRoute.jsx`) para que los administradores gestionen las citas, cursos y talleres.

**Flujo de la App:**
1. **La Puerta de Entrada (`index.html`)**: Es el primer archivo que carga el navegador de los usuarios.
2. **El Inicializador (`main.jsx`)**: Toma nuestra aplicación de React y la "dibuja" dentro del HTML.
3. **El Enrutador (`App.jsx`)**: Funciona como un mapa; decide a qué pantalla (página) debes ir dependiendo de la URL.
4. **Las Páginas (`pages/`)**: Son las pantallas principales (ej. `Home`, `Booking`, `AdminDashboard`).
5. **Los Servicios (`services/`)**: Centralizan las llamadas a la API (Backend). Se separan por lógica (citas, cursos, estudiantes, etc.).

---

## 📁 Estructura del Proyecto

El proyecto sigue una estructura modular para escalar de forma limpia:

```text
.
├─ public/        👉 Archivos estáticos como el favicon e iconos que se acceden directamente.
├─ src/           👉 Todo el código fuente de la app.
│  ├─ components/ 👉 Componentes reutilizables (Tarjetas, Modales, Tablas, Toasts).
│  ├─ config/     👉 Configuraciones globales (ej. configuración base de Axios en api.js).
│  ├─ context/    👉 Contextos de React (ej. ToastContext para notificaciones).
│  ├─ layouts/    👉 Estructuras de diseño compartidas (Navbar, Footer, MainLayout).
│  ├─ pages/      👉 Pantallas completas (Admin, Home, Booking, Talleres).
│  ├─ services/   👉 Funciones para conectarse con el Backend (auth, appointments, courses...).
│  ├─ store/      👉 Estado global de la aplicación (authStore.js con Zustand).
│  └─ styles/     👉 Archivos CSS y variables globales de diseño (variables.css).
├─ Dockerfile     👉 Instrucciones para empaquetar la app en un contenedor Docker.
├─ nginx.conf     👉 Configuración del servidor Nginx para servir la aplicación en producción.
├─ package.json   👉 Lista de dependencias y comandos del proyecto.
└─ vite.config.js 👉 Configuración del empaquetador Vite.
```

---

## 🚀 Instalación y Ejecución Local

Para poder ejecutar y modificar este proyecto en tu entorno de desarrollo, necesitas tener instalado **Node.js** y **npm**.

Abre tu terminal, ve a la carpeta principal del proyecto y ejecuta:

```bash
# 1. Instala todas las dependencias
npm install

# 2. Inicia el servidor de desarrollo
npm run dev
```

La aplicación estará disponible típicamente en `http://localhost:5173`.

---

## 🏗️ Guía Rápida para Desarrolladores

### 1. Variables de Entorno
Asegúrate de copiar el archivo `.env.example` y renombrarlo a `.env`. Ahí debes definir las variables necesarias, como la URL base del Backend a la que se conectará la aplicación.

### 2. Autenticación y Estado
El estado de sesión del administrador se maneja mediante Zustand en `src/store/authStore.js`. Las rutas de administración están envueltas por el componente `ProtectedRoute.jsx` para garantizar que solo usuarios autenticados puedan acceder a páginas como `/admin/dashboard` o `/admin/courses`.

### 3. Peticiones a la API (Axios)
Todas las llamadas al servidor están modularizadas en `src/services/`. Si necesitas añadir una nueva llamada a la API, debes:
1. Identificar a qué dominio pertenece (ej. si es sobre talleres, usa `workshopService.js`).
2. Utilizar la instancia configurada de Axios desde `src/config/api.js` para asegurar que todas las peticiones lleven la configuración correcta (como interceptores o tokens).

### 4. Estilos y Diseño
El proyecto utiliza módulos CSS (`.module.css`) para los componentes, asegurando que los estilos no colisionen entre sí. Los colores, fuentes y espaciados principales están centralizados en `src/styles/variables.css`. Si necesitas cambiar un color corporativo, hazlo ahí.

---

## 🐳 Despliegue con Docker

El proyecto está preparado para desplegarse fácilmente utilizando Docker y Nginx.

```bash
# Construir la imagen Docker
docker build -t frontend-citas .

# Ejecutar el contenedor
docker run -p 80:80 frontend-citas
```
Esto creará una versión optimizada para producción (`npm run build`) y la servirá mediante Nginx utilizando la configuración definida en `nginx.conf`.