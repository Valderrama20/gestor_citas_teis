import { useEffect, useState } from "react";
import Modal from "../Modal";
import styles from "./CreateCourseModal.module.css";

const INITIAL_FORM = {
  name: "",
  level: "Grado Medio",
  period: "2025/2026",
  studentCount: "0",
  iconKey: "sparkles",
  specialtyDescription: "",
  workshopPageDescription: "",
};

export default function CreateCourseModal({ isOpen, onClose, onSubmit }) {
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
      await onSubmit({
        ...formData,
        studentCount: Number(formData.studentCount),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Panel administrativo"
      title="Crear nuevo curso"
      showAction={false}
      modalClassName={styles.modal}
      contentClassName={styles.content}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Nombre del curso
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Peluqueria avanzada"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="level">
              Nivel
            </label>
            <select
              id="level"
              name="level"
              className={styles.input}
              value={formData.level}
              onChange={handleChange}
            >
              <option value="Grado Medio">Grado Medio</option>
              <option value="Grado Superior">Grado Superior</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="period">
              Periodo
            </label>
            <input
              id="period"
              name="period"
              type="text"
              className={styles.input}
              value={formData.period}
              onChange={handleChange}
              placeholder="2025/2026"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="studentCount">
              Numero de alumnos
            </label>
            <input
              id="studentCount"
              name="studentCount"
              type="number"
              min="0"
              className={styles.input}
              value={formData.studentCount}
              onChange={handleChange}
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
              <option value="flower">Flower</option>
              <option value="hand">Hand</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="specialtyDescription">
            Descripcion para Home
          </label>
          <textarea
            id="specialtyDescription"
            name="specialtyDescription"
            className={styles.textarea}
            rows="3"
            value={formData.specialtyDescription}
            onChange={handleChange}
            placeholder="Texto corto para mostrar la especialidad en la home."
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="workshopPageDescription">
            Descripcion para Talleres
          </label>
          <textarea
            id="workshopPageDescription"
            name="workshopPageDescription"
            className={styles.textarea}
            rows="4"
            value={formData.workshopPageDescription}
            onChange={handleChange}
            placeholder="Texto introductorio de la pagina de talleres."
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
            {isSubmitting ? "Creando..." : "Crear curso"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
