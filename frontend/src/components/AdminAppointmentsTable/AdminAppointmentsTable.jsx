import {
  Calendar,
  CheckCheck,
  CircleCheckBig,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";
import styles from "./AdminAppointmentsTable.module.css";

export default function AdminAppointmentsTable({
  appointments,
  onConfirm,
  onComplete,
  onCancel,
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Taller</th>
            <th>Fecha / Hora</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <strong>{appointment.client}</strong>
              </td>
              <td>{appointment.workshopTitle}</td>
              <td>
                <div className={styles.dateTime}>
                  <span>
                    <Calendar className={styles.inlineIcon} strokeWidth={1.8} />
                    {appointment.date}
                  </span>
                  <span>
                    <Clock3 className={styles.inlineIcon} strokeWidth={1.8} />
                    {appointment.time}
                  </span>
                </div>
              </td>
              <td>
                <span
                  className={[
                    styles.badge,
                    appointment.status === "Pendiente"
                      ? styles.pending
                      : appointment.status === "Confirmada"
                        ? styles.confirmed
                        : appointment.status === "Completada"
                          ? styles.completed
                          : styles.cancelled,
                  ].join(" ")}
                >
                  {appointment.status}
                </span>
              </td>
              <td>
                {appointment.status === "Pendiente" && (
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.confirmButton}`}
                    onClick={() => onConfirm(appointment)}
                  >
                    <CheckCheck className={styles.actionIcon} strokeWidth={1.8} />
                    Confirmar cita
                  </button>
                )}

                {appointment.status === "Confirmada" && (
                  <div className={styles.actionGroup}>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.completeButton}`}
                      onClick={() => onComplete(appointment)}
                    >
                      <CircleCheckBig
                        className={styles.actionIcon}
                        strokeWidth={1.8}
                      />
                      Finalizar cita
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                      onClick={() => onCancel(appointment)}
                    >
                      <XCircle className={styles.actionIcon} strokeWidth={1.8} />
                      Cancelar cita
                    </button>
                  </div>
                )}

                {appointment.status === "Completada" && (
                  <span className={styles.completedText}>
                    <RotateCcw className={styles.completedIcon} strokeWidth={1.8} />
                    Sin acciones
                  </span>
                )}

                {appointment.status === "Cancelada" && (
                  <span className={styles.completedText}>
                    <RotateCcw className={styles.completedIcon} strokeWidth={1.8} />
                    Sin acciones
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
