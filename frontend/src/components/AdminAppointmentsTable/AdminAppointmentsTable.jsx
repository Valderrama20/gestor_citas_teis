import {
  Calendar,
  CheckCheck,
  Clock3,
  RotateCcw,
  XCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from "lucide-react";
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
  const isAllSelected = appointments.length > 0 && selectedIds.length === appointments.length;

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
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.undoButton}`}
                          onClick={() => onUndo(actionPayload)}
                          title="Volver a pendiente"
                        >
                          <RotateCcw size={14} strokeWidth={1.8} />
                        </button>
                      </>
                    )}

                    {statusKey === "CANCELADA" && (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.undoButton}`}
                        onClick={() => onUndo(actionPayload)}
                      >
                        <RotateCcw size={14} strokeWidth={1.8} /> Deshacer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}