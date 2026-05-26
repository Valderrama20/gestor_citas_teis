import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../Modal";
import workshopService from "../../services/workshopService";
import { useToast } from "../../context/ToastContext";
import styles from "./EditWorkShopModal.module.css";

export default function EditWorkshopModal({ isOpen, onClose, onUpdate, workshop }) {
  const { t } = useTranslation('admin');
  // 1. Usamos los nombres exactos de tu Taller.java
  const [formData, setFormData] = useState({
    nombreTaller: "",
    capacidadMaxima: 15,
    duracionMinutos: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  // 2. Cargamos los datos reales cuando se abre el modal
  useEffect(() => {
    if (isOpen && workshop) {
      setFormData({
        nombreTaller: workshop.nombreTaller || "",
        capacidadMaxima: workshop.capacidadMaxima || 15,
        duracionMinutos: workshop.duracionMinutos || 0,
      });
    }
  }, [isOpen, workshop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si es un número, lo convertimos para que no lo envíe como texto a Java
    const finalValue = (name === "capacidadMaxima" || name === "duracionMinutos")
      ? Number(value)
      : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = workshop.idTaller;

      // Juntamos el taller original con los datos cambiados 
      // (así no perdemos el idCurso ni otros datos que no estamos editando aquí)
      const payload = { ...workshop, ...formData };

      if (workshopService.updateWorkshop) {
        await workshopService.updateWorkshop(id, payload);
      }

      addToast(t('editWorkshop.toasts.success'), "success");
      onUpdate();
      onClose();
    } catch (error) {
      addToast(t('editWorkshop.toasts.error'), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!workshop) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} eyebrow={t('editWorkshop.eyebrow')} title={t('editWorkshop.title')} showAction={false}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>{t('editWorkshop.nameLabel')}</label>
          <input
            name="nombreTaller"
            className={styles.input}
            value={formData.nombreTaller}
            onChange={handleChange}
            required
          />
        </div>

        {/* Añadimos la duración ya que ahora la mostramos en la UI */}
        <div className={styles.field}>
          <label className={styles.label}>{t('editWorkshop.durationLabel')}</label>
          <input
            type="number"
            name="duracionMinutos"
            className={styles.input}
            value={formData.duracionMinutos}
            onChange={handleChange}
            required
            min="1"
            step="5"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{t('editWorkshop.capacityLabel')}</label>
          <input
            type="number"
            name="capacidadMaxima"
            className={styles.input}
            value={formData.capacidadMaxima}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={isSubmitting}>
            {t('editWorkshop.cancel')}
          </button>
          <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
            {isSubmitting ? t('editWorkshop.saving') : t('editWorkshop.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
