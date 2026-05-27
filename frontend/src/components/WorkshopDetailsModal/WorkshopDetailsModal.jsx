import Modal from "../Modal";
import styles from "./WorkshopDetailsModal.module.css"; 
import { useTranslation } from "react-i18next";
import { translateWorkshopName } from "../../utils/translateCatalog";

export default function WorkshopDetailsModal({ isOpen, onClose, workshop }) {
  const { t } = useTranslation('admin');

  if (!workshop) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      eyebrow={t('workshopDetails.eyebrow')} 
      title={translateWorkshopName(workshop.nombre_taller || workshop.nombreTaller || workshop.title)} 
      showAction={false}
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>{t('workshopDetails.statusLabel')}</label>
            <input className={styles.readonlyInput} value={t('workshopDetails.statusActive')} readOnly />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('workshopDetails.capacityLabel')}</label>
            <input className={styles.readonlyInput} value={`${workshop.capacidad || 15} ${t('workshopDetails.capacitySuffix')}`} readOnly />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{t('workshopDetails.slotsLabel')}</label>
          <textarea 
            className={styles.readonlyInput} 
            value={workshop.turnos || t('workshopDetails.noSlots')} 
            readOnly 
            rows="3"
          />
        </div>

        
      </div>
    </Modal>
  );
}