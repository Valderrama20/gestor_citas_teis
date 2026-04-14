import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.css'; // Importación del módulo

export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>PELUQUERÍA PRO</div>
        <nav className={styles.nav}>
          <Link to="/">Inicio</Link>
          <Link to="/reservar">Reservar</Link>
        </nav>
      </header>
      
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}