import {
  Calendar,
  CheckCheck,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";
import styles from "./AdminAppointmentsTable.module.css";

const STATUS_LABELS = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
};

function getStatusKey(rawStatus) {
  if (!rawStatus) return "PENDIENTE";
  const normalized = String(rawStatus).trim().toUpperCase();
  return STATUS_LABELS[normalized] ? normalized : normalized;
}

function getStatusLabel(rawStatus) {
  const key = getStatusKey(rawStatus);
  return STATUS_LABELS[key] ?? String(rawStatus);
}

function formatTime(rawTime) {
  if (!rawTime) return "";
  const text = String(rawTime);
  return text.length >= 5 ? text.slice(0, 5) : text;
}

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
          {appointments.map((appointment) => {
            const cliente = appointment.cliente ?? {};
            const taller = appointment.taller ?? {};

            const statusKey = getStatusKey(
              appointment.estado ?? appointment.status,
            );
            const statusLabel = getStatusLabel(
              appointment.estado ?? appointment.status,
            );
            const clientName =
              cliente.nombre ||
              appointment.client ||
              cliente.email ||
              "Cliente desconocido";
            const workshopTitle =
              taller.nombreTaller ||
              appointment.workshopTitle ||
              "Taller no encontrado";
            const date = appointment.fecha ?? appointment.date ?? "";
            const time = formatTime(appointment.hora ?? appointment.time);
            const rowId =
              appointment.idCita ??
              appointment.id ??
              `${clientName}-${date}-${time}`;

            const actionPayload = {
              ...appointment,
              id: appointment.id ?? appointment.idCita,
              client: appointment.client ?? clientName,
              workshopTitle: appointment.workshopTitle ?? workshopTitle,
              date,
              time,
              status: statusLabel,
              workshopId:
                appointment.workshopId ??
                (taller.idTaller != null ? String(taller.idTaller) : ""),
              idTaller:
                appointment.idTaller ??
                (taller.idTaller != null ? String(taller.idTaller) : ""),
              idCurso:
                appointment.idCurso ??
                (taller.idCurso != null ? String(taller.idCurso) : ""),
              original: appointment.original ?? appointment,
            };

            return (
              <tr key={rowId}>
                <td>
                  <strong>{clientName}</strong>
                </td>
                <td>{workshopTitle}</td>
                <td>
                  <div className={styles.dateTime}>
                    <span>
                      <Calendar className={styles.inlineIcon} strokeWidth={1.8} />
                      {date}
                    </span>
                    <span>
                      <Clock3 className={styles.inlineIcon} strokeWidth={1.8} />
                      {time}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className={[
                      styles.badge,
                      statusKey === "PENDIENTE"
                        ? styles.pending
                        : statusKey === "CONFIRMADA"
                          ? styles.confirmed
                          : styles.cancelled,
                    ].join(" ")}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td>
                  {statusKey === "PENDIENTE" && (
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.confirmButton}`}
                      onClick={() => onConfirm(actionPayload)}
                    >
                      <CheckCheck
                        className={styles.actionIcon}
                        strokeWidth={1.8}
                      />
                      Confirmar cita
                    </button>
                  )}

                  {statusKey === "CONFIRMADA" && (
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                      onClick={() => onCancel(actionPayload)}
                    >
                      <XCircle className={styles.actionIcon} strokeWidth={1.8} />
                      Cancelar cita
                    </button>
                  )}

                  {statusKey === "CANCELADA" && (
                    <span className={styles.completedText}>
                      <RotateCcw
                        className={styles.completedIcon}
                        strokeWidth={1.8}
                      />
                      Sin acciones
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
