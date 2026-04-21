import { ChevronLeft, Filter, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminAppointmentsTable from "../../components/AdminAppointmentsTable";
import AdminTopbar from "../../components/AdminTopbar";
import Modal from "../../components/Modal";
import {
  appointmentsByCourse,
  getCourseById,
  studentsByCourse,
} from "../../data/adminData";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);
  const initialAppointments = appointmentsByCourse[courseId] ?? [];
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");

  const studentOptions = studentsByCourse[courseId] ?? [];

  useEffect(() => {
    setAppointments(appointmentsByCourse[courseId] ?? []);
    setSelectedAppointment(null);
    setSelectedStudent("");
  }, [courseId]);

  function handleOpenAssign(appointment) {
    setSelectedAppointment(appointment);
    setSelectedStudent(appointment.student || studentOptions[0] || "");
  }

  function handleConfirmAssign() {
    if (!selectedAppointment || !selectedStudent) {
      return;
    }

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? {
              ...appointment,
              student: selectedStudent,
              status: "Asignada",
            }
          : appointment,
      ),
    );

    setSelectedAppointment(null);
    setSelectedStudent("");
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
              <strong>{selectedAppointment.workshop}</strong>
            </p>

            <label className={styles.modalLabel} htmlFor="student">
              Selecciona el alumno encargado
            </label>
            <select
              id="student"
              className={styles.modalSelect}
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
            >
              {studentOptions.map((student) => (
                <option key={student} value={student}>
                  {student}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleConfirmAssign}
              disabled={!selectedStudent}
            >
              Confirmar
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
