import { useEffect, useState } from "react";
import Modal from "../Modal";
import styles from "./CreateWorkshopModal.module.css";

const INITIAL_FORM = {
  title: "",
  description: "",
  iconKey: "sparkles",
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
      await onSubmit(formData);
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
          <label className={styles.label} htmlFor="course">
            Curso asociado
          </label>
          <input
            id="course"
            className={`${styles.input} ${styles.readonlyInput}`}
            type="text"
            value={courseName}
            readOnly
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            Nombre del taller
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={styles.input}
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej. Ritual detox facial"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="iconKey">
            Icono
          </label>
          <select
            id="iconKey"
            name="iconKey"
            className={styles.input}
            value={formData.iconKey}
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Descripcion
          </label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe brevemente el objetivo o servicio del taller."
            required
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear taller"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
