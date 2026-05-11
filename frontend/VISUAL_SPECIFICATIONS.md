# 📐 Especificaciones Visuales Detalladas - Cabeceras Rediseñadas

## NAVBAR PÚBLICA - Layout Responsivo

### Desktop (≥768px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✨ IES TEIS Estetica  │  Sobre nosotros  │  Contacto  │  ─────  │ Reservar  │
└─────────────────────────────────────────────────────────────────────────────┘
  Logo (hover: scale 1.05)  NavLinks (hover: bg accent)   CTA destacado
```

**Dimensiones:**

- Alto: ~60px (incluido padding)
- Padding: 1.5rem 3rem
- Box-shadow: var(--shadow-soft-md)

**Logo:**

- Icono: 3rem × 3rem
- Fondo: gradient(135deg, #c48b8b, #de9f95)
- Color icono: #ffffff
- Hover: scale(1.05) + shadow expand

**Nav Items:**

- Padding: 0.7rem 1.2rem
- Border-radius: 1.25rem
- Hover: bg #fff3f1, color #b37373

**Botón Reservar:**

- Padding: 0.85rem 1.8rem
- Gradient: 135deg, #c48b8b → #de9f95
- Color: #ffffff
- Border-radius: 999px
- Hover: translateY(-2px) + shadow(0 12px 28px rgba(196,139,139,0.3))

### Mobile (<768px)

```
┌─────────────────────────────────────────┐
│ ✨ IES TEIS Estetica  │  Reservar │ ☰  │
└─────────────────────────────────────────┘

DRAWER (se abre al click en ☰):
┌─────────────────────────────────────────┐
│ ⤫  Menú                                 │
├─────────────────────────────────────────┤
│ ▶ Sobre nosotros                        │
│ ▶ Contacto                              │
└─────────────────────────────────────────┘
```

**Padding:** 1.5rem 1rem
**Hamburger Size:** 2.5rem × 2.5rem

**Drawer (MobileMenu):**

- Ancho: 80% (máx 280px)
- Height: 100vh
- Posición: fixed, left: 0, top: 0
- Background: #ffffff
- Animation: slideInLeft 0.35s ease
- Overlay: rgba(58,46,50, 0.6) fadeIn

---

## NAVBAR ADMIN - Layout Consistente

### Desktop & Mobile (100% ancho disponible)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✨ IES TEIS Estetica                                 👤 Juan Pérez ⌄        │
│                                                       ✎ Editar perfil        │
│                                                       🚪 Salir               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Dimensiones:**

- Alto: ~60px
- Padding: 1.5rem 1rem (mobile), 1.5rem 3rem (desktop)
- Position: fixed, top: 0, z-index: 50

**User Menu Button:**

- Padding: 0.6rem 1rem
- Border: 1px solid #e7dddd
- Border-radius: 999px
- Background: rgba(255,255,255, 0.92)
- Hover: bg #fff3f1, border #f4d6d6, color #b37373

**Dropdown Menu:**

- Position: absolute, top: 100%, right: 0
- Min-width: 280px
- Border-radius: 1.5rem
- Box-shadow: 0 10px 40px rgba(58,46,50, 0.15)
- Animation: slideDownFade 0.35s ease

**User Info Section (Dropdown):**

- Background: #fff3f1 (accent wash)
- Padding: 0.75rem
- Display: flex + avatar + text

**Avatar:**

- Size: 2.5rem × 2.5rem
- Border-radius: 999px
- Gradient: 135deg accent → accent-soft
- Icon color: #ffffff

**Dropdown Items:**

- Padding: 0.75rem 0.75rem
- Border-radius: 1.25rem
- Hover: bg #fff3f1, color #b37373
- Transition: all 0.3s ease

**Logout Button:**

- Similar a dropdown items pero con hover rojo suave
- Color hover: #b37373

---

## Animaciones Implementadas

### 1. Navbar Logo Hover

```css
Transform: scale(1.05)
Box-shadow: 0 8px 24px rgba(196, 139, 139, 0.25)
Duration: 0.3s ease
```

### 2. Botón Reservar Hover

```css
Transform: translateY(-2px)
Box-shadow: 0 12px 28px rgba(196, 139, 139, 0.3)
Duration: 0.3s ease
```

### 3. MobileMenu Entrada

```css
Overlay: opacity 0 → 1 (0.3s ease)
Drawer: translateX(-100% → 0) (0.35s ease)
```

### 4. Dropdown Expansión

```css
Opacity: 0 → 1 (0.35s ease)
Transform: translateY(-8px → 0)
Chevron: rotate(0 → 180deg)
```

### 5. Chevron Rotación (Dropdown Open)

```css
Transform: rotate(180deg)
Duration: 0.3s ease
```

---

## Paleta de Colores Utilizada

| Elemento          | Color               | Variable CSS          |
| ----------------- | ------------------- | --------------------- |
| Gradient Primario | #c48b8b → #de9f95   | --color-accent        |
| Fondo Acento      | #fff3f1             | --color-accent-wash   |
| Borde Acento      | #f4d6d6             | --color-accent-border |
| Texto Primario    | #3a2e32             | --color-text          |
| Texto Secundario  | #6f6668             | --color-text-muted    |
| Superficie        | #ffffff             | --color-white         |
| Overlay           | rgba(58,46,50, 0.6) | -                     |

---

## Tipografía

| Elemento  | Font        | Size    | Weight | Spacing |
| --------- | ----------- | ------- | ------ | ------- |
| Logo Text | Nunito Sans | 1.2rem  | 800    | -0.04em |
| Nav Items | Nunito      | 0.95rem | 500    | normal  |
| User Name | Nunito      | 0.9rem  | 600    | normal  |

---

## Sombras

```css
--shadow-soft-md: 0 12px 32px rgba(58, 46, 50, 0.08);
--shadow-button: 0 8px 20px rgba(58, 46, 50, 0.05);
--shadow-soft-sm: 0 8px 24px rgba(58, 46, 50, 0.08);

