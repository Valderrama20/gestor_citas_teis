import Modal from "../Modal";
import styles from "./WorkshopDetailsModal.module.css"; 

export default function WorkshopDetailsModal({ isOpen, onClose, workshop }) {
  if (!workshop) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      eyebrow="INFORMACIÓN" 
      title={workshop.nombre_taller || workshop.nombreTaller || workshop.title} 
      showAction={false}
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Estado actual</label>
            <input className={styles.readonlyInput} value="Activo" readOnly />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Aforo máximo</label>
            <input className={styles.readonlyInput} value={`${workshop.capacidad || 15} clientes`} readOnly />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Turnos asignados</label>
          <textarea 
            className={styles.readonlyInput} 
            value={workshop.turnos || "No hay turnos registrados en la base de datos para este taller."} 
            readOnly 
            rows="3"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={onClose}>
            Cerrar ventana
          </button>
        </div>
      </div>
    </Modal>
  );
}