import {
  ChevronLeft,
  Filter,
  Plus,
  Settings,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminAppointmentsTable from "../../components/AdminAppointmentsTable";
import AdminTopbar from "../../components/AdminTopbar";
import CreateAppointmentModal from "../../components/CreateAppointmentModal";
import CreateWorkshopModal from "../../components/CreateWorkshopModal";
import appointmentService from "../../services/appointmentService";
import courseService from "../../services/courseService";
import workshopService from "../../services/workshopService";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(undefined);
  const [appointments, setAppointments] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false);
  const [isCreateWorkshopModalOpen, setIsCreateWorkshopModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    date: "",
    workshopId: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      const [nextCourse, nextAppointments, nextWorkshops] = await Promise.all([
        courseService.getCourseById(courseId),
        appointmentService.getAppointmentsByCourseId(courseId),
        workshopService.getWorkshopsByCourseId(courseId),
      ]);

      if (!isMounted) {
        return;
      }

      setCourse(nextCourse);
      setAppointments(nextAppointments);
      setWorkshops(nextWorkshops);
      setFilters({
        date: "",
        workshopId: "",
      });
      setIsFilterOpen(false);
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  async function handleConfirmAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId,
      appointmentId: appointment.id,
      status: "Confirmada",
    });

    setAppointments(updatedAppointments);
  }

  async function handleCreateAppointment(appointmentData) {
    await appointmentService.createAppointment({
      ...appointmentData,
      courseId,
    });

    const nextAppointments = await appointmentService.getAppointmentsByCourseId(courseId);
    setAppointments(nextAppointments);
    setIsCreateAppointmentModalOpen(false);
  }

  async function handleCreateWorkshop(workshopData) {
    await workshopService.createWorkshop({
      ...workshopData,
      courseId,
    });

    const nextWorkshops = await workshopService.getWorkshopsByCourseId(courseId);
    setWorkshops(nextWorkshops);
    setIsCreateWorkshopModalOpen(false);
  }

  async function handleCompleteAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId,
      appointmentId: appointment.id,
      status: "Completada",
    });

    setAppointments(updatedAppointments);
  }

  async function handleCancelAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId,
      appointmentId: appointment.id,
      status: "Cancelada",
    });

    setAppointments(updatedAppointments);
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleClearFilters() {
    setFilters({
      date: "",
      workshopId: "",
    });
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesDate = !filters.date || appointment.date === filters.date;
    const matchesWorkshop =
      !filters.workshopId || appointment.workshopId === filters.workshopId;

    return matchesDate && matchesWorkshop;
  });

  const hasActiveFilters = Boolean(filters.date || filters.workshopId);

  if (course === undefined) {
    return (
      <main className={styles.page}>
        <section className={styles.container}>
          <div className={styles.emptyState}>
            <h1 className={styles.title}>Cargando panel...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!course) {
    return (
      <main className={styles.page}>
        <section className={styles.container}>
          <div className={styles.emptyState}>
            <h1 className={styles.title}>Curso no encontrado</h1>
            <p className={styles.subtitle}>
              La ruta solicitada no coincide con ningun curso administrativo.
            </p>
            <Link to="/admin/cursos" className={styles.backButton}>
              Volver a cursos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <AdminTopbar
        startContent={
          <Link to="/admin/cursos" className={styles.textButton}>
            <ChevronLeft className={styles.textButtonIcon} strokeWidth={1.8} />
            Volver a cursos
          </Link>
        }
        endContent={
          <div className={styles.brand}>
            <Settings className={styles.brandIcon} strokeWidth={1.8} />
            <span>IES TEIS | {course.name}</span>
          </div>
        }
      />

      <section className={styles.container}>
        <header className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Citas de {course.name}</h1>
            <p className={styles.subtitle}>
              Gestiona el estado de cada cita: pendiente, confirmada, completada o cancelada.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setIsCreateAppointmentModalOpen(true)}
            >
              <Plus className={styles.secondaryIcon} strokeWidth={1.8} />
              Nueva cita
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setIsCreateWorkshopModalOpen(true)}
            >
              <Plus className={styles.secondaryIcon} strokeWidth={1.8} />
              Crear taller
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsFilterOpen((current) => !current)}
            >
              <Filter className={styles.secondaryIcon} strokeWidth={1.8} />
              {isFilterOpen ? "Ocultar filtros" : "Filtrar"}
            </button>
          </div>
        </header>

        {isFilterOpen && (
          <section className={styles.filterCard}>
            <div className={styles.filterHeader}>
              <div className={styles.filterTitleGroup}>
                <SlidersHorizontal
                  className={styles.filterTitleIcon}
                  strokeWidth={1.8}
                />
                <div>
                  <h2 className={styles.filterTitle}>Filtros de citas</h2>
                  <p className={styles.filterSubtitle}>
                    Filtra por fecha concreta y por taller del curso.
                  </p>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClearFilters}
                >
                  <X className={styles.clearIcon} strokeWidth={1.8} />
                  Limpiar
                </button>
              )}
            </div>

            <div className={styles.filterGrid}>
              <div className={styles.filterField}>
                <label className={styles.filterLabel} htmlFor="date">
                  Fecha
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className={styles.filterInput}
                  value={filters.date}
                  onChange={handleFilterChange}
                />
              </div>

              <div className={styles.filterField}>
                <label className={styles.filterLabel} htmlFor="workshopId">
                  Taller
                </label>
                <select
                  id="workshopId"
                  name="workshopId"
                  className={styles.filterInput}
                  value={filters.workshopId}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los talleres</option>
                  {workshops.map((workshop) => (
                    <option key={workshop.id} value={workshop.id}>
                      {workshop.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}

        {hasActiveFilters && (
          <p className={styles.filterResult}>
            Mostrando {filteredAppointments.length} cita
            {filteredAppointments.length === 1 ? "" : "s"} con los filtros
            aplicados.
          </p>
        )}

        <AdminAppointmentsTable
          appointments={filteredAppointments}
          onConfirm={handleConfirmAppointment}
          onComplete={handleCompleteAppointment}
          onCancel={handleCancelAppointment}
        />
      </section>

      <CreateWorkshopModal
        isOpen={isCreateWorkshopModalOpen}
        onClose={() => setIsCreateWorkshopModalOpen(false)}
        onSubmit={handleCreateWorkshop}
        courseName={course.name}
      />
      <CreateAppointmentModal
        isOpen={isCreateAppointmentModalOpen}
        onClose={() => setIsCreateAppointmentModalOpen(false)}
        onSubmit={handleCreateAppointment}
        courseName={course.name}
        workshops={workshops}
      />
    </main>
  );
}
