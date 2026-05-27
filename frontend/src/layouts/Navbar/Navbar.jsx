import { Link, useLocation } from "react-router-dom";
import { Menu, Sparkles, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import MobileMenu from "../../components/MobileMenu";

export default function Navbar() {
  const location = useLocation();
  const isReservar = location.pathname === "/reservar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation('common');

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.about"), path: "/sobre-nosotros" },
    { label: t("nav.contact"), path: "#contact" },
  ];

  const languageNames = {
    es: "Español",
    gl: "Galego",
    en: "English"
  };

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link to="/" className={styles.logoGroup} onClick={() => window.scrollTo(0, 0)}>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>IES TEIS</span>
            <span className={styles.logoSeparator}> | </span>
            <span className={styles.logoHighlight}>Imagen Personal</span>
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

          {/* Selector de idioma Desktop */}
          <div className={styles.langSelectorWrapper}>
            <Globe className={styles.langIcon} strokeWidth={1.8} />
            <span className={styles.langText}>{languageNames[i18n.language] || "Español"}</span>
            <select
              className={styles.langSelectHidden}
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="gl">Galego</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className={styles.divider} />
          <Link to="/reservar" className={styles.btnReservePrimary} onClick={() => window.scrollTo(0, 0)}>
            {t("nav.reserve")}
          </Link>
        </div>

        {/* Acciones Móvil/Tablet */}
        <div className={styles.menuContainer}>

          {/* Botón Reservar Secundario (Móvil/Tablet) */}
          <Link
            to={isReservar ? "/" : "/reservar"}
            className={styles.btnReserveSecondary}
            onClick={() => window.scrollTo(0, 0)}
          >
            {isReservar ? t("nav.back") : t("nav.reserve")}
          </Link>

          {/* Menú Hamburguesa Móvil/Tablet */}
          <button
            type="button"
            className={styles.btnHamburger}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={t("nav.openMenu")}
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