import { LogOut, Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminCourseCard from "../../components/AdminCourseCard";
import CreateCourseModal from "../../components/CreateCourseModal";
import AdminTopbar from "../../components/AdminTopbar";
import courseService from "../../services/courseService";
import styles from "./AdminCourses.module.css";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      try {
        const nextCourses = await courseService.getAdminCourses();

        if (isMounted) {
          setCourses(nextCourses);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al cargar los cursos", error);
        if (isMounted) setIsLoading(false);
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateCourse(courseData) {
    await courseService.createCourse(courseData);
    const nextCourses = await courseService.getAdminCourses();
    setCourses(nextCourses);
    setIsCreateModalOpen(false);
  }

  return (
    <>
      <main className={styles.page}>
        <AdminTopbar
          startContent={
            <div className={styles.brand}>
              <Settings className={styles.brandIcon} strokeWidth={1.8} />
              <span>Panel administrativo</span>
            </div>
          }
          endContent={
            <div className={styles.topbarActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className={styles.primaryButtonIcon} strokeWidth={1.8} />
                Crear curso
              </button>
              <Link to="/admin/login" className={styles.textButton}>
                <LogOut className={styles.textButtonIcon} strokeWidth={1.8} />
                Salir
              </Link>
            </div>
          }
        />

        <section className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Hola, profesor</h1>
            <p className={styles.subtitle}>
              Selecciona un curso para gestionar sus citas.
            </p>
          </header>

          {isLoading ? (
            <p>Cargando cursos...</p>
          ) : (
            <div className={styles.grid}>
              {courses.map((course) => (
                <AdminCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCourse}
      />
    </>
  );
}
