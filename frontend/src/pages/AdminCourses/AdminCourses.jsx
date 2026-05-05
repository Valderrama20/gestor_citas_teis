import { LogOut, Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminCourseCard from "../../components/AdminCourseCard";
import CreateCourseModal from "../../components/CreateCourseModal";
import AdminTopbar from "../../components/AdminTopbar";
import courseService from "../../services/courseService";
import styles from "./AdminCourses.module.css";
import { useToast } from "../../context/ToastContext";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const { addToast } = useToast();

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
    try {
      if (courseToEdit) {
        await courseService.updateCourse(courseData);
        // Lanzamos el aviso de éxito
        addToast("¡Curso actualizado correctamente!", "success");
      } else {
        await courseService.createCourse(courseData);
        // Lanzamos el aviso de éxito
        addToast("¡Curso creado correctamente!", "success");
      }
      const nextCourses = await courseService.getAdminCourses();
      setCourses(nextCourses);
      setIsCreateModalOpen(false);
      setCourseToEdit(null); // Limpiamos el estado al terminar
    } catch (error) {
      console.error(error);
      // Lanzamos un aviso de error si la API falla
      addToast("Error al guardar el curso. Inténtalo de nuevo.", "error");
    }
  }

  async function handleDeleteCourse(curso) {
    const isConfirmed = window.confirm(`¿Estás seguro de que deseas borrar el curso "${curso.name}"?`);
    if (!isConfirmed) return;

    try {
      await courseService.deleteCourse(curso.id);
      setCourses(currentCourses => currentCourses.filter(c => c.id !== curso.id));
      addToast(`El curso "${curso.name}" ha sido eliminado.`, "success");
    } catch (error) {
      console.error("Error al borrar:", error);
      addToast("No se pudo borrar el curso. Comprueba si tiene citas asociadas.", "error");
    }
  }

  async function handleEditCourse(curso) {
    try {
      // Traemos todos los datos de la base de datos (incluida la descripción)
      const fullCourse = await courseService.getCourseById(curso.id);
      setCourseToEdit(fullCourse);
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      addToast("Error al cargar los datos del curso.", "error");
    }
  }

  async function handleDuplicateCourse(curso) {
    try {
      const fullCourse = await courseService.getCourseById(curso.id);
      await courseService.createCourse({
        ...fullCourse,
        idCurso: null, // Dejamos que la API le asigne un ID nuevo
        nombreCurso: fullCourse.nombreCurso + " (Copia)"
      });
      addToast("¡Curso duplicado correctamente!", "success");
      const nextCourses = await courseService.getAdminCourses();
      setCourses(nextCourses);
    } catch (error) {
      console.error("Error al duplicar:", error);
      addToast("Error al duplicar el curso.", "error");
    }
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
                <AdminCourseCard key={course.id} course={course} onDelete={handleDeleteCourse} onEdit={handleEditCourse} onDuplicate={handleDuplicateCourse} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCourseToEdit(null); // Nos aseguramos de limpiar el estado al cerrar
        }}
        onSubmit={handleCreateCourse}
        courseToEdit={courseToEdit}
      />
    </>
  );
}
