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
  MoreVertical,
  Edit3,
  AlertTriangle,
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
import { useTranslation } from "react-i18next";

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
  
  // --- NUEVOS ESTADOS PARA EL MENÚ Y BORRADO DE TALLER ---
  const [activeMenuWorkshopId, setActiveMenuWorkshopId] = useState(null);
  const [isDeleteWorkshopDialogOpen, setIsDeleteWorkshopDialogOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "fecha",
    direction: "asc",
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const { addToast } = useToast();
  const { t, i18n } = useTranslation('admin');

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

  // Cierra los menús desplegables si se hace clic fuera
  useEffect(() => {
    const closeMenus = () => setActiveMenuWorkshopId(null);
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

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

  // --- LÓGICA DEL MENÚ Y BORRADO ---
  const toggleWorkshopMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuWorkshopId(activeMenuWorkshopId === id ? null : id);
  };

  const handleEditClick = (e, workshop) => {
    e.stopPropagation();
    setSelectedWorkshop(workshop);
    setIsEditWorkshopModalOpen(true);
    setActiveMenuWorkshopId(null);
  };

  const handleDeleteWorkshopClick = (e, workshop) => {
    e.stopPropagation();
    setWorkshopToDelete(workshop);
    setIsDeleteWorkshopDialogOpen(true);
    setActiveMenuWorkshopId(null);
  };

  const confirmDeleteWorkshop = async () => {
    try {
      if (workshopService.deleteWorkshop) {
        await workshopService.deleteWorkshop(workshopToDelete.idTaller);
      }
      addToast(t("dashboard.toasts.wsDeleted"), "success");
      setIsDeleteWorkshopDialogOpen(false);
      await refreshData();
    } catch (error) {
      addToast(t("dashboard.toasts.wsDeleteError"), "error");
      setIsDeleteWorkshopDialogOpen(false);
    }
  };

  const goToFilteredAppointments = (e, workshopId) => {
    e.stopPropagation();
    setCurrentDate(new Date()); // Se asegura de volver a "Hoy"
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
    addToast(t("dashboard.toasts.appConfirmed"), "success");
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
    addToast(t("dashboard.toasts.appCancelled"), "success");
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
    addToast(t("dashboard.toasts.appUndo"), "success");
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
      addToast(t("dashboard.toasts.appsUpdated", { count: appointmentsToUpdate.length }), "success");
    } catch (error) {
      addToast(t("dashboard.toasts.appsUpdateError"), "error");
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
      addToast(t("dashboard.toasts.appsDeleted", { count: appointmentsToDelete.length }), "success");
    } catch (error) {
      setIsDeleteDialogOpen(false);
      addToast(t("dashboard.toasts.appsDeleteError"), "error");
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
      addToast(t("dashboard.toasts.appCreated"), "success");
    } catch (error) {
      addToast(t("dashboard.toasts.appCreateError"), "error");
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
      addToast(t("dashboard.toasts.wsCreated"), "success");
    } catch (error) {
      addToast(t("dashboard.toasts.wsCreateError"), "error");
    }
  }

  if (!course) return null;

  return (
    <main className={styles.page}>
      <AdminTopbar
        startContent={
          <Link to="/admin/cursos" className={styles.textButton}>
            <ChevronLeft size={18} /> {t("dashboard.back")}
          </Link>
        }
        endContent={
          <div className={styles.brand}>
            <Settings size={18} /> <span>{t("dashboard.brand")}{course.nombreCurso}</span>
          </div>
        }
      />

      <section className={styles.container}>
        <header className={styles.headerRow}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{t("dashboard.titlePrefix")}{course.nombreCurso}</h1>
            <p className={styles.subtitle}>
              {t("dashboard.subtitle")}
            </p>
          </div>

          <div className={styles.headerActions}>
            {activeTab === "citas" ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setIsCreateAppointmentModalOpen(true)}
              >
                <Plus size={18} /> {t("dashboard.actions.newAppointment")}
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setIsCreateWorkshopModalOpen(true)}
              >
                <Plus size={18} /> {t("dashboard.actions.createWorkshop")}
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
            <CalendarDays size={18} /> {t("dashboard.tabs.appointments")}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "talleres" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("talleres")}
          >
            <Briefcase size={18} /> {t("dashboard.tabs.workshops")}
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
                  {t("dashboard.filters.today")}
                </button>
                <div className={styles.navButtons}>
                  <button onClick={handlePrevWeek} className={styles.navBtn}>
                    <ChevronLeft size={20} />
                  </button>
                  <div className={styles.currentRange}>
                    <span>
                      {weekRange.monday.toLocaleDateString(i18n.language, {
                        day: "numeric",
                        month: "short",
                      })}
                      {" - "}
                      {weekRange.sunday.toLocaleDateString(i18n.language, {
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
                  {t("dashboard.filters.clear")}
                  <FilterX size={14} />
                </button>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div className={styles.bulkActionsBar}>
                <span className={styles.bulkText}>
                  <strong>{selectedIds.length}</strong>{" "}
                  {selectedIds.length === 1 ? t("dashboard.bulk.selected") : t("dashboard.bulk.selectedPlural")}
                </span>
                <div className={styles.bulkButtons}>
                  <button
                    onClick={() => handleBulkAction("PENDIENTE")}
                    className={`${styles.bulkBtn} ${styles.bulkUndo}`}
                  >
                    <Clock size={16} /> {t("dashboard.bulk.pending")}
                  </button>
                  <button
                    onClick={() => handleBulkAction("CONFIRMADA")}
                    className={`${styles.bulkBtn} ${styles.bulkConfirm}`}
                  >
                    <CheckCheck size={16} /> {t("dashboard.bulk.confirm")}
                  </button>

                  <button
                    onClick={() => handleBulkAction("CANCELADA")}
                    className={`${styles.bulkBtn} ${styles.bulkCancel}`}
                  >
                    <XCircle size={16} /> {t("dashboard.bulk.cancel")}
                  </button>
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
                    ? t("dashboard.empty.filteredAppointments")
                    : t("dashboard.empty.appointments")}
                </h3>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setIsCreateAppointmentModalOpen(true)}
                >
                  <Plus size={18} /> {t("dashboard.empty.scheduleAppointment")}
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
                      <div className={styles.header}>
                        <div className={styles.headerLeft}>
                          <div className={styles.workshopIconWrapper}>
                            <WorkshopIcon
                              iconName={workshop.icono}
                              size={20}
                            />
                          </div>
                          <h3 className={styles.workshopTitle}>{workshop.nombreTaller}</h3>
                        </div>

                        <div className={styles.menuContainer}>
                          <button 
                            onClick={(e) => toggleWorkshopMenu(e, wsId)} 
                            className={styles.menuTrigger} 
                            title="Opciones"
                          >
                            <MoreVertical strokeWidth={1.8} size={20} />
                          </button>

                          {activeMenuWorkshopId === wsId && (
                            <div className={styles.dropdown}>
                              <button onClick={(e) => handleEditClick(e, workshop)} className={styles.dropdownItem}>
                                <Edit3 size={16} /> {t("dashboard.workshopCard.edit")}
                              </button>
                              <div className={styles.dropdownDivider} />
                              <button onClick={(e) => handleDeleteWorkshopClick(e, workshop)} className={`${styles.dropdownItem} ${styles.danger}`}>
                                <Trash2 size={16} /> {t("dashboard.workshopCard.delete")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.workshopInfo}>
                        <div className={styles.infoItem}>
                          <Clock size={16} className={styles.infoIcon} />
                          <span>
                            {t("dashboard.workshopCard.duration")}{" "}
                            <strong>{workshop.duracionMinutos || 0} {t("dashboard.workshopCard.min")}</strong>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <Users size={16} className={styles.infoIcon} />
                          <span>
                            {t("dashboard.workshopCard.capacity")}{" "}
                            <strong>
                              {workshop.capacidadMaxima || 15} {t("dashboard.workshopCard.clients")}
                            </strong>
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <CalendarCheck
                            size={16}
                            className={styles.infoIcon}
                          />
                          <span>
                            <strong>{citasDelTaller.length}</strong> {t("dashboard.workshopCard.appointments")}
                          </span>
                        </div>
                      </div>

                      <div className={styles.workshopDetails}>
                        <button
                          className={styles.linkTextBtn}
                          onClick={(e) => goToFilteredAppointments(e, wsId)}
                        >
                          {t("dashboard.workshopCard.viewAppointments")}
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
                  {t("dashboard.empty.workshopsTitle")}
                </h3>
                <p className={styles.noDataSubtitle}>
                  {t("dashboard.empty.workshopsSub")}
                </p>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setIsCreateWorkshopModalOpen(true)}
                >
                  <Plus size={18} /> {t("dashboard.empty.createFirstWorkshop")}
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
        title={t("dashboard.deleteAppointmentsModal.title")}
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
              {t("dashboard.deleteAppointmentsModal.warning")}
            </p>
            <h3 className={styles.confirmTargetName}>
              {selectedIds.length === 1 ? t('dashboard.deleteAppointmentsModal.questionSingular') : t('dashboard.deleteAppointmentsModal.questionPlural', { count: selectedIds.length })}
            </h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={confirmBulkDelete}
            >
              {t("dashboard.deleteAppointmentsModal.confirm")}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("dashboard.deleteAppointmentsModal.cancel")}
            </button>
          </div>
        </div>
      </Modal>

     {/* --- MODAL PARA ELIMINAR TALLER --- */}
      <Modal
        isOpen={isDeleteWorkshopDialogOpen}
        onClose={() => setIsDeleteWorkshopDialogOpen(false)}
        title={t("dashboard.deleteWorkshopModal.title")}
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
              {t("dashboard.deleteWorkshopModal.warning")}
            </p>
            <h3 className={styles.confirmTargetName}>
              {workshopToDelete?.nombreTaller}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              {t("dashboard.deleteWorkshopModal.hint")}
            </p>
          </div>

          <div className={styles.modalActionsVertical}>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={confirmDeleteWorkshop}
            >
              {t("dashboard.deleteWorkshopModal.confirm")}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsDeleteWorkshopDialogOpen(false)}
            >
              {t("dashboard.deleteWorkshopModal.cancel")}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}