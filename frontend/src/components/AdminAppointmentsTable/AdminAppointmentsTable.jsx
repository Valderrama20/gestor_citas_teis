import {
  Calendar,
  CheckCheck,
  Clock3,
  Eye,
  Mail,
  MapPin,
  NotebookText,
  Phone,
  RotateCcw,
  User,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from "lucide-react";
import { useState } from "react";
import Modal from "../Modal";
import styles from "./AdminAppointmentsTable.module.css";

const STATUS_LABELS = {
  PENDIENTE: "PENDIENTE",
  CONFIRMADA: "CONFIRMADA",
  CANCELADA: "CANCELADA",
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

function getAppointmentDetails(appointment) {
  const original = appointment?.original ?? {};
  const cliente = appointment?.cliente ?? original.cliente ?? {};
  const taller = appointment?.taller ?? original.taller ?? {};

  const date = appointment?.fecha ?? appointment?.date ?? original.fecha ?? "";
  const time = formatTime(appointment?.hora ?? appointment?.time ?? original.hora);
  const status = appointment?.estado ?? appointment?.status ?? original.estado;

  return {
    id: appointment?.id ?? appointment?.idCita ?? original.idCita ?? "Sin identificador",
    clientName:
      cliente.nombre ||
      appointment?.client ||
      appointment?.nombre ||
      cliente.email ||
      "Cliente desconocido",
    email: cliente.email || appointment?.email || "No especificado",
    phone:
      cliente.telefono ||
      cliente.phone ||
      appointment?.telefono ||
      appointment?.phone ||
      "No especificado",
    workshopTitle:
      taller.nombreTaller ||
      appointment?.workshopTitle ||
      appointment?.nombreTaller ||
      "Taller no encontrado",
    workshopId:
      taller.idTaller ||
      taller.id_taller ||
      appointment?.workshopId ||
      appointment?.idTaller ||
      "No especificado",
    date: date || "No especificada",
    time: time || "No especificada",
    statusKey: getStatusKey(status),
    statusLabel: getStatusLabel(status),
    notes:
      cliente.notasAlergias ||
      appointment?.allergies ||
      appointment?.alergias ||
      appointment?.notes ||
      "Sin notas registradas",
  };
}

export default function AdminAppointmentsTable({
  appointments,
  onConfirm,
  onCancel,
  onUndo,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  requestSort, // 🆕 Prop para manejar el clic en cabeceras
  sortConfig,  // 🆕 Prop para saber qué columna está ordenada
}) {
  const [detailsAppointment, setDetailsAppointment] = useState(null);
  const isAllSelected = appointments.length > 0 && selectedIds.length === appointments.length;
  const appointmentDetails = detailsAppointment ? getAppointmentDetails(detailsAppointment) : null;

  // Función para renderizar el icono de ordenación según el estado
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className={styles.sortIconPlaceholder} />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className={styles.sortIconActive} /> 
      : <ArrowDown size={14} className={styles.sortIconActive} />;
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCell}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                onChange={(e) => onToggleSelectAll(e.target.checked)}
              />
            </th>
            {/* Cabeceras clicables para ordenar */}
            <th onClick={() => requestSort('cliente')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                Cliente {renderSortIcon('cliente')}
              </div>
            </th>
            <th onClick={() => requestSort('taller')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                Taller {renderSortIcon('taller')}
              </div>
            </th>
            <th onClick={() => requestSort('fecha')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                Fecha / Hora {renderSortIcon('fecha')}
              </div>
            </th>
            <th onClick={() => requestSort('estado')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                Estado {renderSortIcon('estado')}
              </div>
            </th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const cliente = appointment.cliente ?? {};
            const taller = appointment.taller ?? {};

            const statusKey = getStatusKey(appointment.estado ?? appointment.status);
            const statusLabel = getStatusLabel(appointment.estado ?? appointment.status);
            
            const clientName = cliente.nombre || appointment.client || cliente.email || "Cliente desconocido";
            const workshopTitle = taller.nombreTaller || appointment.workshopTitle || "Taller no encontrado";
            const date = appointment.fecha ?? appointment.date ?? "";
            const time = formatTime(appointment.hora ?? appointment.time);
            
            const rowId = appointment.idCita ?? appointment.id ?? `${clientName}-${date}-${time}`;
            const isSelected = selectedIds.includes(rowId);

            const actionPayload = {
              ...appointment,
              id: appointment.id ?? appointment.idCita,
              client: clientName,
              workshopTitle: workshopTitle,
              date,
              time,
              status: statusLabel,
            };

            return (
              <tr key={rowId} className={isSelected ? styles.selectedRow : ""}>
                <td className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={() => onToggleSelect(rowId)}
                  />
                </td>
                <td>
                  <strong>{clientName}</strong>
                </td>
                <td>{workshopTitle}</td>
                <td>
                  <div className={styles.dateTime}>
                    <span><Calendar size={14} strokeWidth={1.8} /> {date}</span>
                    <span><Clock3 size={14} strokeWidth={1.8} /> {time}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[statusKey.toLowerCase()]}`}>
                    {statusLabel}
                  </span>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    {statusKey === "PENDIENTE" && (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.confirmButton}`}
                        onClick={() => onConfirm(actionPayload)}
                      >
                        <CheckCheck size={14} strokeWidth={1.8} /> Confirmar
                      </button>
                    )}

                    {statusKey === "CONFIRMADA" && (
                      <>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.cancelButton}`}
                          onClick={() => onCancel(actionPayload)}
                        >
                          <XCircle size={14} strokeWidth={1.8} /> Cancelar
                        </button>
                        {/* <button
                          type="button"
                          className={`${styles.actionButton} ${styles.undoButton}`}
                          onClick={() => onUndo(actionPayload)}
                          title="Volver a pendiente"
                        >
                          <RotateCcw size={14} strokeWidth={1.8} />
                        </button> */}
                      </>
                    )}

                    {/* {statusKey === "CANCELADA" && (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.undoButton}`}
                        onClick={() => onUndo(actionPayload)}
                      >
                        <RotateCcw size={14} strokeWidth={1.8} /> Deshacer
                      </button>
                    )} */}

                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.detailsButton}`}
                      onClick={() => setDetailsAppointment(actionPayload)}
                    >
                      <Eye size={14} strokeWidth={1.8} /> Ver
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal
        isOpen={Boolean(appointmentDetails)}
        onClose={() => setDetailsAppointment(null)}
        title="Detalles de cita"
        showAction={false}
        modalClassName={styles.detailsModal}
      >
        {appointmentDetails && (
          <div className={styles.detailsContent}>
            <div className={styles.detailsSummary}>
              <div>
                <span className={styles.detailsLabel}>Estado actual</span>
                <span
                  className={`${styles.badge} ${styles[appointmentDetails.statusKey.toLowerCase()]}`}
                >
                  {appointmentDetails.statusLabel}
                </span>
              </div>
              <div>
                <span className={styles.detailsLabel}>Referencia</span>
                <strong>#{appointmentDetails.id}</strong>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailsItem}>
                <User size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>Cliente</span>
                  <strong>{appointmentDetails.clientName}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Mail size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>Correo electronico</span>
                  <strong>{appointmentDetails.email}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Phone size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>Telefono</span>
                  <strong>{appointmentDetails.phone}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <MapPin size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>Taller</span>
                  <strong>{appointmentDetails.workshopTitle}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Calendar size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>Fecha</span>
                  <strong>{appointmentDetails.date}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Clock3 size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>Hora</span>
                  <strong>{appointmentDetails.time}</strong>
                </div>
              </div>
            </div>

            <div className={styles.detailsNotes}>
              <NotebookText size={17} strokeWidth={1.8} />
              <div>
                <span className={styles.detailsLabel}>Notas y alergias</span>
                <p>{appointmentDetails.notes}</p>
              </div>
            </div>

            <div className={styles.detailsActions}>
              <button
                type="button"
                className={styles.closeDetailsButton}
                onClick={() => setDetailsAppointment(null)}
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
