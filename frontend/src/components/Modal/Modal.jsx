import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  eyebrow,
  title,
  children,
  actionLabel,
  showAction = true,
  modalClassName = "",
  contentClassName = "",
}) {
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={[styles.modal, modalClassName].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeIconBtn}
          onClick={onClose}
          aria-label={t('modal.closeAria')}
        >
          <X size={20} strokeWidth={2} />
        </button>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h3 id="modal-title" className={styles.title}>
          {title}
        </h3>
        <div
          className={[styles.content, contentClassName].filter(Boolean).join(" ")}
        >
          {children}
        </div>
        {showAction && (
          <button type="button" className={styles.button} onClick={onClose}>
            {actionLabel || t('modal.close')}
          </button>
        )}
      </div>
    </div>
  );
}
