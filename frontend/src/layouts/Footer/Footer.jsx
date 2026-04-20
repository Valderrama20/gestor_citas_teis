import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.divider} />
      <p className={styles.text}>IES TEIS | Formacion Profesional</p>
    </footer>
  );
}
