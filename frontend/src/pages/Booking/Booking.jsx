import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../../components/Modal";
import appointmentService from "../../services/appointmentService";
import availabilityService from "../../services/availabilityService";
import workshopService from "../../services/workshopService";
import styles from "./Booking.module.css";

export default function Booking() {
  const location = useLocation();
  // Mantenemos esto por si vienes desde la pantalla de talleres
  const initialTallerId = location.state?.selectedWorkshopId ?? ""; 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Usamos nombres en español
  const [talleres, setTalleres] = useState([]);
  const [horarios, setHorarios] = useState([]);
  
  // Nuestro estado ahora habla el mismo idioma que Spring Boot
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    idTaller: initialTallerId,
    idHorario: "",
    alergias: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadTalleres() {
      const nextTalleres = await workshopService.getAllWorkshops();

      if (!isMounted) return;

      setTalleres(nextTalleres);
      setFormData((current) => ({
        ...current,
        idTaller: current.idTaller || nextTalleres[0]?.idTaller || "",
      }));
    }

    loadTalleres();

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadHorarios() {
      if (!formData.idTaller) {
        setHorarios([]);
        return;
      }

      const nextHorarios = await availabilityService.getSlotsByWorkshopId(formData.idTaller);

      if (!isMounted) return;

      setHorarios(nextHorarios);
      setFormData((current) => ({
        ...current,
        idHorario:
          nextHorarios.find((horario) => String(horario.id) === String(current.idHorario))?.id ??
          nextHorarios[0]?.id ??
          "",
      }));
    }

    loadHorarios();

    return () => { isMounted = false; };
  }, [formData.idTaller]);

 function handleChange(event) {
  const { name, value } = event.target;

  setFormData((current) => {
    // Creamos el nuevo estado basado en el anterior
    const nextData = { ...current, [name]: value };
    
    // Lógica de negocio: Si cambio el taller, el horario anterior ya no es válido
    if (name === "idTaller") {
      nextData.idHorario = "";
    }
    
    return nextData;
  });
}

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await appointmentService.createAppointment({
        nombre: formData.nombre,
        email: formData.email,
        idTaller: formData.idTaller,
        idHorario: formData.idHorario,
        alergias: formData.alergias,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Comparamos convirtiendo a String por seguridad
  const tallerSeleccionado = talleres.find(
    (taller) => String(taller.idTaller) === String(formData.idTaller)
  );
  const horarioSeleccionado = horarios.find(
    (horario) => String(horario.id) === String(formData.idHorario)
  );

  return (
    <>
      <section className={styles.main}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Reserva</span>
          <h2 className={styles.title}>Reserva tu cita</h2>
          <p className={styles.description}>
            Completa este formulario simple para dejar preparada la reserva del taller.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className={styles.input}
                placeholder="Tu nombre completo"
                value={formData.nombre}
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
              <label className={styles.label} htmlFor="idTaller">
                Taller
              </label>
              <select
                id="idTaller"
                name="idTaller"
                className={styles.select}
                value={String(formData.idTaller)} // 👈 ¡EL TRUCO ESTÁ AQUÍ!
                onChange={handleChange}
                required
              >
                {talleres.map((taller) => (
                  <option key={taller.idTaller} value={String(taller.idTaller)}> {/* 👈 Y AQUÍ! */}
                    {taller.nombreTaller}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="idHorario">
                Día y horario disponible
              </label>
              <select
                id="idHorario"
                name="idHorario"
                className={styles.select}
                value={formData.idHorario}
                onChange={handleChange}
                required
              >
                {horarios.map((horario) => (
                  <option key={horario.id} value={horario.id}>
                    {horario.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="alergias">
                Alergias o contraindicaciones
              </label>
              <textarea
                id="alergias"
                name="alergias"
                className={styles.textarea}
                // placeholder para darle una pista al usuario
                placeholder="Indica tus alergias. Si no tienes ninguna, escribe 'Ninguna'."
                rows="4"
                value={formData.alergias}
                onChange={handleChange}
                required // ¡SE AGREGA ESTO PARA HACERLO OBLIGATORIO!
              />
            </div>

            <div className={styles.summary}>
              <p className={styles.summaryTitle}>Resumen de la reserva</p>
              <p className={styles.summaryText}>
                Taller: <strong>{tallerSeleccionado?.nombreTaller || "Sin seleccionar"}</strong>
              </p>
              <p className={styles.summaryText}>
                Horario: <strong>{horarioSeleccionado?.label || "Sin disponibilidad"}</strong>
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
          <strong>{tallerSeleccionado?.nombreTaller || "tu taller"}</strong> el{" "}
          <strong>{horarioSeleccionado?.label || "horario elegido"}</strong>.
        </p>
        <p>
          Te contactaremos en <strong>{formData.email}</strong> para confirmar la reserva.
        </p>
      </Modal>
    </>
  );
}