# 🔧 Guía de Mantenimiento y Extensión - Cabeceras

## Estructura de Componentes

### Jerarquía

```
App
├── MainLayout (rutas públicas "/")
│   ├── Navbar (✅ MEJORADA)
│   │   └── MobileMenu (✅ NUEVO)
│   └── Outlet (Home, Booking, Talleres)
├── AdminLogin (ruta "/admin/login")
└── ProtectedRoute (rutas "/admin/*")
    ├── AdminNavbar (✅ NUEVO)
    └── Outlet (AdminCourses, AdminDashboard)
```

---

## 📝 Guía Rápida de Modificaciones

### 1. Agregar un nuevo item de navegación público

**Archivo:** `src/layouts/Navbar/Navbar.jsx`

```jsx
// Dentro del array navItems
const navItems = [
  { label: "Sobre nosotros", path: "#about" },
  { label: "Contacto", path: "#contact" },
  // ➕ Agregar aquí:
  { label: "Nuevo Item", path: "#new-section" },
];

// Se renderizará automáticamente en desktop y móvil
```

**Más nada que cambiar** - El componente renderiza dinámicamente.

---

### 2. Cambiar colores de la navbar

**Archivo:** `src/styles/variables.css`

```css
:root {
  /* Cambiar estos valores */
  --color-accent: #c48b8b; /* Color primario */
  --color-accent-soft: #de9f95; /* Degradado */
  --color-accent-strong: #b37373; /* Hover */
  --color-accent-wash: #fff3f1; /* Fondo hover */
  --color-accent-border: #f4d6d6; /* Bordes */
}
```

Todos los componentes automáticamente usarán los nuevos colores (gradientes, borders, etc).

---

### 3. Ajustar tamaño o padding de navbar

**Archivo:** `src/styles/variables.css`

```css
:root {
  /* Espaciado */
  --layout-nav-mobile: 1.5rem 1rem; /* Cambiar valores */
  --layout-nav-desktop: 1.5rem 3rem; /* Cambiar valores */
}
```

O en los archivos CSS específicos:

**Para Navbar Pública:**
`src/layouts/Navbar/Navbar.module.css`

```css
.nav {
  padding: var(--layout-nav-mobile); /* Editar valores directos */
}
```

**Para AdminNavbar:**
`src/components/AdminNavbar/AdminNavbar.module.css`

```css
.nav {
  padding: var(--layout-nav-mobile); /* Editar valores directos */
}
```

---

### 4. Cambiar animaciones

**Para MobileMenu (drawer):**
`src/components/MobileMenu/MobileMenu.module.css`

```css
@keyframes slideInLeft {
  from {
    transform: translateX(-100%); /* Cambiar si viene de otro lado */
  }
  to {
    transform: translateX(0);
  }
}

/* Cambiar duración */
.drawer {
  animation: slideInLeft 0.5s ease; /* Cambiar 0.5s a otro tiempo */
}
```

**Para Dropdown:**
`src/components/AdminNavbar/AdminNavbar.module.css`

```css
@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-8px); /* Cambiar dirección/distancia */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cambiar duración */
.dropdown {
  animation: slideDownFade 0.5s ease; /* Cambiar tiempo */
}
```

---

### 5. Agregar un nuevo elemento al dropdown del usuario (Admin)

**Archivo:** `src/components/AdminNavbar/AdminNavbar.jsx`

Busca la sección dentro del dropdown:

```jsx
{
  /* Dropdown Menu */
}
{
  isUserMenuOpen && (
    <>
      {/* ... user info section ... */}

      <div className={styles.divider} />

      {/* Agregar aquí nuevos items */}
      <Link
        to="/admin/perfil"
        className={styles.menuItem}
        onClick={() => setIsUserMenuOpen(false)}
      >
        <User className={styles.menuIcon} strokeWidth={1.8} />
        <span>Editar perfil</span>
      </Link>

      {/* ➕ Nuevo item ejemplo */}
      <Link
        to="/admin/settings"
        className={styles.menuItem}
        onClick={() => setIsUserMenuOpen(false)}
      >
        <Settings className={styles.menuIcon} strokeWidth={1.8} />
        <span>Configuración</span>
      </Link>

      {/* Logout siempre al final */}
      <button className={styles.logoutItem} onClick={handleLogout}>
        <LogOut className={styles.menuIcon} strokeWidth={1.8} />
        <span>Salir</span>
      </button>
    </>
  );
}
```

---

### 6. Cambiar ruta de "Editar perfil"

**Archivo:** `src/components/AdminNavbar/AdminNavbar.jsx`

```jsx
<Link
  to="/admin/perfil"              {/* ← Cambiar esta ruta */
  className={styles.menuItem}
  onClick={() => setIsUserMenuOpen(false)}
>
  <User className={styles.menuIcon} strokeWidth={1.8} />
  <span>Editar perfil</span>
</Link>
```

---

### 7. Cambiar nombre de usuario mostrado

**Archivo:** `src/components/AdminNavbar/AdminNavbar.jsx`

```jsx
// Actualmente obtiene del store:
const userName = usuario?.nombre || usuario?.email || "Usuario";

// Puedes cambiar la lógica así:
const userName =
  usuario?.nombre || usuario?.apellido || usuario?.email || "Usuario";
```

O en la sección del dropdown:

