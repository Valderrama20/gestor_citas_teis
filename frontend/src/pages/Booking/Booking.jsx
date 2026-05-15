import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, AlertCircle, Droplet, Sparkles, Magnet, Brush, Flower, X } from "lucide-react";
import Modal from "../../components/Modal";
import appointmentService from "../../services/appointmentService";
import availabilityService from "../../services/availabilityService";
import workshopService from "../../services/workshopService";
import styles from "./Booking.module.css";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialWorkshopId = location.state?.selectedWorkshopId ?? "";
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");
  const [allergyError, setAllergyError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [clientError, setClientError] = useState("");
  const [workshopError, setWorkshopError] = useState("");
  const [slotError, setSlotError] = useState("");

  const [talleres, setTalleres] = useState([]);
  const [horarios, setHorarios] = useState([]);

  // Estado para manejar la lógica de la UI independientemente del Backend
  const [uiState, setUiState] = useState({
    hasAllergies: "no", // "no" | "yes"
    selectedAllergies: [],
    otherAllergies: ""
  });

  const commonAllergies = [
    { id: "Látex", label: "Látex", icon: Droplet },
    { id: "Cosméticos", label: "Cosméticos", icon: Sparkles },
    { id: "Níquel", label: "Níquel", icon: Magnet },
    { id: "Acrílicos", label: "Acrílicos", icon: Brush },
    { id: "Piel Atópica", label: "Piel Atópica", icon: Flower }
  ];

  const [formData, setFormData] = useState({
    client: "",
    email: "",
    phone: "", // Nuevo campo
    workshopId: initialWorkshopId,
    slotId: "",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadTalleres() {
      const nextTalleres = await workshopService.getAllWorkshops();
      if (!isMounted) return;
      setTalleres(nextTalleres);
      setFormData((current) => ({
        ...current,
        workshopId: current.workshopId || nextTalleres[0]?.idTaller || "",
      }));
    }
    loadTalleres();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadHorarios() {
      if (!formData.workshopId) {
        setHorarios([]);
        return;
      }
      const nextHorarios = await availabilityService.getSlotsByWorkshopId(formData.workshopId);
      if (!isMounted) return;
      setHorarios(nextHorarios);
      setFormData((current) => ({
        ...current,
        slotId:
          nextHorarios.find((horario) => String(horario.id) === String(current.slotId))?.id ??
          nextHorarios[0]?.id ??
          "",
      }));
    }
    loadHorarios();
    return () => { isMounted = false; };
  }, [formData.workshopId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setIsDirty(true);
    setFormData((current) => {
      const nextData = { ...current, [name]: value };
      if (name === "workshopId") nextData.slotId = "";
      return nextData;
    });
    if (name === "email" || name === "phone") setContactError("");
    if (name === "client") setClientError("");
    if (name === "workshopId") setWorkshopError("");
    if (name === "slotId") setSlotError("");
  }

  function handleAllergyToggle(value) {
    setAllergyError("");
    setIsDirty(true);
    setUiState(prev => {
      const isSelected = prev.selectedAllergies.includes(value);
      if (!isSelected) return { ...prev, selectedAllergies: [...prev.selectedAllergies, value] };
      return { ...prev, selectedAllergies: prev.selectedAllergies.filter(item => item !== value) };
    });
  }

  // Prevenir que el usuario refresque la página o cierre la pestaña por error
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      navigate(-1);
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    navigate(-1);
  };

  const handleAnotherBooking = () => {
    setShowSuccessModal(false);
    setIsDirty(false);
    setFormData({
      client: "",
      email: "",
      phone: "",
      workshopId: talleres.length > 0 ? String(talleres[0].idTaller) : "",
      slotId: "",
    });
    setUiState({
      hasAllergies: "no",
      selectedAllergies: [],
      otherAllergies: ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    setIsDirty(false);
    navigate("/");
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.client.trim()) {
      setClientError("Por favor, indícanos tu nombre completo.");
      const el = document.getElementById("nombre");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.workshopId) {
      setWorkshopError("Por favor, selecciona el taller al que deseas asistir.");
      const el = document.getElementById("workshopId");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.slotId) {
      setSlotError("Por favor, selecciona un día y horario disponible.");
      const el = document.getElementById("slotId");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    // Validación UX: Al menos un método de contacto
    if (!formData.email && !formData.phone) {
      setContactError("Por favor, facilítanos un correo electrónico o un teléfono de contacto.");
      const el = document.getElementById("email");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    // Validación UX: Si tiene alergias, debe marcar o escribir al menos una
    if (uiState.hasAllergies === "yes" && uiState.selectedAllergies.length === 0 && uiState.otherAllergies.trim() === "") {
      setAllergyError("Por favor, selecciona al menos una alergia o especifica en el campo 'Otro'.");
      const el = document.getElementById("otherAllergies");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    setIsSubmitting(true);

    // Transformamos la UI atractiva en el String exacto que espera el Backend
    let finalAllergies = "Ninguna";
    if (uiState.hasAllergies === "yes") {
      const allergiesList = [...uiState.selectedAllergies];
      if (uiState.otherAllergies.trim() !== "") allergiesList.push(uiState.otherAllergies);
      finalAllergies = allergiesList.length > 0 ? allergiesList.join(", ") : "No especificadas";
    }

    try {
      await appointmentService.createAppointment({
        client: formData.client,
        email: formData.email,
        phone: formData.phone, // Si tu DTO no lo acepta, puedes concatenarlo a 'client' temporalmente
        workshopId: formData.workshopId,
        slotId: formData.slotId,
        allergies: finalAllergies, // Backend no nota la diferencia
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSubmitDisabled = isSubmitting;

  const tallerSeleccionado = talleres.find((taller) => String(taller.idTaller) === String(formData.workshopId));
  const horarioSeleccionado = horarios.find((horario) => String(horario.id) === String(formData.slotId));

  return (
    <>
      <section className={styles.main}>
        <div className={styles.card}>
          <button
            type="button"
            className={styles.closeIconBtn}
            onClick={handleClose}
            aria-label="Cerrar y volver"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className={styles.header}>
            <span className={styles.eyebrow}>Reserva</span>
            <h2 className={styles.title}>Solicita tu cita</h2>
            <p className={styles.description}>
              Completa este formulario para gestionar tu asistencia. Nos aseguraremos de tener todo listo para ti.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* --- DATOS PERSONALES --- */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="nombre">Nombre completo *</label>
              <input
                id="nombre" name="client" type="text" className={styles.input}
                placeholder="Ej. María García" value={formData.client}
                onChange={handleChange} required
              />
            </div>
            
            {clientError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {clientError}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="workshopId">Taller de interés *</label>
              <select
                id="workshopId" name="workshopId" className={styles.select}
                value={String(formData.workshopId)} onChange={handleChange} required
              >
                {talleres.map((taller) => (
                  <option key={taller.idTaller} value={String(taller.idTaller)}>
                    {taller.nombreTaller}
                  </option>
                ))}
              </select>
            </div>
            
            {workshopError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {workshopError}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Correo electrónico</label>
              <input
                id="email" name="email" type="email" className={styles.input}
                placeholder="correo@ejemplo.com" value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="phone">Teléfono de contacto</label>
              <input
                id="phone" name="phone" type="tel" className={styles.input}
                placeholder="Ej. 600 000 000" value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {contactError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {contactError}
              </div>
            )}

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="slotId">Día y horario disponible *</label>
              <select
                id="slotId" name="slotId" className={styles.select}
                value={formData.slotId} onChange={handleChange} required
              >
                {horarios.map((horario) => (
                  <option key={horario.id} value={horario.id}>{horario.label}</option>
                ))}
              </select>
            </div>
            
            {slotError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {slotError}
              </div>
            )}

            {/* --- SECCIÓN ALERGIAS UX MEJORADA --- */}
            <div className={`${styles.fieldGroup} ${styles.fullWidth} ${styles.allergiesSection}`}>
              <label className={styles.label}>Alergias o contraindicaciones importantes</label>
              <p className={styles.helperText}>Selecciona si tienes alguna sensibilidad que debamos conocer.</p>

              <div className={styles.cardSelector}>
                <button
                  type="button"
                  className={`${styles.cardButton} ${uiState.hasAllergies === "no" ? styles.cardButtonActive : ""}`}
                  onClick={() => {
                    setAllergyError("");
                    setIsDirty(true);
                    setUiState({ ...uiState, hasAllergies: "no" });
                  }}
                >
                  <span>No tengo alergias conocidas</span>
                </button>
                <button
                  type="button"
                  className={`${styles.cardButton} ${uiState.hasAllergies === "yes" ? styles.cardButtonActive : ""}`}
                  onClick={() => {
                    setAllergyError("");
                    setIsDirty(true);
                    setUiState({ ...uiState, hasAllergies: "yes" });
                  }}
                >
                  <span>Sí, tengo alguna alergia</span>
                </button>
              </div>

              {uiState.hasAllergies === "yes" && (
                <div className={styles.allergiesGrid}>
                  <div className={styles.cardSelector} style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                    {commonAllergies.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        className={`${styles.cardButton} ${uiState.selectedAllergies.includes(id) ? styles.cardButtonActive : ""}`}
                        onClick={() => handleAllergyToggle(id)}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.otherAllergyGroup}>
                    <label htmlFor="otherAllergies" className={styles.labelSmall}>Otro (especificar):</label>
                    <textarea
                      id="otherAllergies" className={styles.input}
                      placeholder="Ej. Piel rosácea..."
                      value={uiState.otherAllergies}
                      onChange={(e) => {
                        setIsDirty(true);
                        setUiState({ ...uiState, otherAllergies: e.target.value });
                      }}
                      rows="2"
                      style={{ resize: "vertical" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* --- BOTTOM CENTRADO --- */}
            <div className={styles.bottomSection}>
              <div className={styles.summary}>
                <p className={styles.summaryTitle}>Resumen de tu selección</p>
                <p className={styles.summaryText}>
                  Taller: <strong>{tallerSeleccionado?.nombreTaller || "Sin seleccionar"}</strong>
                </p>
                <p className={styles.summaryText}>
                  Correo electrónico: <strong>{formData.email || "No especificado"}</strong>
                </p>
                <p className={styles.summaryText}>
                  Teléfono: <strong>{formData.phone || "No especificado"}</strong>
                </p>
                <p className={styles.summaryText}>
                  Día y horario: <strong>{horarioSeleccionado?.label || "Sin disponibilidad"}</strong>
                </p>
                <p className={styles.summaryText}>
                  Alergias: <strong>
                    {uiState.hasAllergies === "no" ? "Ninguna" : ([...uiState.selectedAllergies, uiState.otherAllergies.trim()].filter(Boolean).length > 0 ? [...uiState.selectedAllergies, uiState.otherAllergies.trim()].filter(Boolean).join(", ") : "No especificadas")}
                  </strong>
                </p>
              </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.buttonPrimary} disabled={isSubmitDisabled}>
              {isSubmitting ? "Procesando..." : "Solicitar cita"}
            </button>
          </div>
            </div>
          </form>
        </div>
      </section>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleGoHome}
        eyebrow="Solicitud completada"
        title="Tu cita está en proceso"
        showAction={false}
      >
        <div className={styles.confirmWrapper} style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "1rem" }}>Hemos registrado la solicitud para el taller de <strong>{tallerSeleccionado?.nombreTaller}</strong>.</p>
          <p style={{ marginBottom: "2rem" }}>En breve nos pondremos en contacto contigo a través de los datos facilitados para confirmar definitivamente tu plaza.</p>
          
          <p className={styles.confirmQuestion} style={{ marginBottom: "1rem" }}>¿Deseas solicitar otra cita?</p>
          
          <div className={styles.modalActionsVertical}>
            <button type="button" className={styles.buttonPrimary} onClick={handleAnotherBooking}>
              Sí, solicitar otra cita
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleGoHome}>
              No, volver al inicio
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title="Descartar reserva"
        showAction={false}
      >
        <div className={styles.confirmWrapper}>
          <div className={styles.dangerIconBox}>
            <AlertCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
          </div>

          <div className={styles.confirmTextGroup}>
            <p className={styles.confirmQuestion}>Tienes datos sin confirmar</p>
            <h3 className={styles.confirmTargetName}>¿Seguro que quieres salir?</h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button type="button" className={styles.confirmButton} onClick={confirmClose}>
              Salir y perder datos
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setShowConfirmClose(false)}>
              Continuar reserva
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}