import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, AlertCircle, Droplet, Sparkles, Magnet, Brush, Flower, X, Calendar } from "lucide-react";
import Modal from "../../components/Modal";
import CalendarModal from "../../components/CalendarModal/CalendarModal";
import appointmentService from "../../services/appointmentService";
import availabilityService from "../../services/availabilityService";
import workshopService from "../../services/workshopService";
import styles from "./Booking.module.css";
import { useTranslation } from "react-i18next";

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
  const [dateError, setDateError] = useState("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [talleres, setTalleres] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const { t, i18n } = useTranslation(['booking', 'common']);

  // Estado para manejar la lógica de la UI independientemente del Backend
  const [uiState, setUiState] = useState({
    hasAllergies: "no", // "no" | "yes"
    selectedAllergies: [],
    otherAllergies: ""
  });

  const commonAllergies = [
    { id: "Látex", label: t('allergies.items.latex'), icon: Droplet },
    { id: "Cosméticos", label: t('allergies.items.cosmetics'), icon: Sparkles },
    { id: "Níquel", label: t('allergies.items.nickel'), icon: Magnet },
    { id: "Acrílicos", label: t('allergies.items.acrylics'), icon: Brush },
    { id: "Piel Atópica", label: t('allergies.items.atopic'), icon: Flower }
  ];

  const [formData, setFormData] = useState({
    client: "",
    email: "",
    phone: "", // Nuevo campo
    workshopId: initialWorkshopId,
    slotId: "",
    date: "",
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
      const nextHorarios = await availabilityService.getSlotsByWorkshopId(formData.workshopId, 4);
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
      if (name === "workshopId") {
        nextData.slotId = "";
        nextData.date = "";
      }
      return nextData;
    });
    if (name === "email" || name === "phone") setContactError("");
    if (name === "client") setClientError("");
    if (name === "workshopId") {
      setWorkshopError("");
      setDateError("");
    }
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
      date: "",
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
      setClientError(t('form.clientError'));
      const el = document.getElementById("nombre");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.workshopId) {
      setWorkshopError(t('form.workshopError'));
      const el = document.getElementById("workshopId");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.date) {
      setDateError(t('form.dateError'));
      const el = document.getElementById("dateBtn");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    // Validación UX: Al menos un método de contacto
    if (!formData.email && !formData.phone) {
      setContactError(t('form.contactError'));
      const el = document.getElementById("email");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    // Validación UX: Si tiene alergias, debe marcar o escribir al menos una
    if (uiState.hasAllergies === "yes" && uiState.selectedAllergies.length === 0 && uiState.otherAllergies.trim() === "") {
      setAllergyError(t('allergies.error'));
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
        date: formData.date,
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
  const fechasPermitidasDelTaller = horarios.filter((horario) => horario.fecha);

  return (
    <>
      <section className={styles.main}>
        <div className={styles.card}>
          <button
            type="button"
            className={styles.closeIconBtn}
            onClick={handleClose}
            aria-label={t('common:actions.close')}
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className={styles.header}>
            <span className={styles.eyebrow}>{t('eyebrow')}</span>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.description}>
              {t('description')}
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* --- DATOS PERSONALES --- */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="nombre">{t('form.clientLabel')}</label>
              <input
                id="nombre" name="client" type="text" className={styles.input}
                placeholder={t('form.clientPlaceholder')} value={formData.client}
                onChange={handleChange} required
              />
            </div>
            
            {clientError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {clientError}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="workshopId">{t('form.workshopLabel')}</label>
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
              <label className={styles.label} htmlFor="email">{t('form.emailLabel')}</label>
              <input
                id="email" name="email" type="email" className={styles.input}
                placeholder={t('form.emailPlaceholder')} value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="phone">{t('form.phoneLabel')}</label>
              <input
                id="phone" name="phone" type="tel" className={styles.input}
                placeholder={t('form.phonePlaceholder')} value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {contactError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {contactError}
              </div>
            )}

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="dateBtn">{t('form.dateLabel')}</label>
              <button
                id="dateBtn"
                type="button"
                className={styles.input}
                style={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: formData.workshopId ? "pointer" : "not-allowed",
                  opacity: formData.workshopId ? 1 : 0.6
                }}
                disabled={!formData.workshopId}
                onClick={() => setIsCalendarOpen(true)}
              >
                <span style={{ color: formData.date ? "inherit" : "var(--color-text-muted)" }}>
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long" })
                    : t('form.datePlaceholder')}
                </span>
                <Calendar size={18} color="var(--color-text-muted)" />
              </button>
            </div>

            {dateError && (
              <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
                {dateError}
              </div>
            )}

            {/* --- SECCIÓN ALERGIAS UX MEJORADA --- */}
            <div className={`${styles.fieldGroup} ${styles.fullWidth} ${styles.allergiesSection}`}>
              <label className={styles.label}>{t('allergies.label')}</label>
              <p className={styles.helperText}>{t('allergies.helper')}</p>

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
                  <span>{t('allergies.noAllergies')}</span>
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
                  <span>{t('allergies.hasAllergies')}</span>
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
                    <label htmlFor="otherAllergies" className={styles.labelSmall}>{t('allergies.otherLabel')}</label>
                    <textarea
                      id="otherAllergies" className={styles.input}
                      placeholder={t('allergies.otherPlaceholder')}
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
                <p className={styles.summaryTitle}>{t('summary.title')}</p>
                <p className={styles.summaryText}>
                  {t('summary.workshop')} <strong>{tallerSeleccionado?.nombreTaller || t('summary.unselected')}</strong>
                </p>
                <p className={styles.summaryText}>
                  {t('summary.email')} <strong>{formData.email || t('summary.unspecified')}</strong>
                </p>
                <p className={styles.summaryText}>
                  {t('summary.phone')} <strong>{formData.phone || t('summary.unspecified')}</strong>
                </p>
                <p className={styles.summaryText}>
                  {t('summary.date')} <strong>
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long" })
                      : t('summary.unselected')}
                  </strong>
                </p>
                <p className={styles.summaryText}>
                  {t('summary.allergies')} <strong>
                    {uiState.hasAllergies === "no" ? t('summary.none') : ([...uiState.selectedAllergies, uiState.otherAllergies.trim()].filter(Boolean).length > 0 ? [...uiState.selectedAllergies, uiState.otherAllergies.trim()].filter(Boolean).join(", ") : t('summary.notSpecified'))}
                  </strong>
                </p>
              </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={handleClose} disabled={isSubmitting}>
              {t('actions.cancel')}
            </button>
            <button type="submit" className={styles.buttonPrimary} disabled={isSubmitDisabled}>
              {isSubmitting ? t('actions.submitting') : t('actions.submit')}
            </button>
          </div>
            </div>
          </form>
        </div>
      </section>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleGoHome}
        eyebrow={t('successModal.eyebrow')}
        title={t('successModal.title')}
        showAction={false}
      >
        <div className={styles.confirmWrapper} style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "1rem" }}>{t('successModal.text1')} <strong>{tallerSeleccionado?.nombreTaller}</strong>.</p>
          <p style={{ marginBottom: "2rem" }}>{t('successModal.text2')}</p>
          
          <p className={styles.confirmQuestion} style={{ marginBottom: "1rem" }}>{t('successModal.question')}</p>
          
          <div className={styles.modalActionsVertical}>
            <button type="button" className={styles.buttonPrimary} onClick={handleAnotherBooking}>
              {t('successModal.yes')}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleGoHome}>
              {t('successModal.no')}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title={t('confirmModal.title')}
        showAction={false}
      >
        <div className={styles.confirmWrapper}>
          <div className={styles.dangerIconBox}>
            <AlertCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
          </div>

          <div className={styles.confirmTextGroup}>
            <p className={styles.confirmQuestion}>{t('confirmModal.question')}</p>
            <h3 className={styles.confirmTargetName}>{t('confirmModal.target')}</h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button type="button" className={styles.confirmButton} onClick={confirmClose}>
              {t('confirmModal.exit')}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setShowConfirmClose(false)}>
              {t('confirmModal.continue')}
            </button>
          </div>
        </div>
      </Modal>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        allowedDates={fechasPermitidasDelTaller}
        onSelectDate={(selectedDate) => {
          setIsDirty(true);
          setDateError("");

          const matchedSlot = horarios.find((horario) =>
            String(horario.fecha || horario.date || "") === String(selectedDate)
          );
          const nextSlotId = matchedSlot
            ? String(matchedSlot.id || matchedSlot.idHorario || matchedSlot.slotId || "")
            : "";

          setFormData((prev) => ({ ...prev, date: selectedDate, slotId: nextSlotId }));
        }}
      />
    </>
  );
}