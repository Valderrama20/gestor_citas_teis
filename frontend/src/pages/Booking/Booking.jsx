import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../../components/Modal";
import styles from "./Booking.module.css";

const workshopOptions = [
  "Corte y peinado",
  "Coloracion",
  "Tratamiento capilar",
  "Recogidos",
  "Limpieza facial",
  "Maquillaje social",
  "Hidratacion intensiva",
  "Diseno de cejas",
  "Masaje relajante",
  "Exfoliacion corporal",
  "Depilacion basica",
  "Ritual spa",
  "Manicura basica",
  "Pedicura",
  "Semipermanente",
  "Nail art",
];

const availableSlots = {
  "Corte y peinado": [
    "Martes 22 de abril - 10:00",
    "Jueves 24 de abril - 12:30",
  ],
  Coloracion: [
    "Lunes 21 de abril - 09:30",
    "Viernes 25 de abril - 11:00",
  ],
  "Tratamiento capilar": [
    "Miercoles 23 de abril - 16:00",
    "Viernes 25 de abril - 10:30",
  ],
  Recogidos: [
    "Jueves 24 de abril - 17:00",
    "Viernes 25 de abril - 18:00",
  ],
  "Limpieza facial": [
    "Lunes 21 de abril - 10:00",
    "Miercoles 23 de abril - 12:00",
  ],
  "Maquillaje social": [
    "Martes 22 de abril - 16:30",
    "Jueves 24 de abril - 18:00",
  ],
  "Hidratacion intensiva": [
    "Miercoles 23 de abril - 09:30",
    "Viernes 25 de abril - 12:00",
  ],
  "Diseno de cejas": [
    "Lunes 21 de abril - 17:30",
    "Jueves 24 de abril - 11:30",
  ],
  "Masaje relajante": [
    "Martes 22 de abril - 10:30",
    "Jueves 24 de abril - 16:00",
  ],
  "Exfoliacion corporal": [
    "Miercoles 23 de abril - 11:00",
    "Viernes 25 de abril - 17:00",
  ],
  "Depilacion basica": [
    "Lunes 21 de abril - 15:30",
    "Jueves 24 de abril - 10:00",
  ],
  "Ritual spa": [
    "Martes 22 de abril - 18:00",
    "Viernes 25 de abril - 16:30",
  ],
  "Manicura basica": [
    "Lunes 21 de abril - 09:00",
    "Miercoles 23 de abril - 16:30",
  ],
  Pedicura: [
    "Martes 22 de abril - 12:00",
    "Viernes 25 de abril - 09:30",
  ],
  Semipermanente: [
    "Jueves 24 de abril - 10:30",
    "Viernes 25 de abril - 13:00",
  ],
  "Nail art": [
    "Miercoles 23 de abril - 18:00",
    "Jueves 24 de abril - 17:30",
  ],
};

export default function Booking() {
  const location = useLocation();
  const initialWorkshop = location.state?.selectedWorkshop ?? workshopOptions[0];
  const initialSlots = availableSlots[initialWorkshop] ?? [];
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    workshop: initialWorkshop,
    slot: initialSlots[0] ?? "",
    allergies: "",
  });

  const slotsForWorkshop = availableSlots[formData.workshop] ?? [];

  useEffect(() => {
    const nextWorkshop = location.state?.selectedWorkshop;

    if (!nextWorkshop || nextWorkshop === formData.workshop) {
      return;
    }

    setFormData((current) => ({
      ...current,
      workshop: nextWorkshop,
      slot: availableSlots[nextWorkshop]?.[0] ?? "",
    }));
  }, [location.state, formData.workshop]);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "workshop") {
      setFormData((current) => ({
        ...current,
        workshop: value,
        slot: availableSlots[value]?.[0] ?? "",
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowSuccessModal(true);
  }

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
              <label className={styles.label} htmlFor="workshop">
                Taller
              </label>
              <select
                id="workshop"
                name="workshop"
                className={styles.select}
                value={formData.workshop}
                onChange={handleChange}
                required
              >
                {workshopOptions.map((workshop) => (
                  <option key={workshop} value={workshop}>
                    {workshop}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="slot">
                Dia y horario disponible
              </label>
              <select
                id="slot"
                name="slot"
                className={styles.select}
                value={formData.slot}
                onChange={handleChange}
                required
              >
                {slotsForWorkshop.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
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
                Taller: <strong>{formData.workshop}</strong>
              </p>
              <p className={styles.summaryText}>
                Horario: <strong>{formData.slot || "Sin disponibilidad"}</strong>
              </p>
            </div>

            <button type="submit" className={styles.button}>
              Solicitar cita
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
          Hemos registrado la solicitud para <strong>{formData.workshop}</strong>
          {" "}el <strong>{formData.slot}</strong>.
        </p>
        <p>
          Te contactaremos en <strong>{formData.email}</strong> para confirmar
          la reserva.
        </p>
      </Modal>
    </>
  );
}
