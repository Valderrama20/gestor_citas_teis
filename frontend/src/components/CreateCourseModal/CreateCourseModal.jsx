import { useEffect, useState } from "react";
import Modal from "../Modal";
import styles from "./CreateCourseModal.module.css";

const INITIAL_FORM = {
  nombreCurso: "",
  nivel: "Grado Medio",
  cursoAcademico: "2025/2026",
  alumnos: "0",
  icono: "sparkles",
  descripcion: "",
};

export default function CreateCourseModal({ isOpen, onClose, onSubmit, courseToEdit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setFormData({
          idCurso: courseToEdit.idCurso,
          nombreCurso: courseToEdit.nombreCurso,
          nivel: courseToEdit.nivel,
          cursoAcademico: courseToEdit.cursoAcademico,
          alumnos: courseToEdit.alumnos,
          icono: courseToEdit.icono,
          descripcion: courseToEdit.descripcion,
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setIsSubmitting(false);
    }
  }, [isOpen, courseToEdit]);

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
        alumnos: Number(formData.alumnos),
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
      title={courseToEdit ? "Editar curso" : "Crear nuevo curso"}
      showAction={false}
      modalClassName={styles.modal}
      contentClassName={styles.content}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="nombreCurso">
              Nombre del curso
            </label>
            <input
              id="nombreCurso"
              name="nombreCurso"
              type="text"
              className={styles.input}
              value={formData.nombreCurso}
              onChange={handleChange}
              placeholder="Ej. Peluqueria avanzada"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="nivel">
              Nivel
            </label>
            <select
              id="nivel"
              name="nivel"
              className={styles.input}
              value={formData.nivel}
              onChange={handleChange}
            >
              <option value="Grado Medio">Grado Medio</option>
              <option value="Grado Superior">Grado Superior</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cursoAcademico">
              Periodo
            </label>
            <input
              id="cursoAcademico"
              name="cursoAcademico"
              type="text"
              className={styles.input}
              value={formData.cursoAcademico}
              onChange={handleChange}
              placeholder="2025/2026"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="alumnos">
              Numero de alumnos
            </label>
            <input
              id="alumnos"
              name="alumnos"
              type="number"
              min="0"
              className={styles.input}
              value={formData.alumnos}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="icono">
              Icono
            </label>
            <select
              id="icono"
              name="icono"
              className={styles.input}
              value={formData.icono}
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
          <label className={styles.label} htmlFor="descripcion">
            Descripcion
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className={styles.textarea}
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Texto corto para mostrar la especialidad en la home."
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
            {isSubmitting ? "Guardando..." : (courseToEdit ? "Guardar cambios" : "Crear curso")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
