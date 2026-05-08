import { AlertCircle, LogOut, Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminCourseCard from "../../components/AdminCourseCard";
import CreateCourseModal from "../../components/CreateCourseModal";
import AdminTopbar from "../../components/AdminTopbar";
import courseService from "../../services/courseService";
import styles from "./AdminCourses.module.css";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal";
import { useAuthStore } from "../../store/authStore";

export default function AdminCourses() {
  const { usuario, logout } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
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

  function handleDeleteCourse(curso) {
    setCourseToDelete(curso);
  }

  async function handleConfirmDelete() {
    try {
      // Usamos el ID del curso que tenemos guardado en el estado
      await courseService.deleteCourse(courseToDelete.id);

      // Actualizamos la lista y avisamos al usuario
      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      addToast("Curso eliminado", "success");
    } catch (error) {
      addToast("Error al borrar", "error");
    } finally {
      // IMPORTANTE: Pase lo que pase, vaciamos el cajón para que el Modal se cierre
      setCourseToDelete(null);
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
              <button type="button" className={styles.textButton} onClick={logout}>
                <LogOut className={styles.textButtonIcon} strokeWidth={1.8} />
                Salir
              </button>
            </div>
          }
        />

        <section className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Hola, {usuario?.nombre || "profesor"}</h1>
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

      <Modal
        isOpen={courseToDelete !== null}
        onClose={() => setCourseToDelete(null)}
        title="Eliminar curso"
        showAction={false}
      >
        <div className={styles.confirmWrapper}>
          <div className={styles.dangerIconBox}>
            <AlertCircle size={48} color="#b83232" strokeWidth={1.5} />
          </div>

          <div className={styles.confirmTextGroup}>
            <p className={styles.confirmQuestion}>¡Esta acción no se puede deshacer!</p>
            <h3 className={styles.confirmTargetName}>{courseToDelete?.name}</h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={handleConfirmDelete}
            >
              Eliminar definitivamente
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setCourseToDelete(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
