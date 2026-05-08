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
import availabilityService from "../../services/availabilityService"; // ⚠️ IMPORTANTE: Añadido para los horarios
import { useToast } from "../../context/ToastContext";
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

  const { addToast } = useToast();

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
      appointment,
      appointmentId: appointment.id,
      estado: "Confirmada",
    });

    setAppointments(updatedAppointments);
    addToast("Cita confirmada correctamente", "success");
  }

  async function handleCreateAppointment(appointmentData) {
    try {
      await appointmentService.createAppointment({
        ...appointmentData,
        courseId,
      });
      const nextAppointments = await appointmentService.getAppointmentsByCourseId(courseId);
      setAppointments(nextAppointments);
      setIsCreateAppointmentModalOpen(false);
      addToast("Cita creada correctamente", "success");
    } catch (error) {
      console.error(error);
      addToast("Error creando la cita", "error");
    }
  }

  async function handleCancelAppointment(appointment) {
    const updatedAppointments = await appointmentService.updateAppointmentStatus({
      courseId,
      appointment,
      appointmentId: appointment.id,
      estado: "Cancelada",
    });

    setAppointments(updatedAppointments);
    addToast("Cita cancelada correctamente", "success");
  }

  async function handleCreateWorkshop(workshopData) {
    try {
      const { horarios, ...datosTaller } = workshopData;

      // 1. Guardamos el taller
      const tallerCreado = await workshopService.createWorkshop({
        ...datosTaller,
        idCurso: Number(courseId), 
      });

      console.log("✅ RESPUESTA DEL BACKEND AL CREAR TALLER:", tallerCreado);

      const nuevoIdTaller = tallerCreado?.idTaller || tallerCreado?.id;

      if (!nuevoIdTaller) {
         throw new Error("El backend no ha devuelto el ID del taller.");
      }

      // 2. Guardamos los horarios (¡LLAMADA DIRECTA SIN USAR EL SERVICE!)
      if (horarios && horarios.length > 0) {
        for (const horario of horarios) {
          
          const slotData = {
            diaSemana: horario.diaSemana,
            horaApertura: horario.horaApertura,
            horaCierre: horario.horaCierre,
            idTaller: { idTaller: nuevoIdTaller } 
          };

          // ⚠️ Hacemos el POST directamente aquí para saltarnos el error de React
          const response = await fetch("http://localhost:9001/horarios-talleres", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slotData),
          });

          if (!response.ok) {
            console.error("Fallo al guardar horario:", await response.text());
            throw new Error("Fallo al guardar las horas en la BD");
          }
        }
      }

      // 3. Todo OK: Cerramos y actualizamos
      setIsCreateWorkshopModalOpen(false);

      const nextWorkshops = await workshopService.getWorkshopsByCourseId(courseId);
      setWorkshops(nextWorkshops);

      addToast("¡Taller y horarios creados correctamente!", "success");

    } catch (error) {
      console.error("❌ Error en el flujo de crear taller:", error);
      setIsCreateWorkshopModalOpen(false); 
      addToast(error.message || "Error al crear el taller o los horarios", "error");
    }
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
            <span>IES TEIS | {course.nombreCurso}</span>
          </div>
        }
      />

      <section className={styles.container}>
        <header className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Citas de {course.nombreCurso}</h1>
            <p className={styles.subtitle}>
              Gestiona el estado de cada cita: pendiente, confirmada o cancelada.
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
                    <option
                      key={workshop.idTaller ?? workshop.id}
                      value={String(workshop.idTaller ?? workshop.id)}
                    >
                      {workshop.nombreTaller ?? workshop.title}
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
          onCancel={handleCancelAppointment}
        />
      </section>

      <CreateWorkshopModal
        isOpen={isCreateWorkshopModalOpen}
        onClose={() => setIsCreateWorkshopModalOpen(false)}
        onSubmit={handleCreateWorkshop}
        courseName={course.nombreCurso}
      />
      <CreateAppointmentModal
        isOpen={isCreateAppointmentModalOpen}
        onClose={() => setIsCreateAppointmentModalOpen(false)}
        onSubmit={handleCreateAppointment}
        courseName={course.nombreCurso}
        workshops={workshops}
      />
    </main>
  );
}