import { Compass, Home, ScissorsLineDashed } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <section className={styles.card}>
        <div className={styles.badge}>
          <Compass className={styles.badgeIcon} strokeWidth={1.8} />
          Error 404
        </div>

        <p className={styles.code}>404</p>

        <h1 className={styles.title}>
          Esta pagina se ha <span className={styles.titleHighlight}>perdido</span>
        </h1>

        <p className={styles.description}>
          La ruta que intentabas abrir no existe o ya no esta disponible. Puedes
          volver al inicio, explorar especialidades o retomar una reserva.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryAction}>
            <Home className={styles.actionIcon} strokeWidth={1.8} />
            Volver al inicio
          </Link>
          <Link to="/reservar" className={styles.secondaryAction}>
            <ScissorsLineDashed className={styles.actionIcon} strokeWidth={1.8} />
            Ir a reservar
          </Link>
        </div>

        <p className={styles.helpText}>
          Si llegaste aqui desde un enlace antiguo, revisamos la ruta contigo.
        </p>
      </section>
    </main>
  );
}
