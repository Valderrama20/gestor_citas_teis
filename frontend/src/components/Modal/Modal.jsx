import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  eyebrow,
  title,
  children,
  actionLabel = "Cerrar",
  showAction = true,
  modalClassName = "",
  contentClassName = "",
}) {
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
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
