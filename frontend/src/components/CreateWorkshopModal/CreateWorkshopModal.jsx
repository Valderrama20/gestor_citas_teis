import { useEffect, useState } from "react";
import Modal from "../Modal";
import styles from "./CreateWorkshopModal.module.css";

const INITIAL_FORM = {
  nombreTaller: "",
  descripcion: "",
  icono: "sparkles",
  duracionMinutos: 60,
  capacidadMaxima: 10,
};

export default function CreateWorkshopModal({
  isOpen,
  onClose,
  onSubmit,
  courseName,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        duracionMinutos: Number(formData.duracionMinutos),
        capacidadMaxima: Number(formData.capacidadMaxima),
        tipoTaller: courseName, 
      };
      
      await onSubmit(dataToSend);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Panel administrativo"
      title="Crear nuevo taller"
      showAction={false}
      modalClassName={styles.modal}
      contentClassName={styles.content}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="course">Curso asociado</label>
          <input
            id="course"
            className={`${styles.input} ${styles.readonlyInput}`}
            type="text"
            value={courseName}
            readOnly
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="nombreTaller">Nombre del taller</label>
          <input
            id="nombreTaller"
            name="nombreTaller"
            type="text"
            className={styles.input}
            value={formData.nombreTaller}
            onChange={handleChange}
            placeholder="Ej. Ritual detox facial"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="icono">Icono</label>
          <select
            id="icono"
            name="icono"
            className={styles.input}
            value={formData.icono}
            onChange={handleChange}
          >
            <option value="sparkles">Sparkles</option>
            <option value="scissors">Scissors</option>
            <option value="droplets">Droplets</option>
            <option value="waves">Waves</option>
            <option value="brush">Brush</option>
            <option value="flower">Flower</option>
            <option value="hand">Hand</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label} htmlFor="duracionMinutos">Duración (min)</label>
            <input
              id="duracionMinutos"
              name="duracionMinutos"
              type="number"
              className={styles.input}
              value={formData.duracionMinutos}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label} htmlFor="capacidadMaxima">Capacidad máx.</label>
            <input
              id="capacidadMaxima"
              name="capacidadMaxima"
              type="number"
              className={styles.input}
              value={formData.capacidadMaxima}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className={styles.textarea}
            rows="4"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear taller"}
          </button>
        </div>
      </form>
    </Modal>
  );
}