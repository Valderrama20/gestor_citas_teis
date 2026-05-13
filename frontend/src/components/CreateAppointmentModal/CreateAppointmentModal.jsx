import { useEffect, useState } from "react";
import { Droplet, Sparkles, Magnet, Brush, Flower } from "lucide-react";
import availabilityService from "../../services/availabilityService";
import Modal from "../Modal";
import styles from "./CreateAppointmentModal.module.css";

const INITIAL_FORM = {
  client: "",
  email: "",
  phone: "",
  workshopId: "",
  slotId: "",
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
  const [contactError, setContactError] = useState("");
  const [allergyError, setAllergyError] = useState("");

  const [uiState, setUiState] = useState({
    hasAllergies: "no",
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

        return {
          ...current,
          slotId: nextSlotId,
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
    
    setFormData((current) => {
      const nextData = { ...current, [name]: value };
      if (name === "workshopId") nextData.slotId = "";
      return nextData;
    });

    if (name === "email" || name === "phone") setContactError("");
  }

  function handleAllergyToggle(value) {
    setAllergyError("");
    setUiState(prev => {
      const isSelected = prev.selectedAllergies.includes(value);
      if (!isSelected) return { ...prev, selectedAllergies: [...prev.selectedAllergies, value] };
      return { ...prev, selectedAllergies: prev.selectedAllergies.filter(item => item !== value) };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email && !formData.phone) {
      setContactError("Por favor, facilita un correo electrónico o un teléfono de contacto.");
      return;
    }

    if (uiState.hasAllergies === "yes" && uiState.selectedAllergies.length === 0 && uiState.otherAllergies.trim() === "") {
      setAllergyError("Por favor, selecciona al menos una alergia o especifica en el campo 'Otro'.");
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

  const isSubmitDisabled =
    isSubmitting || !formData.workshopId || !formData.slotId;
    
  const tallerSeleccionado = workshops.find(w => String(w.id || w.idTaller) === String(formData.workshopId));
  const horarioSeleccionado = slots.find(s => String(s.id) === String(formData.slotId));

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
      <form className={styles.gridForm} onSubmit={handleSubmit} noValidate>
        
        <div className={styles.fieldGroup}>
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

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="client">
            Nombre completo *
          </label>
          <input
            id="client"
            name="client"
            type="text"
            className={styles.input}
            value={formData.client}
            onChange={handleChange}
            placeholder="Ej. María García"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Taller *
          </label>
          <select
            id="workshopId" name="workshopId" className={styles.select}
            value={String(formData.workshopId)} onChange={handleChange} required
          >
            <option value="" disabled>Selecciona un taller</option>
            {workshops.map((workshop) => {
              const wId = workshop.id || workshop.idTaller;
              const wTitle = workshop.title || workshop.nombreTaller;
              return (
                <option key={wId} value={String(wId)}>
                  {wTitle}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="slotId">
            Día y horario disponible *
          </label>
          <select
            id="slotId"
            name="slotId"
            className={styles.select}
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

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="phone">
            Teléfono de contacto
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ej. 600 000 000"
          />
        </div>

        {contactError && (
          <div className={`${styles.fullWidth} ${styles.errorMessage}`}>
            {contactError}
          </div>
        )}

        <div className={`${styles.fieldGroup} ${styles.fullWidth} ${styles.allergiesSection}`}>
          <label className={styles.label}>
            Alergias o contraindicaciones importantes
          </label>
          <p className={styles.helperText}>
            Selecciona si tiene alguna sensibilidad relevante.
          </p>

          <div className={styles.cardSelector}>
            <button
              type="button"
              className={`${styles.cardButton} ${uiState.hasAllergies === "no" ? styles.cardButtonActive : ""}`}
              onClick={() => {
                setAllergyError("");
                setUiState({ ...uiState, hasAllergies: "no" });
              }}
            >
              <span>No tiene alergias conocidas</span>
            </button>
            <button
              type="button"
              className={`${styles.cardButton} ${uiState.hasAllergies === "yes" ? styles.cardButtonActive : ""}`}
              onClick={() => {
                setAllergyError("");
                setUiState({ ...uiState, hasAllergies: "yes" });
              }}
            >
              <span>Sí, tiene alguna alergia</span>
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
                  id="otherAllergies" type="text" className={styles.input}
                  placeholder="Ej. Piel rosácea..."
                  value={uiState.otherAllergies}
                  onChange={(e) => setUiState({ ...uiState, otherAllergies: e.target.value })}
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
            <p className={styles.summaryTitle}>Resumen de la cita</p>
            <p className={styles.summaryText}>
              Taller: <strong>{tallerSeleccionado ? (tallerSeleccionado.title || tallerSeleccionado.nombreTaller) : "Sin seleccionar"}</strong>
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

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.buttonPrimary} disabled={isSubmitDisabled}>
              {isSubmitting ? "Guardando..." : "Guardar cita"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
