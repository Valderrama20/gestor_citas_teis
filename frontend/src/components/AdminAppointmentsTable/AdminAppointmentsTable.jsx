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
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import Modal from "../Modal";
import { useTranslation } from "react-i18next";
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

function getStatusLabel(rawStatus, t) {
  const key = getStatusKey(rawStatus);
  return t(`appointmentsTable.status.${key}`, { defaultValue: STATUS_LABELS[key] ?? String(rawStatus) });
}

function formatTime(rawTime) {
  if (!rawTime) return "";
  const text = String(rawTime);
  return text.length >= 5 ? text.slice(0, 5) : text;
}

function getAppointmentDetails(appointment, t) {
  const original = appointment?.original ?? {};
  const cliente = appointment?.cliente ?? original.cliente ?? {};
  const taller = appointment?.taller ?? original.taller ?? {};

  const date = appointment?.fecha ?? appointment?.date ?? original.fecha ?? "";
  const time = formatTime(appointment?.hora ?? appointment?.time ?? original.hora);
  const status = appointment?.estado ?? appointment?.status ?? original.estado;

  return {
    id: appointment?.id ?? appointment?.idCita ?? original.idCita ?? t('appointmentsTable.defaults.noId'),
    clientName:
      cliente.nombre ||
      appointment?.client ||
      appointment?.nombre ||
      cliente.email ||
      t('appointmentsTable.defaults.unknownClient'),
    email: cliente.email || appointment?.email || t('appointmentsTable.defaults.notSpecified'),
    phone:
      cliente.telefono ||
      cliente.phone ||
      appointment?.telefono ||
      appointment?.phone ||
      t('appointmentsTable.defaults.notSpecified'),
    workshopTitle:
      taller.nombreTaller ||
      appointment?.workshopTitle ||
      appointment?.nombreTaller ||
      t('appointmentsTable.defaults.workshopNotFound'),
    workshopId:
      taller.idTaller ||
      taller.id_taller ||
      appointment?.workshopId ||
      appointment?.idTaller ||
      t('appointmentsTable.defaults.notSpecified'),
    date: date || t('appointmentsTable.defaults.notSpecified'),
    time: time || t('appointmentsTable.defaults.notSpecified'),
    statusKey: getStatusKey(status),
    statusLabel: getStatusLabel(status, t),
    notes:
      cliente.notasAlergias ||
      appointment?.allergies ||
      appointment?.alergias ||
      appointment?.notes ||
      t('appointmentsTable.defaults.noNotes'),
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
  const { t } = useTranslation('admin');
  const [detailsAppointment, setDetailsAppointment] = useState(null);
  const isAllSelected = appointments.length > 0 && selectedIds.length === appointments.length;
  const appointmentDetails = detailsAppointment ? getAppointmentDetails(detailsAppointment, t) : null;

  // Lógica para el acordeón móvil
  const [expandedRows, setExpandedRows] = useState([]);
  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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
      <table className={`${styles.table} ${styles.desktopTable}`}>
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
                {t('appointmentsTable.headers.client')} {renderSortIcon('cliente')}
              </div>
            </th>
            <th onClick={() => requestSort('taller')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                {t('appointmentsTable.headers.workshop')} {renderSortIcon('taller')}
              </div>
            </th>
            <th onClick={() => requestSort('fecha')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                {t('appointmentsTable.headers.dateTime')} {renderSortIcon('fecha')}
              </div>
            </th>
            <th onClick={() => requestSort('estado')} className={styles.sortableHeader}>
              <div className={styles.headerContent}>
                {t('appointmentsTable.headers.status')} {renderSortIcon('estado')}
              </div>
            </th>
            <th>{t('appointmentsTable.headers.action')}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const cliente = appointment.cliente ?? {};
            const taller = appointment.taller ?? {};

            const statusKey = getStatusKey(appointment.estado ?? appointment.status);
            const statusLabel = getStatusLabel(appointment.estado ?? appointment.status, t);

            const clientName = cliente.nombre || appointment.client || cliente.email || t('appointmentsTable.defaults.unknownClient');
            const workshopTitle = taller.nombreTaller || appointment.workshopTitle || t('appointmentsTable.defaults.workshopNotFound');
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
                        <CheckCheck size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.confirm')}
                      </button>
                    )}

                    {statusKey === "CONFIRMADA" && (
                      <>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.cancelButton}`}
                          onClick={() => onCancel(actionPayload)}
                        >
                          <XCircle size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.cancel')}
                        </button>
                        {/* <button
                          type="button"
                          className={`${styles.actionButton} ${styles.undoButton}`}
                          onClick={() => onUndo(actionPayload)}
                          title={t('appointmentsTable.actions.undoTitle')}
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
                    <RotateCcw size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.undo')}
                      </button>
                    )} */}

                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.detailsButton}`}
                      onClick={() => setDetailsAppointment(actionPayload)}
                    >
                      <Eye size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.view')}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* --- VISTA MOBILE: Acordeón --- */}
      <div className={styles.mobileList}>
        {appointments.length > 0 && (
          <div className={styles.mobileSelectAll}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isAllSelected}
              onChange={(e) => onToggleSelectAll(e.target.checked)}
            />
            <span className={styles.mobileLabel}>Seleccionar todos</span>
          </div>
        )}
        
        {appointments.map((appointment) => {
          const cliente = appointment.cliente ?? {};
          const taller = appointment.taller ?? {};

          const statusKey = getStatusKey(appointment.estado ?? appointment.status);
          const statusLabel = getStatusLabel(appointment.estado ?? appointment.status, t);

          const clientName = cliente.nombre || appointment.client || cliente.email || t('appointmentsTable.defaults.unknownClient');
          const workshopTitle = taller.nombreTaller || appointment.workshopTitle || t('appointmentsTable.defaults.workshopNotFound');
          const date = appointment.fecha ?? appointment.date ?? "";
          const time = formatTime(appointment.hora ?? appointment.time);

          const rowId = appointment.idCita ?? appointment.id ?? `${clientName}-${date}-${time}`;
          const isSelected = selectedIds.includes(rowId);
          const isExpanded = expandedRows.includes(rowId);

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
            <div key={rowId} className={`${styles.mobileCard} ${isSelected ? styles.selectedRow : ""}`}>
              <div className={styles.mobileHeader} onClick={() => toggleRow(rowId)}>
                <button className={styles.expandBtn} aria-label={isExpanded ? "Contraer fila" : "Desplegar fila"}>
                  {isExpanded ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
                </button>
                <div className={styles.mobileMainInfo}>
                  <span className={styles.mobileLabel}>{t('appointmentsTable.headers.client')}</span>
                  <span className={styles.mobileValue}>{clientName}</span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.mobileDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.mobileLabel}>{t('appointmentsTable.headers.workshop')}</span>
                    <span className={styles.mobileValue}>{workshopTitle}</span>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.mobileLabel}>{t('appointmentsTable.headers.dateTime')}</span>
                    <span className={styles.mobileValue}>
                      <Calendar size={14} style={{ marginRight: 6 }} /> {date} 
                      <Clock3 size={14} style={{ marginLeft: 12, marginRight: 6 }} /> {time}
                    </span>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.mobileLabel}>{t('appointmentsTable.headers.status')}</span>
                    <span className={`${styles.badge} ${styles[statusKey.toLowerCase()]}`}>
                      {statusLabel}
                    </span>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.mobileLabel}>{t('appointmentsTable.headers.action')}</span>
                    <div className={styles.actionGroup}>
                      {statusKey === "PENDIENTE" && (
                        <button type="button" className={`${styles.actionButton} ${styles.confirmButton}`} onClick={() => onConfirm(actionPayload)}>
                          <CheckCheck size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.confirm')}
                        </button>
                      )}
                      {statusKey === "CONFIRMADA" && (
                        <button type="button" className={`${styles.actionButton} ${styles.cancelButton}`} onClick={() => onCancel(actionPayload)}>
                          <XCircle size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.cancel')}
                        </button>
                      )}
                      <button type="button" className={`${styles.actionButton} ${styles.detailsButton}`} onClick={() => setDetailsAppointment(actionPayload)}>
                        <Eye size={14} strokeWidth={1.8} /> {t('appointmentsTable.actions.view')}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.mobileLabel}>Selec.</span>
                    <div className={styles.mobileValue}>
                        <input type="checkbox" className={styles.checkbox} checked={isSelected} onChange={() => onToggleSelect(rowId)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(appointmentDetails)}
        onClose={() => setDetailsAppointment(null)}
        title={t('appointmentsTable.details.modalTitle')}
        showAction={false}
        modalClassName={styles.detailsModal}
      >
        {appointmentDetails && (
          <div className={styles.detailsContent}>
            <div className={styles.detailsSummary}>
              <div>
                <span className={styles.detailsLabel}>{t('appointmentsTable.details.status')}</span>
                <span
                  className={`${styles.badge} ${styles[appointmentDetails.statusKey.toLowerCase()]}`}
                >
                  {appointmentDetails.statusLabel}
                </span>
              </div>
              <div>
                <span className={styles.detailsLabel}>{t('appointmentsTable.details.reference')}</span>
                <strong>#{appointmentDetails.id}</strong>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailsItem}>
                <User size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>{t('appointmentsTable.details.client')}</span>
                  <strong>{appointmentDetails.clientName}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Mail size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>{t('appointmentsTable.details.email')}</span>
                  <strong>{appointmentDetails.email}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Phone size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>{t('appointmentsTable.details.phone')}</span>
                  <strong>{appointmentDetails.phone}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <MapPin size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>{t('appointmentsTable.details.workshop')}</span>
                  <strong>{appointmentDetails.workshopTitle}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Calendar size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>{t('appointmentsTable.details.date')}</span>
                  <strong>{appointmentDetails.date}</strong>
                </div>
              </div>
              <div className={styles.detailsItem}>
                <Clock3 size={17} strokeWidth={1.8} />
                <div>
                  <span className={styles.detailsLabel}>{t('appointmentsTable.details.time')}</span>
                  <strong>{appointmentDetails.time}</strong>
                </div>
              </div>
            </div>

            <div className={styles.detailsNotes}>
              <NotebookText size={17} strokeWidth={1.8} />
              <div>
                <span className={styles.detailsLabel}>{t('appointmentsTable.details.notes')}</span>
                <p>{appointmentDetails.notes}</p>
              </div>
            </div>

            <div className={styles.detailsActions}>
              <button
                type="button"
                className={styles.closeDetailsButton}
                onClick={() => setDetailsAppointment(null)}
              >
                {t('appointmentsTable.details.close')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
