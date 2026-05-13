import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  CheckCheck,
  XCircle,
  Clock,
  Trash2,
  CalendarDays,
  CalendarX // Añadido para el estado vacío
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import AdminAppointmentsTable from "../../components/AdminAppointmentsTable";
import AdminTopbar from "../../components/AdminTopbar";
import CreateAppointmentModal from "../../components/CreateAppointmentModal";
import CreateWorkshopModal from "../../components/CreateWorkshopModal";
import appointmentService from "../../services/appointmentService";
import courseService from "../../services/courseService";
import workshopService from "../../services/workshopService";
import availabilityService from "../../services/availabilityService";
import { useToast } from "../../context/ToastContext";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(undefined);
  const [appointments, setAppointments] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  
  const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false);
  const [isCreateWorkshopModalOpen, setIsCreateWorkshopModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ESTADOS DE SELECCIÓN, ORDENACIÓN Y FECHA
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'asc' });
  const [currentDate, setCurrentDate] = useState(new Date());

  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [nextCourse, nextAppointments, nextWorkshops] = await Promise.all([
          courseService.getCourseById(courseId),
          appointmentService.getAppointmentsByCourseId(courseId),
          workshopService.getWorkshopsByCourseId(courseId),
        ]);

        if (!isMounted) return;

        setCourse(nextCourse);
        setAppointments(nextAppointments);
        setWorkshops(nextWorkshops);
        setSelectedIds([]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, [courseId]);

  // --- LÓGICA DE FILTRO SEMANAL ---
  const weekRange = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
  }, [currentDate]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      // Revisa 'fecha' o 'date' según cómo venga de tu backend
      const rawDate = app.fecha || app.date;
      if (!rawDate) return false;
      const appDate = new Date(rawDate);
      return appDate >= weekRange.monday && appDate <= weekRange.sunday;
    });
  }, [appointments, weekRange]);

  // --- LÓGICA DE ORDENACIÓN (APLICADA SOBRE LAS FILTRADAS) ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    let aValue, bValue;

    switch (sortConfig.key) {
      case 'cliente':
        aValue = (a.cliente?.nombre || a.client || "").toLowerCase();
        bValue = (b.cliente?.nombre || b.client || "").toLowerCase();
        break;
      case 'taller':
        aValue = (a.taller?.nombreTaller || a.workshopTitle || "").toLowerCase();
        bValue = (b.taller?.nombreTaller || b.workshopTitle || "").toLowerCase();
        break;
      case 'fecha':
        aValue = `${a.fecha || a.date || ''} ${a.hora || a.time || ''}`;
        bValue = `${b.fecha || b.date || ''} ${b.hora || b.time || ''}`;
        break;
      case 'estado':
        aValue = (a.estado || "").toLowerCase();
        bValue = (b.estado || "").toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // --- NAVEGACIÓN DE SEMANAS ---
  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
    setSelectedIds([]); // Limpiar selección al cambiar de semana
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
    setSelectedIds([]);
  };

  // --- ACCIONES INDIVIDUALES ---
  async function handleConfirmAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId, appointment, appointmentId: appointment.id, estado: "CONFIRMADA",
    });
    setAppointments(updatedAppointments);
    addToast("Cita confirmada", "success");
  }

  async function handleCancelAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId, appointment, appointmentId: appointment.id, estado: "CANCELADA",
    });
    setAppointments(updatedAppointments);
    addToast("Cita cancelada", "success");
  }

  async function handleUndoAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId, appointment, appointmentId: appointment.id, estado: "PENDIENTE",
    });
    setAppointments(updatedAppointments);
    addToast("Cita restaurada a pendiente", "success");
  }

  // --- ACCIONES EN LOTE (BULK ACTIONS) ---
  function handleToggleSelect(rowId) {
    setSelectedIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  }

  function handleToggleSelectAll(isChecked) {
    if (isChecked) {
      // Seleccionar solo las de la semana visible
      const allIds = sortedAppointments.map((app) => app.idCita ?? app.id ?? `${app.client}-${app.date}-${app.time}`);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  }

  async function handleBulkAction(nuevoEstado) {
    if (selectedIds.length === 0) return;
    try {
      const appointmentsToUpdate = appointments.filter((app) => {
        const rowId = app.idCita ?? app.id ?? `${app.client}-${app.date}-${app.time}`;
        return selectedIds.includes(rowId);
      });

      for (const appointment of appointmentsToUpdate) {
        await appointmentService.updateAppointmentStatus({
          courseId, appointment, appointmentId: appointment.id, estado: nuevoEstado,
        });
      }

      const nextAppointments = await appointmentService.getAppointmentsByCourseId(courseId);
      setAppointments(nextAppointments);
      setSelectedIds([]);
      addToast(`${appointmentsToUpdate.length} citas actualizadas`, "success");
    } catch (error) {
      addToast("Error al actualizar citas", "error");
    }
  }

  async function confirmBulkDelete() {
    try {
      const appointmentsToDelete = appointments.filter((app) => {
        const rowId = app.idCita ?? app.id ?? `${app.client}-${app.date}-${app.time}`;
        return selectedIds.includes(rowId);
      });

      for (const appointment of appointmentsToDelete) {
        await appointmentService.deleteAppointment(appointment.id ?? appointment.idCita);
      }

      const nextAppointments = await appointmentService.getAppointmentsByCourseId(courseId);
      setAppointments(nextAppointments);
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
      addToast(`${appointmentsToDelete.length} citas eliminadas`, "success");
    } catch (error) {
      setIsDeleteDialogOpen(false);
      addToast("Error al eliminar citas", "error");
    }
  }

  // --- CREACIÓN ---
  async function handleCreateAppointment(appointmentData) {
    try {
      await appointmentService.createAppointment({ ...appointmentData, courseId });
      const nextAppointments = await appointmentService.getAppointmentsByCourseId(courseId);
      setAppointments(nextAppointments);
      setIsCreateAppointmentModalOpen(false);
      addToast("Cita creada", "success");
    } catch (error) {
      addToast("Error creando cita", "error");
    }
  }

  async function handleCreateWorkshop(workshopData) {
    try {
      const { horarios, ...datosTaller } = workshopData;
      const tallerCreado = await workshopService.createWorkshop({
        ...datosTaller, idCurso: Number(courseId), 
      });

      const nuevoIdTaller = tallerCreado?.idTaller || tallerCreado?.id;
      if (horarios && horarios.length > 0) {
        for (const horario of horarios) {
          await availabilityService.createSlot({
            ...horario, idTaller: { idTaller: nuevoIdTaller } 
          });
        }
      }

      setIsCreateWorkshopModalOpen(false);
      const nextWorkshops = await workshopService.getWorkshopsByCourseId(courseId);
      setWorkshops(nextWorkshops);
      addToast("Taller creado con éxito", "success");
    } catch (error) {
      addToast("Error al crear taller", "error");
    }
  }

  if (!course) return null;

  return (
    <main className={styles.page}>
      <AdminTopbar
        startContent={<Link to="/admin/cursos" className={styles.textButton}><ChevronLeft size={18} /> Volver a cursos</Link>}
        endContent={<div className={styles.brand}><Settings size={18} /> <span>IES TEIS | {course.nombreCurso}</span></div>}
      />

      <section className={styles.container}>
        <header className={styles.headerRow}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Citas de {course.nombreCurso}</h1>
            <p className={styles.subtitle}>Gestiona el estado de cada cita de forma eficiente.</p>
            
            {/* NUEVO: SELECTOR SEMANAL */}
            <div className={styles.weekPicker}>
              <button onClick={() => setCurrentDate(new Date())} className={styles.todayBtn}>Hoy</button>
              <div className={styles.navButtons}>
                <button onClick={handlePrevWeek} className={styles.navBtn}><ChevronLeft size={20} /></button>
                <div className={styles.currentRange}>
                  <CalendarDays size={16} />
                  <span>
                    {weekRange.monday.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} 
                    {" - "} 
                    {weekRange.sunday.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <button onClick={handleNextWeek} className={styles.navBtn}><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.primaryButton} onClick={() => setIsCreateAppointmentModalOpen(true)}>
              <Plus size={18} /> Nueva cita
            </button>
            <button type="button" className={styles.primaryButton} onClick={() => setIsCreateWorkshopModalOpen(true)}>
              <Plus size={18} /> Crear taller
            </button>
          </div>
        </header>

        {selectedIds.length > 0 && (
          <div className={styles.bulkActionsBar}>
            <span className={styles.bulkText}>
              <strong>{selectedIds.length}</strong> {selectedIds.length === 1 ? 'seleccionada' : 'seleccionadas'}
            </span>
            <div className={styles.bulkButtons}>
              <button onClick={() => handleBulkAction("CONFIRMADA")} className={`${styles.bulkBtn} ${styles.bulkConfirm}`}>
                <CheckCheck size={16} /> Confirmar
              </button>
              <button onClick={() => handleBulkAction("CANCELADA")} className={`${styles.bulkBtn} ${styles.bulkCancel}`}>
                <XCircle size={16} /> Cancelar
              </button>
              <button onClick={() => handleBulkAction("PENDIENTE")} className={`${styles.bulkBtn} ${styles.bulkUndo}`}>
                <Clock size={16} /> Pendiente
              </button>
              <button onClick={() => setIsDeleteDialogOpen(true)} className={`${styles.bulkBtn} ${styles.bulkDelete}`}>
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        )}

        {/* NUEVO: RENDERIZADO CONDICIONAL DE LA TABLA O MENSAJE VACÍO */}
        {sortedAppointments.length > 0 ? (
          <AdminAppointmentsTable
            appointments={sortedAppointments}
            onConfirm={handleConfirmAppointment}
            onCancel={handleCancelAppointment}
            onUndo={handleUndoAppointment}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            requestSort={handleSort}
            sortConfig={sortConfig}
          />
        ) : (
          <div className={styles.noDataContainer}>
            <CalendarX size={48} className={styles.noDataIcon} />
            <h3 className={styles.noDataTitle}>Sin citas para esta semana</h3>
            <button type="button" className={styles.primaryButton} onClick={() => setIsCreateAppointmentModalOpen(true)}>
              <Plus size={18} /> Agendar cita
            </button>
          </div>
        )}
      </section>

      <CreateWorkshopModal isOpen={isCreateWorkshopModalOpen} onClose={() => setIsCreateWorkshopModalOpen(false)} onSubmit={handleCreateWorkshop} courseName={course?.nombreCurso} />
      <CreateAppointmentModal isOpen={isCreateAppointmentModalOpen} onClose={() => setIsCreateAppointmentModalOpen(false)} onSubmit={handleCreateAppointment} courseName={course?.nombreCurso} workshops={workshops} />

      {isDeleteDialogOpen && (
        <div className={styles.overlay}>
          <div className={styles.confirmModal}>
            <h2 className={styles.confirmTitle}>Eliminar citas</h2>
            <p className={styles.confirmText}>
              ¿Deseas eliminar <strong>{selectedIds.length}</strong> cita{selectedIds.length > 1 ? 's' : ''} permanentemente?
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.bulkBtn} onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</button>
              <button type="button" className={styles.dangerButton} onClick={confirmBulkDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}