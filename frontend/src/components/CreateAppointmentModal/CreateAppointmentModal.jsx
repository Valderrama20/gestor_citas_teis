import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Droplet, Sparkles, Magnet, Brush, Flower, AlertCircle, Calendar } from "lucide-react";
import availabilityService from "../../services/availabilityService";
import Modal from "../Modal";
import CalendarModal from "../CalendarModal/CalendarModal";
import styles from "./CreateAppointmentModal.module.css";
import { translateWorkshopName } from "../../utils/translateCatalog";

const INITIAL_FORM = {
  client: "",
  email: "",
  phone: "",
  workshopId: "",
  slotId: "",
  date: "",
  allergies: "",
};

const COMMON_ALLERGIES = [
  { id: "latex", backendValue: "Látex", icon: Droplet },
  { id: "cosmetics", backendValue: "Cosméticos", icon: Sparkles },
  { id: "nickel", backendValue: "Níquel", icon: Magnet },
  { id: "acrylics", backendValue: "Acrílicos", icon: Brush },
  { id: "atopic", backendValue: "Piel atópica", icon: Flower },
];

export default function CreateAppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  courseName,
  workshops,
}) {
  const { t, i18n } = useTranslation('appointmentForm');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);
  const [contactError, setContactError] = useState("");
  const [allergyError, setAllergyError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [clientError, setClientError] = useState("");
  const [workshopError, setWorkshopError] = useState("");
  const [dateError, setDateError] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [uiState, setUiState] = useState({
    hasAllergies: "no",
    selectedAllergies: [],
    otherAllergies: ""
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(INITIAL_FORM);
    setUiState({ hasAllergies: "no", selectedAllergies: [], otherAllergies: "" });
    setContactError("");
    setAllergyError("");
    setSlots([]);
    setIsSubmitting(false);
    setIsDirty(false);
    setClientError("");
    setWorkshopError("");
    setDateError("");
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
        4,
      );

      if (!isMounted) {
        return;
      }

      setSlots(nextSlots);
      if (nextSlots.length > 0 && !formData.slotId) {
        setFormData(prev => ({ ...prev, slotId: nextSlots[0].id }));
      }
    }

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [formData.workshopId, i18n.language]);

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

    setFormData((current) => {
      const nextData = { ...current, [name]: value };
      if (name === "workshopId") {
        nextData.date = "";
        nextData.slotId = "";
      }
      return nextData;
    });

    if (name === "email" || name === "phone") setContactError("");
    if (name === "client") setClientError("");
    if (name === "workshopId") setWorkshopError("");
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

  function getAllergyLabel(value) {
    const allergy = COMMON_ALLERGIES.find(item => item.backendValue === value);
    return allergy ? t(`allergies.items.${allergy.id}`) : value;
  }

  function getSelectedAllergyLabels() {
    return [
      ...uiState.selectedAllergies.map(getAllergyLabel),
      uiState.otherAllergies.trim()
    ].filter(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.client.trim()) {
      setClientError(t('errors.client'));
      const el = document.getElementById("client");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.workshopId) {
      setWorkshopError(t('errors.workshop'));
      const el = document.getElementById("workshopId");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.date) {
      setDateError(t('errors.date'));
      const el = document.getElementById("dateBtn");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (!formData.email && !formData.phone) {
      setContactError(t('errors.contact'));
      const el = document.getElementById("email");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    if (uiState.hasAllergies === "yes" && uiState.selectedAllergies.length === 0 && uiState.otherAllergies.trim() === "") {
      setAllergyError(t('errors.allergies'));
      const el = document.getElementById("otherAllergies");
      if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }

    setIsSubmitting(true);

    let finalAllergies = "Ninguna";
    if (uiState.hasAllergies === "yes") {
      const allergiesList = [...uiState.selectedAllergies];
      if (uiState.otherAllergies.trim() !== "") allergiesList.push(uiState.otherAllergies);
      finalAllergies = allergiesList.length > 0 ? allergiesList.join(", ") : "No especificadas";
    }

    try {
      await onSubmit({ ...formData, allergies: finalAllergies });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSubmitDisabled = isSubmitting;
  const tallerSeleccionado = workshops.find(w => String(w.id || w.idTaller) === String(formData.workshopId));
  const fechasPermitidasDelTaller = slots.filter(slot => slot.fecha);
  const selectedAllergyLabels = getSelectedAllergyLabels();

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow={t('eyebrow')}
      title={t('titleCreate')}
      showAction={false}
      modalClassName={styles.modal}
      contentClassName={styles.content}
    >
      <form className={styles.gridForm} onSubmit={handleSubmit} noValidate>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="course">
            {t('courseLabel')}
          </label>
          <input
            id="course"
            className={`${styles.input} ${styles.readonlyInput}`}
            type="text"
            value={courseName}
            readOnly
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="client">
            {t('clientLabel')}
          </label>
          <input
            id="client"
            name="client"
            type="text"
            className={styles.input}
            value={formData.client}
            onChange={handleChange}
            placeholder={t('clientPlaceholder')}
            required
          />
        </div>
        
        {clientError && (
          <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
            {clientError}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            {t('workshopLabel')}
          </label>
          <select
            id="workshopId" name="workshopId" className={styles.select}
            value={String(formData.workshopId)} onChange={handleChange} required
          >
            <option value="" disabled>{t('workshopPlaceholder')}</option>
            {workshops.map((workshop) => {
              const wId = workshop.id || workshop.idTaller;
              const wTitle = workshop.title || workshop.nombreTaller;
              return (
                <option key={wId} value={String(wId)}>
                  {translateWorkshopName(wTitle)}
                </option>
              );
            })}
          </select>
        </div>
        
        {workshopError && (
          <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
            {workshopError}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="dateBtn">
            {t('dateLabel')}
          </label>
          <button 
            id="dateBtn"
            type="button" 
            className={styles.input} 
            style={{ 
              textAlign: 'left', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: formData.workshopId ? 'pointer' : 'not-allowed',
              opacity: formData.workshopId ? 1 : 0.6
            }}
            disabled={!formData.workshopId}
            onClick={() => setIsCalendarOpen(true)}
          >
            <span style={{ color: formData.date ? 'inherit' : 'var(--color-text-muted)' }}>
              {formData.date 
                ? new Date(formData.date).toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' }) 
                : t('datePlaceholder')}
            </span>
            <Calendar size={18} color="var(--color-text-muted)" />
          </button>
        </div>
        
        {dateError && (
          <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
            {dateError}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="email">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder={t('emailPlaceholder')}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="phone">
            {t('phoneLabel')}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('phonePlaceholder')}
          />
        </div>

        {contactError && (
          <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
            {contactError}
          </div>
        )}

        <div className={`${styles.fieldGroup} ${styles.fullWidth} ${styles.allergiesSection}`}>
          <label className={styles.label}>
            {t('allergies.label')}
          </label>
          <p className={styles.helperText}>
            {t('allergies.helper')}
          </p>

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
                {COMMON_ALLERGIES.map(({ id, backendValue, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.cardButton} ${uiState.selectedAllergies.includes(backendValue) ? styles.cardButtonActive : ""}`}
                    onClick={() => handleAllergyToggle(backendValue)}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{t(`allergies.items.${id}`)}</span>
                  </button>
                ))}
              </div>
              <div className={styles.otherAllergyGroup}>
                <label htmlFor="otherAllergies" className={styles.labelSmall}>{t('allergies.otherLabel')}</label>
                <textarea
                  id="otherAllergies" type="text" className={styles.input}
                  placeholder={t('allergies.otherPlaceholder')}
                  value={uiState.otherAllergies}
                  onChange={(e) => {
                    setIsDirty(true);
                    setUiState({ ...uiState, otherAllergies: e.target.value })
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {allergyError && (
          <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
            {allergyError}
          </div>
        )}

        <div className={`${styles.bottomSection} ${styles.fullWidth}`}>
          <div className={styles.summary}>
            <p className={styles.summaryTitle}>{t('summary.title')}</p>
            <p className={styles.summaryText}>
              {t('summary.workshop')} <strong>{tallerSeleccionado ? translateWorkshopName(tallerSeleccionado.title || tallerSeleccionado.nombreTaller) : t('summary.unselected')}</strong>
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
                  ? new Date(formData.date).toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })
                  : t('summary.unselected')}
              </strong>
            </p>
            <p className={styles.summaryText}>
              {t('summary.allergies')} <strong>
                {uiState.hasAllergies === "no" ? t('summary.none') : (selectedAllergyLabels.length > 0 ? selectedAllergyLabels.join(", ") : t('summary.notSpecified'))}
              </strong>
            </p>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={handleClose} disabled={isSubmitting}>
              {t('actions.cancel')}
            </button>
            <button type="submit" className={styles.buttonPrimary} disabled={isSubmitDisabled}>
              {isSubmitting ? t('actions.saving') : t('actions.save')}
            </button>
          </div>
        </div>
      </form>
    </Modal>

    <Modal
      isOpen={showConfirmClose}
      onClose={() => setShowConfirmClose(false)}
      title={t('confirmClose.title')}
      showAction={false}
    >
      <div className={styles.confirmWrapper}>
        <div className={styles.dangerIconBox}>
          <AlertCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
        </div>

        <div className={styles.confirmTextGroup}>
          <p className={styles.confirmQuestion}>{t('confirmClose.question')}</p>
          <h3 className={styles.confirmTargetName}>{t('confirmClose.target')}</h3>
        </div>

        <div className={styles.modalActionsVertical}>
          <button type="button" className={styles.confirmButton} onClick={confirmClose}>
            {t('confirmClose.confirm')}
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => setShowConfirmClose(false)}>
            {t('confirmClose.cancel')}
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
        setFormData(prev => ({ ...prev, date: selectedDate }));
      }}
    />
    </>
  );
}
