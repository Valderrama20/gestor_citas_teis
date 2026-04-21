import { Link } from "react-router-dom";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ title, description, Icon, to, state }) {
  return (
    <Link to={to} state={state} className={styles.card}>
      <div className={styles.iconBox}>
        <Icon className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
