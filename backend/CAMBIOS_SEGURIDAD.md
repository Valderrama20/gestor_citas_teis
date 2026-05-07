# Refactorización de Seguridad y Modelos - Fase 1 y 2

Este documento resume todos los cambios aplicados en la arquitectura del backend para la transición a un modelo RBAC centralizado y la implementación de Spring Security 6 con JWT.

## 1. Cambios en la Capa de Dominio (Base de Datos / Modelos)

Se ha abandonado el modelo de identidades fragmentadas donde existía la tabla `Cliente` y `Administrador`.
Todo el sistema se basa ahora en un acceso unificado:

* **`Usuario`**: Entidad central (id, nombre, email, password, activo). Es el eje para la autenticación y posee las credenciales corporativas o del cliente.
* **`PerfilCliente`**: Extensión 1-a-1 de `Usuario` (id, telefono, notasAlergias). Almacena los detalles exclusivos de un alumno/cliente si así lo requiere.
* **`Rol`**: Entidad para el control de acceso (id, nombreRol). Relación M:N con `Usuario`.

> **Nota importante:** Todas las entidades previas (`Cita`, `Curso`) que apuntaban a Administrador o Cliente han sido actualizadas para apuntar a `Usuario`, mapeando las columnas `id_cliente` o `id_gestor`.

## 2. Implementación de Spring Security 6 y JWT

Se ha introducido y configurado un ecosistema completo para administrar sesiones Stateless (sin estado) garantizadas por Tokens (JSON Web Tokens).

### Componentes Clave:
* **`SecurityConfig`**: Define las reglas de DSL mediante lambdas. Prohíbe ataques CSRF (innecesario en API REST stateless), configura la encriptación vía `BCryptPasswordEncoder` y enruta las políticas de acceso HTTP.
* **`JwtUtil`**: Se encarga de generar los JWT de seguridad firmados por el algoritmo `HMAC-SHA256` utilizando la librería moderna JJWT. Incluye validación, expiración (10h) y abstracción de Claims.
* **`JwtRequestFilter`**: Interceptor que evalúa cada llamada que entra a los controladores. Captura la cabecera `Authorization: Bearer <token>`, valida la firma, y si es auténtico, carga el contexto del `SecurityContextHolder`.
* **`CustomUserDetailsService` & `CustomUserDetails`**: Adaptadores creados para que Spring Security comprenda nuestro modelo `Usuario` y lo mapee correctamente a una colección de directivas de autoridad (`GrantedAuthority`).

## 3. Nuevas Rutas Disponibles y Políticas de Acceso

La barrera de seguridad de los Endpoints ha sido activada y las reglas de protección son estrictas:

### Endpoints Públicos (No requieren Token)
* `POST /auth/login`: 
  * Requerido: DTO JSON con `"email"` y `"password"`. 
  * Respuesta: Genera y retorna un Token JWT si las credenciales coinciden con el Hash de BCrypt de la DB.
* `POST /auth/registro`: Habilitado a nivel de seguridad para soportar futuros registros abiertos de los clientes.

### Endpoints Protegidos (Requieren Token `Authorization: Bearer <token>`)
Cualquier llamada que no esté listada como pública anteriorizará un Error de Autenticación (`401 Unauthorized` o `403 Forbidden`).

**Permisos Basados en Roles:**
1. Ruteo Global (`/citas`, `/cursos`, `/usuarios`): Exige un Token JWT válido.
2. Rutas directas de Administrador (`/administradores/**`): Exige que el JWT incluya credencial de **ADMIN** (Internamente `ROLE_ADMIN`).
3. Modificación de Talleres (`/talleres/**` con verbos `POST`, `PUT`, `DELETE`): Exige que el JWT incluya el rol de **ADMIN** o **PROFESOR**.

---

## 4. Instrucciones de Postman (Flujo de Pruebas Peticiones)

Para interactuar con la nueva API desde Postman o Frontend:
1. Ejecuta una llamada tipo `POST` a `http://localhost:8080/auth/login`.
   En el cuerpo (`raw` -> `JSON`) envía:
   ```json
   {
     "email": "tu_usuario@ejemplo.com",
     "password": "tu_password_en_BD"
   }
   ```
2. La API responderá con `200 OK` y entregará el token junto a la información indispensable del usuario (para facilitar su uso en Front sin descifrar el token), encapsulada en el objeto `usuario`:
   ```json
   {
       "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI...",
       "usuario": {
           "id": 1,
           "nombre": "Juan",
           "email": "juan@ejemplo.com",
           "roles": ["ROLE_ADMIN"]
       }
   }
   ```
3. Para cualquier otra petición (por ejemplo, buscar todas las citas `GET /citas`), se debe incluir el Token en los **Headers** de la petición:
   * **Key**: `Authorization`
   * **Value**: `Bearer <tu_token_aqui>` (¡Fíjate en el espacio en blanco después de la palabra Bearer!)
