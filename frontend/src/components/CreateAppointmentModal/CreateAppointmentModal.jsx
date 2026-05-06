import { useEffect, useState } from "react";
import availabilityService from "../../services/availabilityService";
import Modal from "../Modal";
import styles from "./CreateAppointmentModal.module.css";

// 1️⃣ TRADUCIMOS EL ESTADO PARA QUE COINCIDA CON EL BACKEND
const INITIAL_FORM = {
  nombre: "",
  email: "",
  idTaller: "",
  idHorario: "",
  alergias: "",
};

export default function CreateAppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  courseName,
  workshops,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(INITIAL_FORM);
    setSlots([]);
    setIsSubmitting(false);
  }, [isOpen, workshops]);

  useEffect(() => {
    let isMounted = true;

    async function loadSlots() {
      if (!formData.idTaller) {
        setSlots([]);
        return;
      }

      const nextSlots = await availabilityService.getSlotsByWorkshopId(
        formData.idTaller
      );

      if (!isMounted) {
        return;
      }

      setSlots(nextSlots);
      setFormData((current) => {
        const nextSlotId =
          nextSlots.find((slot) => String(slot.id) === String(current.idHorario))?.id ??
          nextSlots[0]?.id ??
          "";

        return {
          ...current,
          idHorario: nextSlotId,
        };
      });
    }

    loadSlots();

    return () => {
      isMounted = false;
    };
  }, [formData.idTaller]); // 👈 Actualizamos la dependencia

  // 2️⃣ SIMPLIFICAMOS EL HANDLE CHANGE COMO HICIMOS EN BOOKING.JSX
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => {
      const nextData = { ...current, [name]: value };

      if (name === "idTaller") {
        nextData.idHorario = ""; // Reseteamos horario si cambia el taller
      }

      return nextData;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Al hacer submit, enviamos el formData ya en español
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSubmitDisabled =
    isSubmitting || !formData.idTaller || !formData.idHorario;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Panel administrativo"
      title="Agregar cita manual"
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
          <label className={styles.label} htmlFor="nombre">
            Cliente
          </label>
          <input
            id="nombre"
            name="nombre" /* 👈 Cambiado a nombre */
            type="text"
            className={styles.input}
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Maria Alonso"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder="nombre@correo.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="idTaller">
            Taller
          </label>
          <select
            id="idTaller"
            name="idTaller" /* 👈 Cambiado a idTaller */
            className={styles.input}
            value={String(formData.idTaller)} /* 👈 Magia anti-congelamiento */
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un taller</option>
            {workshops.map((workshop) => (
              <option key={workshop.id || workshop.idTaller} value={String(workshop.id || workshop.idTaller)}>
                {workshop.title || workshop.nombreTaller}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="idHorario">
            Fecha y hora disponibles
          </label>
          <select
            id="idHorario"
            name="idHorario" /* 👈 Cambiado a idHorario */
            className={styles.input}
            value={String(formData.idHorario)} /* 👈 Magia anti-congelamiento */
            onChange={handleChange}
            required
            disabled={!formData.idTaller || slots.length === 0}
          >
            {!formData.idTaller && (
              <option value="">Selecciona un taller primero</option>
            )}
            {formData.idTaller && slots.length === 0 && (
              <option value="">Sin horarios disponibles</option>
            )}
            {slots.map((slot) => (
              <option key={slot.id} value={String(slot.id)}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="alergias">
            Alergias o contraindicaciones
          </label>
          <textarea
            id="alergias"
            name="alergias" /* 👈 Cambiado a alergias */
            className={styles.textarea}
            placeholder="Indica tus alergias. Si no tienes ninguna, escribe 'Ninguna'."
            rows="4"
            value={formData.alergias}
            onChange={handleChange}
            required /* 👈 Obligatorio */
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
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? "Guardando..." : "Guardar cita"}
          </button>
        </div>
      </form>
    </Modal>
  );
}