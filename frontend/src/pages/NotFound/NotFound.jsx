import { Compass, Home, ScissorsLineDashed } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const { t } = useTranslation('notFound');

  return (
    <main className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <section className={styles.card}>
        <div className={styles.badge}>
          <Compass className={styles.badgeIcon} strokeWidth={1.8} />
          {t('badge')}
        </div>

        <p className={styles.code}>404</p>

        <h1 className={styles.title}>
          {t('title')} <span className={styles.titleHighlight}>{t('titleHighlight')}</span>
        </h1>

        <p className={styles.description}>
          {t('description')}
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryAction}>
            <Home className={styles.actionIcon} strokeWidth={1.8} />
            {t('backHome')}
          </Link>
          <Link to="/reservar" className={styles.secondaryAction}>
            <ScissorsLineDashed className={styles.actionIcon} strokeWidth={1.8} />
            {t('book')}
          </Link>
        </div>

        <p className={styles.helpText}>
          {t('helpText')}
        </p>
      </section>
    </main>
  );
}