```jsx
<div className={styles.userInfo}>
  <div className={styles.userAvatar}>
    <User className={styles.avatarIcon} strokeWidth={1.8} />
  </div>
  <div>
    <p className={styles.userFullName}>
      {usuario?.nombre} {usuario?.apellido} {/* ← Cambiar aquí */}
    </p>
    <p className={styles.userEmail}>
      {usuario?.email || "profesor@ies-teis.es"}
    </p>
  </div>
</div>
```

---

### 8. Agregar un icono diferente al logo

**Archivo:** `src/layouts/Navbar/Navbar.jsx` o `src/components/AdminNavbar/AdminNavbar.jsx`

```jsx
import { Heart, Star, Zap, Users } from "lucide-react"; // ← Agregar nuevo icono

{
  /* ... */
}
<div className={styles.logoIconBox}>
  <Heart className={styles.logoIcon} strokeWidth={1.8} />{" "}
  {/* ← Cambiar icono */}
</div>;
```

Todos los iconos disponibles: https://lucide.dev/

---

### 9. Cambiar el comportamiento del logout

**Archivo:** `src/components/AdminNavbar/AdminNavbar.jsx`

```jsx
function handleLogout() {
  logout(); // Limpia el store
  navigate("/admin/login"); // Redirige aquí
  // ➕ Agregar más lógica si necesitas:
  // - Toast de despedida
  // - Clear de estado local
  // - Analytics
}
```

---

### 10. Hacer el MobileMenu más ancho

**Archivo:** `src/components/MobileMenu/MobileMenu.module.css`

```css
.drawer {
  width: 90%; /* Cambiar de 80% a 90% */
  max-width: 320px; /* Cambiar max-width */
  /* ... resto del código ... */
}
```

---

## 🎨 Ajustes Comunes

### Cambiar sombra de la navbar

```css
/* Archivo: Navbar.module.css o AdminNavbar.module.css */
.nav {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Nueva sombra */
}
```

### Hacer el logo más pequeño

```css
/* Archivo: Navbar.module.css */
.logoIconBox {
  width: 2.5rem; /* De 3rem a 2.5rem */
  height: 2.5rem;
}

.logoText {
  font-size: 1rem; /* De 1.2rem a 1rem */
}
```

### Aumentar padding del drawer

```css
/* Archivo: MobileMenu.module.css */
.drawer {
  padding: 2rem 1.5rem; /* De 1.5rem 1rem a 2rem 1.5rem */
}
```

### Cambiar color del overlay

```css
/* Archivo: MobileMenu.module.css */
.overlay {
  background: rgba(0, 0, 0, 0.4); /* De 0.6 opacity a 0.4 */
}
```

---

## 🧪 Testing Local

### 1. Verificar responsive

```bash
# Abre DevTools y prueba:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1024px+
```

### 2. Probar animaciones

```
- MobileMenu: Click hamburguesa, verifica slide suave
- Dropdown: Click user button, verifica fade + slide
- Logo: Hover logo, verifica scale y shadow
```

### 3. Probar logout

```
- Click en "Salir" → Debería ir a /admin/login
- Verificar que se limpie el token/usuario del store
```

### 4. Keyboard navigation

```
- Tab → Todos los botones/links deben focusarse
- Enter → Activar botones
- Escape → Cerrar dropdown/drawer (opcional, aún no implementado)
```

---

## 📚 Archivos Críticos

| Archivo                  | Responsabilidad                     |
| ------------------------ | ----------------------------------- |
| `Navbar.jsx`             | Lógica navbar pública               |
| `Navbar.module.css`      | Estilos navbar pública              |
| `AdminNavbar.jsx`        | Lógica navbar admin + dropdown      |
| `AdminNavbar.module.css` | Estilos navbar admin                |
| `MobileMenu.jsx`         | Lógica drawer responsivo            |
| `MobileMenu.module.css`  | Estilos drawer                      |
| `variables.css`          | Colores, espacios, sombras globales |
| `ProtectedRoute.jsx`     | Envuelve admin con AdminNavbar      |

---

## ⚠️ Cosas a NO Cambiar

❌ No modificar estructura de rutas (App.jsx)
❌ No cambiar lógica de autenticación (useAuthStore)
❌ No alterar APIs/servicios
❌ No tocar componentes de páginas (AdminCourses, AdminDashboard)
✅ Solo cambiar CSS y props visuales

---

## 🚀 Tips de Performance

1. **Evita re-renders innecesarios:** Los useState están bien posicionados
2. **CSS Modules:** Mantienen estilos aislados, no afectan otras páginas
3. **Animaciones:** Usan transform/opacity (GPU accelerated)
4. **Lazy loading:** Los componentes se cargan solo cuando se usan

---

## 🆘 Troubleshooting

### Problema: Contenido oculto bajo navbar

**Solución:** Verifica padding-top en las páginas admin (60px)

### Problema: Dropdown se cierra al hacer click dentro

**Solución:** El overlay está configurado para cerrar el dropdown, es intencional

### Problema: Animaciones lentas

**Solución:** Reduce los tiempos de transición en variables.css:

```css
--transition-fast: 0.15s ease; /* De 0.3s a 0.15s */
--transition-base: 0.2s ease; /* De 0.35s a 0.2s */
```

### Problema: Logo se ve pixelado en móvil

**Solución:** Los iconos de lucide son SVG vectoriales, revisa dpi/zoom del navegador
