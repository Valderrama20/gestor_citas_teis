import { Link, NavLink } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logoGroup}>
        <div className={styles.logoIconBox}>
          <Sparkles className={styles.logoIcon} strokeWidth={1.8} />
        </div>
        <span className={styles.logoText}>
          IES TEIS <span className={styles.logoHighlight}>Estetica</span>
        </span>
      </Link>

      <div className={styles.menuDesktop}>
        <NavLink
          to="/reservar"
          className={({ isActive }) =>
            isActive ? `${styles.btnReserve} ${styles.active}` : styles.btnReserve
          }
        >
          Reservar
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.btnLink} ${styles.activeLink}` : styles.btnLink
          }
        >
          Especialidades
        </NavLink>
        <div className={styles.divider} />
        <button type="button" className={styles.btnIcon} aria-label="Abrir menu">
          <Menu className={styles.menuIcon} strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
}
