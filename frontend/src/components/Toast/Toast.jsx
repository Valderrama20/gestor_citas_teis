import { CheckCircle, XCircle, Info } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Toast.module.css";

// 1. Definimos las propiedades (props) que recibe nuestro Toast
export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const { t } = useTranslation('common');

  // 2. Este 'efecto' se ejecuta cuando el Toast aparece
  useEffect(() => {
    // Configuramos un temporizador para cerrarlo automáticamente
    const timer = setTimeout(() => {
      onClose(); // Llama a la función de cierre después de 'duration' ms
    }, duration);

    // Limpieza: si el componente desaparece antes de tiempo, limpiamos el temporizador
    return () => clearTimeout(timer);
  }, [onClose, duration]); // Se vuelve a ejecutar si cambian onClose o duration

  // 3. Elegimos el icono según el tipo
  const Icon =
    type === "success" ? CheckCircle :
      type === "error" ? XCircle : Info;

  // 4. Renderizamos el HTML
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <Icon className={styles.icon} strokeWidth={2} />
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose} aria-label={t("actions.close")}>
        &times;
      </button>
    </div>
  );
}