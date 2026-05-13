import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Sparkles, Scissors, Droplets, Waves, Brush, Flower, Hand, Paintbrush, Palette, Gem, Heart, Smile, Wind, Sun, Moon, Star, Gift, Award, Feather, Leaf, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../Modal";
import styles from "./CreateWorkshopModal.module.css";

const INITIAL_FORM = {
  nombreTaller: "",
  descripcion: "",
  icono: "sparkles",
  duracionMinutos: 60,
  capacidadMaxima: 10,
};

const DEFAULT_HORARIO = { diaSemana: "Lunes", horaApertura: "09:00", horaCierre: "14:00" };

const ALL_ICONS = [
  { id: "sparkles", label: "Estética", icon: Sparkles },
  { id: "scissors", label: "Peluquería", icon: Scissors },
  { id: "brush", label: "Maquillaje", icon: Brush },
  { id: "droplets", label: "Lavado", icon: Droplets },
  { id: "waves", label: "Tratamientos", icon: Waves },
  { id: "hand", label: "Manos", icon: Hand },
  { id: "flower", label: "Bienestar", icon: Flower },
  { id: "leaf", label: "Natural", icon: Leaf },
  { id: "gem", label: "Joyas", icon: Gem },
  { id: "heart", label: "Favorito", icon: Heart },
  { id: "star", label: "Estrella", icon: Star },
  { id: "award", label: "Premio", icon: Award },
  { id: "gift", label: "Regalo", icon: Gift },
  { id: "palette", label: "Color", icon: Palette },
  { id: "paintbrush", label: "Pintura", icon: Paintbrush },
  { id: "shopping-bag", label: "Venta", icon: ShoppingBag },
  { id: "sun", label: "Día", icon: Sun },
  { id: "moon", label: "Noche", icon: Moon },
  { id: "wind", label: "Aire", icon: Wind },
  { id: "smile", label: "Facial", icon: Smile },
  { id: "feather", label: "Ligero", icon: Feather },
];

export default function CreateWorkshopModal({
  isOpen,
  onClose,
  onSubmit,
  courseName,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [horarios, setHorarios] = useState([{ ...DEFAULT_HORARIO }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const iconContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM);
      setHorarios([{ ...DEFAULT_HORARIO }]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleAddHorario() {
    setHorarios([...horarios, { ...DEFAULT_HORARIO }]);
  }

  function handleRemoveHorario(index) {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(nuevosHorarios);
  }

  function handleHorarioChange(index, field, value) {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][field] = value;
    setHorarios(nuevosHorarios);
  }

  const scrollIcons = (direction) => {
    if (iconContainerRef.current) {
      const scrollAmount = 250;
      iconContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        duracionMinutos: Number(formData.duracionMinutos),
        capacidadMaxima: Number(formData.capacidadMaxima),
        tipoTaller: courseName,
        horarios: horarios.map(h => ({
          ...h,
          horaApertura: h.horaApertura.length === 5 ? `${h.horaApertura}:00` : h.horaApertura,
          horaCierre: h.horaCierre.length === 5 ? `${h.horaCierre}:00` : h.horaCierre,
        }))
      };

      await onSubmit(dataToSend);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Panel administrativo"
      title="Crear nuevo taller"
      showAction={false}
      modalClassName={styles.modal}
      contentClassName={styles.content}
    >
      <form className={styles.form} onSubmit={handleSubmit}>

        {/* CAMPOS BÁSICOS DEL TALLER */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="nombreTaller">Nombre del taller</label>
          <input
            id="nombreTaller" name="nombreTaller" type="text"
            className={styles.input} value={formData.nombreTaller}
            onChange={handleChange} required
          />
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
              {ALL_ICONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`${styles.iconButton} ${formData.icono === id ? styles.iconButtonActive : ""}`}
                  onClick={() => setFormData((current) => ({ ...current, icono: id }))}
                  aria-label={`Seleccionar icono ${label}`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              ))}
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label} htmlFor="duracionMinutos">Duración (min)</label>
            <input
              id="duracionMinutos" name="duracionMinutos" type="number"
              className={styles.input} value={formData.duracionMinutos}
              onChange={handleChange} required
            />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label} htmlFor="capacidadMaxima">Capacidad máx.</label>
            <input
              id="capacidadMaxima" name="capacidadMaxima" type="number"
              className={styles.input} value={formData.capacidadMaxima}
              onChange={handleChange} required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion" name="descripcion" className={styles.textarea} rows="3"
            value={formData.descripcion} onChange={handleChange} required
          />
        </div>

        <hr style={{ margin: '1rem 0', borderColor: 'var(--color-border-field)', opacity: 0.3 }} />

        {/* ZONA DE HORARIOS DINÁMICOS */}
        <div className={styles.field}>
          <label className={styles.label}>Disponibilidad Semanal</label>

          {horarios.map((horario, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>

              <select
                className={styles.input} style={{ flex: 1.5 }}
                value={horario.diaSemana}
                onChange={(e) => handleHorarioChange(index, "diaSemana", e.target.value)}
              >
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>

              <input
                type="time" className={styles.input} style={{ flex: 1 }}
                value={horario.horaApertura}
                onChange={(e) => handleHorarioChange(index, "horaApertura", e.target.value)} required
              />

              <span style={{ color: 'var(--color-text-muted)' }}>a</span>

              <input
                type="time" className={styles.input} style={{ flex: 1 }}
                value={horario.horaCierre}
                onChange={(e) => handleHorarioChange(index, "horaCierre", e.target.value)} required
              />

              {horarios.length > 1 && (
                <button
                  type="button" onClick={() => handleRemoveHorario(index)}
                  style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button" onClick={handleAddHorario}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'transparent', border: 'none', color: 'var(--color-accent)', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            <Plus size={16} /> Añadir otro día
          </button>
        </div>

        <div className={styles.actions} style={{ marginTop: '2rem' }}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear taller"}
          </button>
        </div>
      </form>
    </Modal>
  );
}