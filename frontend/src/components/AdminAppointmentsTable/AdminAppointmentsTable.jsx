import { Calendar, Clock3, UserCheck } from "lucide-react";
import styles from "./AdminAppointmentsTable.module.css";

export default function AdminAppointmentsTable({ appointments, onAssign }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Taller</th>
            <th>Fecha / Hora</th>
            <th>Estado</th>
            <th>Asignacion</th>
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
                  className={
                    appointment.status === "Pendiente"
                      ? `${styles.badge} ${styles.pending}`
                      : `${styles.badge} ${styles.assigned}`
                  }
                >
                  {appointment.status}
                </span>
              </td>
              <td>
                {appointment.studentName ? (
                  appointment.studentName
                ) : (
                  <span className={styles.muted}>Sin alumno</span>
                )}
              </td>
              <td>
                {appointment.status === "Pendiente" && (
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => onAssign(appointment)}
                  >
                    <UserCheck className={styles.actionIcon} strokeWidth={1.8} />
                    Asignar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
