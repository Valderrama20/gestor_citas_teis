import { Link, useLocation } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import styles from "./Navbar.module.css";
import MobileMenu from "../../components/MobileMenu";

export default function Navbar() {
  const location = useLocation();
  const isReservar = location.pathname === "/reservar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Sobre nosotros", path: "/sobre-nosotros" },
    { label: "Contacto", path: "#contact" },
  ];

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link to="/" className={styles.logoGroup}>
          {/* <div className={styles.logoIconBox}>
            <Sparkles className={styles.logoIcon} strokeWidth={1.8} />
          </div> */}
          <span className={styles.logoText}>
            IES TEIS | <span className={styles.logoHighlight}>Imagen Personal</span>
          </span>
        </Link>

        {/* Menú Desktop */}
        <div className={styles.menuDesktop}>
          {navItems.map((item) => (
            item.path.startsWith("#") ? (
              <a
                key={item.path}
                href={item.path}
                className={styles.navLink}
                onClick={(e) => {
                  if (item.path === "#contact") {
                    e.preventDefault();
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth"
                    });
                  }
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link 
                key={item.path} 
                to={item.path} 
                className={styles.navLink}
                onClick={() => window.scrollTo(0, 0)}
              >
                {item.label}
              </Link>
            )
          ))}
          <div className={styles.divider} />
          <Link to="/reservar" className={styles.btnReservePrimary} onClick={() => window.scrollTo(0, 0)}>
            Reservar
          </Link>
        </div>

        {/* Acciones Móvil/Desktop */}
        <div className={styles.menuContainer}>
          {/* Botón Reservar Desktop */}
          <Link
            to={isReservar ? "/" : "/reservar"}
            className={styles.btnReserveSecondary}
            onClick={() => window.scrollTo(0, 0)}
          >
            {isReservar ? "Volver" : "Reservar"}
          </Link>

          {/* Menú Hamburguesa Móvil */}
          <button
            type="button"
            className={styles.btnHamburger}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className={styles.menuIcon} strokeWidth={1.8} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={navItems}
      />
    </>
  );
}
