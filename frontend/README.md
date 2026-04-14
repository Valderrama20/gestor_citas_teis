# 💇‍♀️ Gestor de Citas TEIS (Frontend)

¡Hola! Este proyecto es la **parte frontal (Frontend)** de nuestra aplicación para gestionar citas en una peluquería. Aquí usamos React y Vite para construir la interfaz visual con la que interactúan los clientes.

A continuación, explicamos de forma sencilla y directa cómo está organizado el código y cómo trabajar con él.

---

## 🗺️ Arquitectura y Flujo Principal

¿Cómo funciona nuestra aplicación por dentro?
1. **La Puerta de Entrada (`index.html`)**: Es el primer archivo que carga el navegador de los usuarios.
2. **El Inicializador (`main.jsx`)**: Toma nuestra aplicación de React y la "dibuja" dentro del HTML.
3. **El Enrutador (`App.jsx`)**: Funciona como un mapa; decide a qué pantalla (página) debes ir dependiendo de la URL (por ejemplo, si vas a `/reservar`, muestra el componente que se encarga de las reservas).
4. **Las Páginas (`Home.jsx` y `Booking.jsx`)**: Son las pantallas principales de la aplicación.
5. **Los Servicios (`services/`)**: Cuando una página necesita pedir datos de citas o guardar una reserva, usa estos archivos (a través de la herramienta Axios) para comunicarse con el servidor (Backend).

---

## 🛠️ Requisitos del Sistema

Para poder ejecutar y modificar este proyecto, necesitas tener instalado:
- **Node.js** (El entorno necesario para ejecutar herramientas de desarrollo en JavaScript).
- **npm** (El gestor de paquetes para descargar librerías).

---

## 🚀 Instalación y Ejecución

Abre tu terminal, ve a la carpeta principal del proyecto y ejecuta los siguientes comandos:

```bash
npm install   # (Descarga todas las herramientas y librerías necesarias)
npm run dev   # (Inicia el servidor de desarrollo para ver la app en tu navegador)
```

---

## 📁 Estructura del Proyecto

El proyecto está organizado de esta manera para mantener el orden a medida que crece:

```text
.
├─ public/        👉 Archivos estáticos como iconos o imágenes que se acceden directamente.
├─ src/           👉 Carpeta principal donde está todo el código fuente de la app.
│  ├─ assets/     👉 Imágenes, fuentes y archivos multimedia que serán optimizados por Vite.
│  ├─ components/ 👉 Componentes reutilizables (ej. botones, tarjetas, modales de alerta).
│  ├─ config/     👉 Configuraciones globales (ej. conexión base a la API).
│  ├─ layouts/    👉 Estructuras de diseño compartidas (ej. cabecera o pie de página).
│  ├─ pages/      👉 Pantallas completas de la aplicación.
│  ├─ services/   👉 Lógica y funciones para conectarse con el Backend.
│  ├─ styles/     👉 Archivos CSS y variables globales de diseño.
│  └─ utils/      👉 Funciones auxiliares o "helpers" (ej. formateo de fechas).
├─ index.html     👉 Plantilla HTML principal.
├─ package.json   👉 Lista de dependencias (librerías) y comandos del proyecto.
└─ vite.config.js 👉 Configuración de nuestra herramienta de construcción (Vite).
```

---

## 🏗️ ¿Cómo agregar nuevos elementos?

En lugar de programar todo junto, separamos las cosas. Así es como debes crear elementos nuevos:

### 1. ¿Cómo crear un Nuevo Componente?
Si quieres crear un botón reutilizable que usarás en varias partes de la web:
1. Ve a la carpeta `src/components/`.
2. Crea una nueva subcarpeta llamada `Button/`.
3. Dentro, crea el archivo `Button.jsx` con el código del botón en React.
4. (Opcional) Crea un archivo `index.js` en esa misma carpeta con la línea `export { default } from './Button'` (esto hace más limpias las importaciones en otros archivos).
5. (Opcional) Si necesita estilos propios, crea un `Button.module.css` e impórtalo en tu `.jsx`.

### 2. ¿Cómo crear una Nueva Página?
Si el cliente necesita un apartado de "Sobre Nosotros":
1. Ve a `src/pages/` y crea la carpeta `About/`.
2. Crea el archivo `About.jsx` con todo el contenido de la pantalla.
3. Ve a `src/App.jsx` e importa tu nueva página.
4. Añade una nueva ruta en el mapa del router: `{ path: "/nosotros", element: <About /> }`.

### 3. ¿Cómo crear un Nuevo Servicio?
Si necesitas obtener el listado de barberos disponibles desde el servidor:
1. Ve a `src/services/` y crea un archivo llamado `barberService.js`.
2. Importa la configuración de axios (`api.js`) y utilízala para crear funciones como `getBarbers()`.
3. Exporta esas funciones para que cualquier página (como `Home.jsx` o `Booking.jsx`) las pueda usar para nutrirse de información.

---

## 🔍 Detalle de Archivos Clave

- **`package.json`**: Guarda el registro de todas las herramientas externas de las que dependemos (`react`, `react-router-dom`, `axios`, etc.).
- **`vite.config.js`**: Es la instrucción para nuestro empaquetador Vite, indicándole que estamos trabajando con React para que traduzca el código de la manera más rápida posible.
- **`src/styles/variables.css`**: ¡Nuestro centro de control visual! Aquí hay variables como `--primary-gold`. Si un día se decide cambiar el dorado a otro color corporativo, se cambia aquí y afectará a toda la web automáticamente.
- **`src/config/api.js`**: El archivo que configura cómo se conecta Axios al servidor. Define cosas como la dirección base (`http://localhost:3000/api`) y puede "atrapar" errores generales para que no ocurran en silencio.
