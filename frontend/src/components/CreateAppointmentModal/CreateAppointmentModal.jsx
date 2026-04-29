import { useEffect, useState } from "react";
import availabilityService from "../../services/availabilityService";
import Modal from "../Modal";
import styles from "./CreateAppointmentModal.module.css";

const INITIAL_FORM = {
  client: "",
  email: "",
  workshopId: "",
  slotId: "",
  date: "",
  time: "",
  allergies: "",
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
      if (!formData.workshopId) {
        setSlots([]);
        return;
      }

      const nextSlots = await availabilityService.getSlotsByWorkshopId(
        formData.workshopId,
      );

      if (!isMounted) {
        return;
      }

      setSlots(nextSlots);
      setFormData((current) => {
        const nextSlotId =
          nextSlots.find((slot) => slot.id === current.slotId)?.id ??
          nextSlots[0]?.id ??
          "";
        const selectedSlot = nextSlots.find((slot) => slot.id === nextSlotId);

        return {
          ...current,
          slotId: nextSlotId,
          date: selectedSlot?.date ?? "",
          time: selectedSlot?.time ?? "",
        };
      });
    }

    loadSlots();

    return () => {
      isMounted = false;
    };
  }, [formData.workshopId]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "workshopId") {
      setFormData((current) => ({
        ...current,
        workshopId: value,
        slotId: "",
        date: "",
        time: "",
      }));
      return;
    }

    if (name === "slotId") {
      const selectedSlot = slots.find((slot) => slot.id === value);
      setFormData((current) => ({
        ...current,
        slotId: value,
        date: selectedSlot?.date ?? "",
        time: selectedSlot?.time ?? "",
      }));
      return;
    }

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

  const isSubmitDisabled =
    isSubmitting || !formData.workshopId || !formData.slotId;

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
          <label className={styles.label} htmlFor="client">
            Cliente
          </label>
          <input
            id="client"
            name="client"
            type="text"
            className={styles.input}
            value={formData.client}
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
          <label className={styles.label} htmlFor="workshopId">
            Taller
          </label>
          <select
            id="workshopId"
            name="workshopId"
            className={styles.input}
            value={formData.workshopId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un taller</option>
            {workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="slotId">
            Fecha y hora disponibles
          </label>
          <select
            id="slotId"
            name="slotId"
            className={styles.input}
            value={formData.slotId}
            onChange={handleChange}
            required
            disabled={!formData.workshopId || slots.length === 0}
          >
            {!formData.workshopId && (
              <option value="">Selecciona un taller primero</option>
            )}
            {formData.workshopId && slots.length === 0 && (
              <option value="">Sin horarios disponibles</option>
            )}
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="allergies">
            Alergias o contraindicaciones
          </label>
          <textarea
            id="allergies"
            name="allergies"
            className={styles.textarea}
            placeholder="Indica alergias, sensibilidad en la piel o cualquier observacion relevante."
            rows="4"
            value={formData.allergies}
            onChange={handleChange}
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
