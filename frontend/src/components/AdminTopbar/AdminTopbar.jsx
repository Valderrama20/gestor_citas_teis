import styles from "./AdminTopbar.module.css";

export default function AdminTopbar({ startContent, endContent }) {
  return (
    <nav className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.start}>{startContent}</div>
        <div className={styles.end}>{endContent}</div>
      </div>
    </nav>
  );
}
