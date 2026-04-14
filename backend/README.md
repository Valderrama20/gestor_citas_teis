# 💇‍♀️ Gestor de Citas TEIS (Backend)

¡Hola! Este proyecto es la **parte servidora (Backend)** de nuestra aplicación para gestionar citas en una peluquería. Aquí usamos Java y el framework Spring Boot para construir la API REST que se encarga de la lógica de negocio y la persistencia de datos.

A continuación, explicamos de forma sencilla y directa cómo está organizado el código y cómo trabajar con él.

---

## 🗺️ Arquitectura y Flujo Principal

¿Cómo funciona nuestra API por dentro?
1. **El Controlador (`controller/`)**: Es la puerta de entrada de las peticiones HTTP (GET, POST, etc.) que llegan desde el Frontend. Recibe los datos y decide qué hacer con ellos.
2. **El Servicio (`service/`)**: Contiene toda la "lógica de negocio". Aquí se aplican las reglas (por ejemplo, comprobar si una hora ya está reservada) antes de guardar o modificar información.
3. **El Repositorio (`repository/`)**: Es la capa encargada de comunicarse directamente con la Base de Datos. Utiliza Spring Data JPA para realizar consultas sin tener que escribir SQL manualmente.
4. **El Modelo (`model/`)**: Define cómo son los datos. Contiene las Entidades (`entity/`) que representan las tablas de la base de datos y los DTOs (`dto/`) que son los objetos que enviamos y recibimos a través de la API.
5. **Manejo de Errores (`exception/`)**: Intercepta los problemas (como cuando se busca una cita que no existe) y devuelve respuestas claras y formateadas al Frontend.

---

## 🛠️ Requisitos del Sistema

Para poder ejecutar y modificar este proyecto, necesitas tener instalado:
- **Java Development Kit (JDK) 17 o superior** (El entorno necesario para compilar y ejecutar código Java).
- **Maven** (El gestor de dependencias y construcción del proyecto, aunque puedes usar el *wrapper* incluido `mvnw`).

---

## 🚀 Instalación y Ejecución

Abre tu terminal, ve a la carpeta principal del proyecto y ejecuta los siguientes comandos:

```bash
./mvnw clean install   # (Descarga las dependencias y compila el proyecto)
./mvnw spring-boot:run # (Inicia el servidor backend en tu equipo, habitualmente en el puerto 8080)
```
*(Si usas Windows, utiliza `mvnw.cmd` en lugar de `./mvnw`)*

---

## 📁 Estructura del Proyecto

El proyecto está organizado siguiendo el estándar de capas para mantener el código limpio y escalable:

```text
.
├─ src/
│  ├─ main/
│  │  ├─ java/es/iesdeteis/gestorcitas/ 👉 Paquete principal del código fuente.
│  │  │  ├─ config/       👉 Configuraciones globales (Beans, CORS, Seguridad).
│  │  │  ├─ controller/   👉 Controladores REST que exponen los *endpoints* de la API.
│  │  │  ├─ exception/    👉 Clases para el manejo personalizado de errores.
│  │  │  ├─ model/        👉 Estructura de datos de la aplicación.
│  │  │  │  ├─ dto/       👉 Objetos de transferencia de datos (lo que entra/sale de la API).
│  │  │  │  └─ entity/    👉 Entidades JPA (lo que se guarda en la Base de Datos).
│  │  │  ├─ repository/   👉 Interfaces JPA para operaciones de base de datos.
│  │  │  ├─ service/      👉 Interfaces e implementaciones con la lógica de la aplicación.
│  │  │  └─ util/         👉 Constantes y funciones de ayuda genéricas.
│  │  │  └─ GestorcitasApplication.java 👉 Clase principal que arranca la aplicación Spring Boot.
│  │  └─ resources/
│  │     └─ application.properties 👉 Configuración del servidor y conexión a base de datos.
│  └─ test/               👉 Pruebas unitarias y de integración.
├─ pom.xml                👉 Archivo de Maven con las dependencias y plugins del proyecto.
└─ mvnw / mvnw.cmd        👉 Scripts para ejecutar Maven sin tenerlo instalado globalmente.
```

---

## 🏗️ ¿Cómo agregar nuevos elementos?

En lugar de programar todo en un solo archivo, separamos las responsabilidades. Así es como debes crear nuevas funcionalidades (ej. Gestión de Clientes):

### 1. ¿Cómo crear un Nuevo Modelo y Repositorio?
1. Ve a `model/entity/` y crea una clase `Cliente.java` anotada con `@Entity`.
2. Define sus atributos (`id`, `nombre`, `telefono`) y genera sus Getters y Setters.
3. Ve a `model/dto/` y crea su equivalente `ClienteDTO.java`.
4. Ve a la carpeta `repository/` y crea una interfaz `ClienteRepository.java` que extienda de `JpaRepository<Cliente, Long>`.

### 2. ¿Cómo crear un Nuevo Servicio?
1. Ve a `service/` y crea la interfaz `ClienteService.java` definiendo los métodos que vas a necesitar (`guardarCliente`, `buscarPorId`, etc.).
2. En la misma carpeta, crea la clase `ClienteServiceImpl.java` que implemente la interfaz anterior.
3. Anótala con `@Service` y añade la inyección de dependencias para usar el `ClienteRepository`.
4. Escribe aquí la lógica para convertir entre `ClienteDTO` y `Cliente`, validaciones, etc.

### 3. ¿Cómo crear un Nuevo Endpoint (Controlador)?
1. Ve a `controller/` y crea la clase `ClienteController.java`.
2. Anótala con `@RestController` y configura la ruta base con `@RequestMapping("/api/v1/clientes")`.
3. Inyecta el `ClienteService`.
4. Crea métodos anotados con `@GetMapping`, `@PostMapping`, etc., que llamen al servicio y devuelvan un `ResponseEntity`.

---

## 🔍 Detalle de Archivos Clave

- **`pom.xml`**: El corazón del proyecto para gestionar librerías. Aquí se añaden dependencias como `spring-boot-starter-web`, `spring-boot-starter-data-jpa` o el driver de la base de datos.
- **`application.properties`**: Archivo crucial de configuración. Aquí se definen cosas como el puerto del servidor (`server.port=8080`), las credenciales de la base de datos y su URL de conexión, y el comportamiento de JPA/Hibernate.
- **`GestorcitasApplication.java`**: El punto de arranque. Al ejecutar el método `main` de esta clase, Spring Boot hace su magia: explora el proyecto, crea los beans necesarios y levanta el servidor web.
- **`Constants.java`**: Archivo de utilidades donde definimos rutas globales o valores fijos que se repiten en el código, facilitando su mantenimiento si cambian en el futuro.