/* Custom */
Dropdown: 0 10px 40px rgba(58, 46, 50, 0.15)
Logo Hover: 0 8px 24px rgba(196, 139, 139, 0.25)
Botón Hover: 0 12px 28px rgba(196, 139, 139, 0.3)
```

---

## Breakpoints

```css
/* Mobile First */
< 768px: Hamburguesa, sin menú desktop, botón reservar móvil
≥ 768px: Menú desktop, botón reservar primario, sin hamburguesa
```

---

## Accesibilidad

✅ **ARIA Labels:**

- `aria-label="Abrir menú"` - Hamburguesa
- `aria-label="Menú de usuario"` - User button

✅ **Contraste:**

- Texto sobre fondos: WCAG AA compliant
- Colores no como único medio de información

✅ **Navegación:**

- Elementos interactivos focusables (keyboard nav)
- Estados visuales claros (hover, focus, active)

---

## Performance

✅ **CSS Modules:** No contaminación global
✅ **GPU Accelerated:** Transform, opacity (no layout thrashing)
✅ **Minimal JS:** Solo useState para toggles
✅ **No Re-renders innecesarios:** Componentes memoizados donde necesario

---

## Testing Checklist

- [ ] Desktop navbar: Todos los items visibles
- [ ] Hamburguesa: Abre/cierra drawer correctamente
- [ ] Drawer: Slide animation suave
- [ ] Mobile navbar: Logo visible, botón user funciona
- [ ] Dropdown: Se abre/cierra al hacer click
- [ ] Logout: Navega a /admin/login correctamente
- [ ] Responsive: 320px, 768px, 1024px, 1440px
- [ ] Keyboard: Tab navega todos los botones
- [ ] No conflictos: AdminNavbar no se superpone con contenido
