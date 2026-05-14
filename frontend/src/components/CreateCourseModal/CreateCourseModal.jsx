import { useEffect, useState } from "react";
import { Sparkles, Scissors, Flower, Hand, AlertCircle } from "lucide-react";
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
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setFormData({
          idCurso: courseToEdit.idCurso,
          nombreCurso: courseToEdit.nombreCurso,
          nivel: courseToEdit.nivel,
          cursoAcademico: courseToEdit.cursoAcademico,
          alumnos: courseToEdit.alumnos,
          icono: courseToEdit.icono || "sparkles",
          descripcion: courseToEdit.descripcion,
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setIsSubmitting(false);
      setIsDirty(false);
      setErrors({});
    }
  }, [isOpen, courseToEdit]);

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    onClose();
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setIsDirty(true);
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    // Limpia el error del campo en cuanto el usuario empieza a escribir
    if (errors[name]) {
      setErrors((curr) => ({ ...curr, [name]: null }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Validación de campos individuales
    const newErrors = {};
    if (!formData.nombreCurso.trim()) newErrors.nombreCurso = "El nombre es obligatorio.";
    if (!formData.cursoAcademico.trim()) newErrors.cursoAcademico = "El periodo es obligatorio.";
    if (formData.alumnos === "" || Number(formData.alumnos) < 0) newErrors.alumnos = "Debe ser un número válido.";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Detenemos el envío si hay errores
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        ...formData,
        alumnos: Number(formData.alumnos),
      });
    } catch (err) {
      setErrors({ submit: err.message || "Ha ocurrido un error al procesar el formulario." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
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
              />
              {errors.nombreCurso && <div className={styles.errorMessage}>{errors.nombreCurso}</div>}
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
              />
              {errors.cursoAcademico && <div className={styles.errorMessage}>{errors.cursoAcademico}</div>}
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
              />
              {errors.alumnos && <div className={styles.errorMessage}>{errors.alumnos}</div>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Icono representativo
            </label>
            <div className={styles.iconSelector}>
              {[
                { id: "sparkles", label: "Estética", icon: Sparkles },
                { id: "scissors", label: "Peluquería", icon: Scissors },
                { id: "flower", label: "Bienestar", icon: Flower },
                { id: "hand", label: "Cuidado", icon: Hand },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`${styles.iconButton} ${formData.icono === id ? styles.iconButtonActive : ""}`}
                  onClick={() => {
                    setIsDirty(true);
                    setFormData((current) => ({ ...current, icono: id }));
                  }}
                  aria-label={`Seleccionar icono ${id}`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              ))}
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
            />
            {errors.descripcion && <div className={styles.errorMessage}>{errors.descripcion}</div>}
          </div>

          {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleClose}
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

      <Modal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title="Descartar cambios"
        showAction={false}
      >
        <div className={styles.confirmWrapper}>
          <div className={styles.dangerIconBox}>
            <AlertCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
          </div>

          <div className={styles.confirmTextGroup}>
            <p className={styles.confirmQuestion}>Tienes cambios sin guardar</p>
            <h3 className={styles.confirmTargetName}>¿Seguro que quieres salir?</h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button type="button" className={styles.confirmButton} onClick={confirmClose}>
              Salir y perder cambios
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setShowConfirmClose(false)}>
              Continuar editando
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
