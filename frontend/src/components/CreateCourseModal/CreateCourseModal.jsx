import { useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../Modal";
import { AVAILABLE_ICONS } from "../../constants/icons";
import styles from "./CreateCourseModal.module.css";

const INITIAL_FORM = {
  nombreCurso: "",
  nivel: "Grado Medio",
  cursoAcademico: "2025/2026",
  alumnos: "0",
  icono: "sparkles",
  descripcion: "",
};
const ICON_SCROLL_AMOUNT = 250;
const ICON_SCROLL_DURATION = 420;

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

export default function CreateCourseModal({ isOpen, onClose, onSubmit, courseToEdit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const iconContainerRef = useRef(null);
  const scrollAnimationRef = useRef(null);

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
    }
  }, [isOpen, courseToEdit]);

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

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

  const scrollIcons = (direction) => {
    const container = iconContainerRef.current;

    if (container) {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      const startScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetScroll = Math.min(
        Math.max(startScroll + (direction === "left" ? -ICON_SCROLL_AMOUNT : ICON_SCROLL_AMOUNT), 0),
        maxScroll
      );
      const scrollDelta = targetScroll - startScroll;
      let startTime;

      const animateScroll = (timestamp) => {
        startTime ??= timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / ICON_SCROLL_DURATION, 1);

        container.scrollLeft = startScroll + scrollDelta * easeOutCubic(progress);

        if (progress < 1) {
          scrollAnimationRef.current = requestAnimationFrame(animateScroll);
        }
      };

      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
    }
  };

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
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Icono representativo</label>
          <div className={styles.iconCarousel}>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={() => scrollIcons('left')}
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <div className={styles.iconSelector} ref={iconContainerRef}>
              {AVAILABLE_ICONS.map(({ id, label, icon }) => {
                const Icon = icon;

                return (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.iconButton} ${formData.icono === id ? styles.iconButtonActive : ""}`}
                    onClick={() => {
                      setIsDirty(true);
                      setFormData((current) => ({ ...current, icono: id }));
                    }}
                    aria-label={`Seleccionar icono ${label}`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={() => scrollIcons('right')}
              aria-label="Desplazar a la derecha"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
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
