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
  CalendarX,
  Briefcase,
  Users,
  CalendarCheck,
  FilterX,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import AdminAppointmentsTable from "../../components/AdminAppointmentsTable";
import AdminTopbar from "../../components/AdminTopbar";
import CreateAppointmentModal from "../../components/CreateAppointmentModal";
import CreateWorkshopModal from "../../components/CreateWorkshopModal";
import EditWorkshopModal from "../../components/EditWorkShopModal";
import WorkshopDetailsModal from "../../components/WorkshopDetailsModal";
import Modal from "../../components/Modal";
import WorkshopIcon from "../../components/WorkshopIcon";
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

  const [activeTab, setActiveTab] = useState("citas");
  const [filterWorkshopId, setFilterWorkshopId] = useState(null);

  const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] =
    useState(false);
  const [isCreateWorkshopModalOpen, setIsCreateWorkshopModalOpen] =
    useState(false);
  const [isEditWorkshopModalOpen, setIsEditWorkshopModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "fecha",
    direction: "asc",
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    loadDashboardData();
    return () => {
      isMounted = false;
    };

    async function loadDashboardData() {
      try {
        const [nextCourse, nextAppointments, nextWorkshops] = await Promise.all(
          [
            courseService.getCourseById(courseId),
            appointmentService.getAppointmentsByCourseId(courseId),
            workshopService.getWorkshopsByCourseId(courseId),
          ],
        );

        if (!isMounted) return;

        setCourse(nextCourse);
        setAppointments(nextAppointments || []);
        setWorkshops(nextWorkshops || []);
        setSelectedIds([]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    }
  }, [courseId]);

  const refreshData = async () => {
    try {
      const [nextAppointments, nextWorkshops] = await Promise.all([
        appointmentService.getAppointmentsByCourseId(courseId),
        workshopService.getWorkshopsByCourseId(courseId),
      ]);
      setAppointments(nextAppointments || []);
      setWorkshops(nextWorkshops || []);
    } catch (error) {
      console.error("Error recargando datos:", error);
    }
  };

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
    return appointments.filter((app) => {
      const rawDate = app.fecha || app.date;
      if (!rawDate) return false;
      const appDate = new Date(rawDate);
      const inWeek = appDate >= weekRange.monday && appDate <= weekRange.sunday;

      if (filterWorkshopId) {
        const appId =
          app.taller?.id_taller || app.taller?.idTaller || app.workshopId;
        return inWeek && String(appId) === String(filterWorkshopId);
      }

      return inWeek;
    });
  }, [appointments, weekRange, filterWorkshopId]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const aValue = a.fecha || a.date || "";
    const bValue = b.fecha || b.date || "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
    setSelectedIds([]);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
    setSelectedIds([]);
  };

  const handleWorkshopClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (e, workshop) => {
    e.stopPropagation();
    setSelectedWorkshop(workshop);
    setIsEditWorkshopModalOpen(true);
  };

  const goToFilteredAppointments = (e, workshopId) => {
    e.stopPropagation();
    setFilterWorkshopId(workshopId);
    setActiveTab("citas");
  };

  async function handleConfirmAppointment(appointment) {
    const updatedAppointments =
      await appointmentService.updateAppointmentStatus({
        courseId,
        appointment,
        appointmentId: appointment.id,
        estado: "CONFIRMADA",
      });
    setAppointments(updatedAppointments);
    addToast("Cita confirmada", "success");
  }

  async function handleCancelAppointment(appointment) {
    const updatedAppointments =
      await appointmentService.updateAppointmentStatus({
        courseId,
        appointment,
        appointmentId: appointment.id,
        estado: "CANCELADA",
      });
    setAppointments(updatedAppointments);
    addToast("Cita cancelada", "success");
  }

  async function handleUndoAppointment(appointment) {
    const updatedAppointments =
      await appointmentService.updateAppointmentStatus({
        courseId,
        appointment,
        appointmentId: appointment.id,
        estado: "PENDIENTE",
      });
    setAppointments(updatedAppointments);
    addToast("Cita restaurada a pendiente", "success");
  }

  function handleToggleSelect(rowId) {
    setSelectedIds((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  }

  function handleToggleSelectAll(isChecked) {
    if (isChecked) {
      const allIds = sortedAppointments.map(
        (app) =>
          app.idCita ?? app.id ?? `${app.client}-${app.date}-${app.time}`,
      );
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  }

  async function handleBulkAction(nuevoEstado) {
    if (selectedIds.length === 0) return;
    try {
      const appointmentsToUpdate = appointments.filter((app) => {
        const rowId =
          app.idCita ?? app.id ?? `${app.client}-${app.date}-${app.time}`;
        return selectedIds.includes(rowId);
      });

      for (const appointment of appointmentsToUpdate) {
        await appointmentService.updateAppointmentStatus({
          courseId,
          appointment,
          appointmentId: appointment.id,
          estado: nuevoEstado,
        });
      }

      await refreshData();
      setSelectedIds([]);
      addToast(`${appointmentsToUpdate.length} citas actualizadas`, "success");
    } catch (error) {
      addToast("Error al actualizar citas", "error");
    }
  }

  async function confirmBulkDelete() {
    try {
      const appointmentsToDelete = appointments.filter((app) => {
        const rowId =
          app.idCita ?? app.id ?? `${app.client}-${app.date}-${app.time}`;
        return selectedIds.includes(rowId);
      });

      for (const appointment of appointmentsToDelete) {
        await appointmentService.deleteAppointment(
          appointment.id ?? appointment.idCita,
        );
      }

      await refreshData();
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
      addToast(`${appointmentsToDelete.length} citas eliminadas`, "success");
    } catch (error) {
      setIsDeleteDialogOpen(false);
      addToast("Error al eliminar citas", "error");
    }
  }

  async function handleCreateAppointment(appointmentData) {
    try {
      await appointmentService.createAppointment({
        ...appointmentData,
        courseId,
      });
      await refreshData();
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
        ...datosTaller,
        idCurso: Number(courseId),
      });

      const nuevoIdTaller = tallerCreado?.idTaller || tallerCreado?.id;
      if (horarios && horarios.length > 0) {
        for (const horario of horarios) {
          await availabilityService.createSlot({
            ...horario,
            idTaller: { idTaller: nuevoIdTaller },
          });
        }
      }

      setIsCreateWorkshopModalOpen(false);
      await refreshData();
      addToast("Taller creado con éxito", "success");
    } catch (error) {
      addToast("Error al crear taller", "error");
    }
  }

  if (!course) return null;

  return (
    <main className={styles.page}>
      <AdminTopbar
        startContent={
          <Link to="/admin/cursos" className={styles.textButton}>
            <ChevronLeft size={18} /> Volver a cursos
          </Link>
        }
        endContent={
          <div className={styles.brand}>
            <Settings size={18} /> <span>IES TEIS | {course.nombreCurso}</span>
          </div>
        }
      />

      <section className={styles.container}>
        <header className={styles.headerRow}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Panel de {course.nombreCurso}</h1>
            <p className={styles.subtitle}>
              Gestiona las citas y los talleres disponibles de este curso.
            </p>
          </div>

          <div className={styles.headerActions}>
            {activeTab === "citas" ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setIsCreateAppointmentModalOpen(true)}
              >
                <Plus size={18} /> Nueva cita
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setIsCreateWorkshopModalOpen(true)}
              >
                <Plus size={18} /> Crear taller
              </button>
            )}
          </div>
        </header>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${activeTab === "citas" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("citas");
              setFilterWorkshopId(null);
            }}
          >
            <CalendarDays size={18} /> Citas programadas
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "talleres" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("talleres")}
          >
            <Briefcase size={18} /> Talleres del curso
          </button>
        </div>

        {activeTab === "citas" && (
          <div className={styles.tabContent}>
            <div className={styles.filtersBar}>
              <div className={styles.weekPicker}>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className={styles.todayBtn}
                >
                  Hoy
                </button>
                <div className={styles.navButtons}>
                  <button onClick={handlePrevWeek} className={styles.navBtn}>
                    <ChevronLeft size={20} />
                  </button>
                  <div className={styles.currentRange}>
                    <span>
                      {weekRange.monday.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                      {" - "}
                      {weekRange.sunday.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <button onClick={handleNextWeek} className={styles.navBtn}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {filterWorkshopId && (
                <button
                  className={styles.clearFilterBtn}
                  onClick={() => setFilterWorkshopId(null)}
                >
                  Mostrando solo citas del taller seleccionado{" "}
                  <FilterX size={14} />
                </button>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div className={styles.bulkActionsBar}>
                <span className={styles.bulkText}>
                  <strong>{selectedIds.length}</strong>{" "}
                  {selectedIds.length === 1 ? "seleccionada" : "seleccionadas"}
                </span>
                <div className={styles.bulkButtons}>
                  <button
                    onClick={() => handleBulkAction("PENDIENTE")}
                    className={`${styles.bulkBtn} ${styles.bulkUndo}`}
                  >
                    <Clock size={16} /> Pendiente
                  </button>
                  <button
                    onClick={() => handleBulkAction("CONFIRMADA")}
                    className={`${styles.bulkBtn} ${styles.bulkConfirm}`}
                  >
                    <CheckCheck size={16} /> Confirmar
                  </button>

                  <button
                    onClick={() => handleBulkAction("CANCELADA")}
                    className={`${styles.bulkBtn} ${styles.bulkCancel}`}
                  >
                    <XCircle size={16} /> Cancelar
                  </button>

                  {/* <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className={`${styles.bulkBtn} ${styles.bulkDelete}`}
                  >
                    <Trash2 size={16} /> Eliminar
                  </button> */}
                </div>
              </div>
            )}

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
                <h3 className={styles.noDataTitle}>
                  {filterWorkshopId
                    ? "Este taller no tiene citas esta semana"
                    : "Sin citas para esta semana"}
                </h3>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setIsCreateAppointmentModalOpen(true)}
                >
                  <Plus size={18} /> Agendar cita
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "talleres" && (
          <div className={styles.tabContent}>
            {workshops.length > 0 ? (
              <div className={styles.workshopsGrid}>
                {workshops.map((workshop) => {
                  const wsId = String(workshop.idTaller);

                  const citasDelTaller = appointments.filter((a) => {
                    const citaWorkshopId = String(
                      a.taller?.idTaller || a.idTaller || "",
                    );
                    const tallerIdPagina = String(workshop.idTaller);

                    return (
                      citaWorkshopId === tallerIdPagina &&
                      a.estado !== "CANCELADA"
                    );
                  });

                  return (
                    <div
                      key={wsId}
                      className={styles.workshopCard}
                      onClick={() => handleWorkshopClick(workshop)}
                    >
                      <div className={styles.workshopHeader}>
                        <div className={styles.workshopIconWrapper}>
                          <WorkshopIcon
                            iconName={workshop.icono}
                            size={20}
                            className={styles.workshopIcon}
                          />
                        </div>
                        <h3 className={styles.workshopTitle}>
                          {workshop.nombreTaller}
                        </h3>
                      </div>

                      <div className={styles.workshopInfo}>
                        <div className={styles.infoItem}>
                          <Clock size={16} className={styles.infoIcon} />
                          <span>
                            Duración:{" "}
                            <strong>{workshop.duracionMinutos || 0} min</strong>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <Users size={16} className={styles.infoIcon} />
                          <span>
                            Aforo máximo:{" "}
                            <strong>
                              {workshop.capacidadMaxima || 15} clientes
                            </strong>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <CalendarCheck
                            size={16}
                            className={styles.infoIcon}
                          />
                          <span>
                            <strong>{citasDelTaller.length}</strong> citas
                            agendadas (activas)
                          </span>
                        </div>
                      </div>

                      <div className={styles.workshopDetails}>
                        <button
                          className={styles.linkTextBtn}
                          onClick={(e) => goToFilteredAppointments(e, wsId)}
                        >
                          Ver citas agendadas
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={(e) => handleEditClick(e, workshop)}
                        >
                          Editar taller
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noDataContainer}>
                <Briefcase size={48} className={styles.noDataIcon} />
                <h3 className={styles.noDataTitle}>
                  Aún no hay talleres creados
                </h3>
                <p className={styles.noDataSubtitle}>
                  Crea un taller para poder empezar a agendar citas.
                </p>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setIsCreateWorkshopModalOpen(true)}
                >
                  <Plus size={18} /> Crear primer taller
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <CreateWorkshopModal
        isOpen={isCreateWorkshopModalOpen}
        onClose={() => setIsCreateWorkshopModalOpen(false)}
        onSubmit={handleCreateWorkshop}
        courseName={course?.nombreCurso}
      />
      <CreateAppointmentModal
        isOpen={isCreateAppointmentModalOpen}
        onClose={() => setIsCreateAppointmentModalOpen(false)}
        onSubmit={handleCreateAppointment}
        courseName={course?.nombreCurso}
        workshops={workshops}
      />

      {isEditWorkshopModalOpen && selectedWorkshop && (
        <EditWorkshopModal
          isOpen={isEditWorkshopModalOpen}
          workshop={selectedWorkshop}
          onClose={() => setIsEditWorkshopModalOpen(false)}
          onUpdate={refreshData}
        />
      )}

      {isDetailsModalOpen && selectedWorkshop && (
        <WorkshopDetailsModal
          isOpen={isDetailsModalOpen}
          workshop={selectedWorkshop}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      <Modal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Eliminar citas"
        showAction={false}
      >
        <div className={styles.confirmWrapper}>
          <div className={styles.dangerIconBox}>
            <AlertCircle
              size={48}
              color="var(--color-accent)"
              strokeWidth={1.5}
            />
          </div>

          <div className={styles.confirmTextGroup}>
            <p className={styles.confirmQuestion}>
              ¡Esta acción no se puede deshacer!
            </p>
            <h3 className={styles.confirmTargetName}>
              ¿Deseas eliminar <strong>{selectedIds.length}</strong> cita
              {selectedIds.length > 1 ? "s" : ""} permanentemente?
            </h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={confirmBulkDelete}
            >
              Eliminar definitivamente
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
