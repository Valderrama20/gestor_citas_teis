import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../../components/Modal";
import appointmentService from "../../services/appointmentService";
import availabilityService from "../../services/availabilityService";
import workshopService from "../../services/workshopService";
import styles from "./Booking.module.css";

export default function Booking() {
  const location = useLocation();
  const initialWorkshopId = location.state?.selectedWorkshopId ?? "";
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    workshopId: initialWorkshopId,
    slotId: "",
    allergies: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadWorkshops() {
      const nextWorkshops = await workshopService.getAllWorkshops();

      if (!isMounted) {
        return;
      }

      setWorkshops(nextWorkshops);
      setFormData((current) => ({
        ...current,
        workshopId: current.workshopId || nextWorkshops[0]?.id || "",
      }));
    }

    loadWorkshops();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const nextWorkshopId = location.state?.selectedWorkshopId;

    if (!nextWorkshopId || nextWorkshopId === formData.workshopId) {
      return;
    }

    setFormData((current) => ({
      ...current,
      workshopId: nextWorkshopId,
      slotId: "",
    }));
  }, [location.state, formData.workshopId]);

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
      setFormData((current) => ({
        ...current,
        slotId:
          nextSlots.find((slot) => slot.id === current.slotId)?.id ??
          nextSlots[0]?.id ??
          "",
      }));
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
      await appointmentService.createAppointment({
        name: formData.name,
        email: formData.email,
        workshopId: formData.workshopId,
        slotId: formData.slotId,
        allergies: formData.allergies,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedWorkshop = workshops.find(
    (workshop) => workshop.id === formData.workshopId,
  );
  const selectedSlot = slots.find((slot) => slot.id === formData.slotId);

  return (
    <>
      <section className={styles.main}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Reserva</span>
          <h2 className={styles.title}>Reserva tu cita</h2>
          <p className={styles.description}>
            Completa este formulario simple para dejar preparada la reserva del
            taller.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="nombre@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="workshopId">
                Taller
              </label>
              <select
                id="workshopId"
                name="workshopId"
                className={styles.select}
                value={formData.workshopId}
                onChange={handleChange}
                required
              >
                {workshops.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="slotId">
                Dia y horario disponible
              </label>
              <select
                id="slotId"
                name="slotId"
                className={styles.select}
                value={formData.slotId}
                onChange={handleChange}
                required
              >
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
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

            <div className={styles.summary}>
              <p className={styles.summaryTitle}>Resumen de la reserva</p>
              <p className={styles.summaryText}>
                Taller: <strong>{selectedWorkshop?.title || "Sin seleccionar"}</strong>
              </p>
              <p className={styles.summaryText}>
                Horario: <strong>{selectedSlot?.label || "Sin disponibilidad"}</strong>
              </p>
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Solicitar cita"}
            </button>
          </form>
        </div>
      </section>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        eyebrow="Solicitud enviada"
        title="Tu cita se ha solicitado correctamente"
      >
        <p>
          Hemos registrado la solicitud para{" "}
          <strong>{selectedWorkshop?.title || "tu taller"}</strong> el{" "}
          <strong>{selectedSlot?.label || "horario elegido"}</strong>.
        </p>
        <p>
          Te contactaremos en <strong>{formData.email}</strong> para confirmar
          la reserva.
        </p>
      </Modal>
    </>
  );
}
