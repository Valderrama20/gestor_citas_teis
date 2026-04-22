import { ChevronLeft, Filter, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminAppointmentsTable from "../../components/AdminAppointmentsTable";
import AdminTopbar from "../../components/AdminTopbar";
import Modal from "../../components/Modal";
import appointmentService from "../../services/appointmentService";
import courseService from "../../services/courseService";
import studentService from "../../services/studentService";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(undefined);
  const [appointments, setAppointments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      const [nextCourse, nextAppointments, nextStudents] = await Promise.all([
        courseService.getCourseById(courseId),
        appointmentService.getAppointmentsByCourseId(courseId),
        studentService.getStudentsByCourseId(courseId),
      ]);

      if (!isMounted) {
        return;
      }

      setCourse(nextCourse);
      setAppointments(nextAppointments);
      setStudents(nextStudents);
      setSelectedAppointment(null);
      setSelectedStudentId("");
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  function handleOpenAssign(appointment) {
    setSelectedAppointment(appointment);
    setSelectedStudentId(appointment.studentId || students[0]?.id || "");
  }

  async function handleConfirmAssign() {
    if (!selectedAppointment || !selectedStudentId) {
      return;
    }

    const updatedAppointments = await appointmentService.assignAppointmentStudent({
      courseId,
      appointmentId: selectedAppointment.id,
      studentId: selectedStudentId,
    });

    setAppointments(updatedAppointments);
    setSelectedAppointment(null);
    setSelectedStudentId("");
  }

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
    <>
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
                Gestiona las solicitudes recibidas por el alumnado del curso.
              </p>
            </div>

            <button type="button" className={styles.secondaryButton}>
              <Filter className={styles.secondaryIcon} strokeWidth={1.8} />
              Filtrar
            </button>
          </header>

          <AdminAppointmentsTable
            appointments={appointments}
            onAssign={handleOpenAssign}
          />
        </section>
      </main>

      <Modal
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        eyebrow="Asignacion"
        title="Asignar alumno"
        actionLabel="Cancelar"
      >
        {selectedAppointment && (
          <div className={styles.modalBody}>
            <p className={styles.modalCopy}>
              Cita: <strong>{selectedAppointment.client}</strong> |{" "}
              <strong>{selectedAppointment.workshopTitle}</strong>
            </p>

            <label className={styles.modalLabel} htmlFor="student">
              Selecciona el alumno encargado
            </label>
            <select
              id="student"
              className={styles.modalSelect}
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleConfirmAssign}
              disabled={!selectedStudentId}
            >
              Confirmar
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
