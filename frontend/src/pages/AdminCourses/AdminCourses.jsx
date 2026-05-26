import { AlertCircle, LogOut, Plus, Settings, BookOpen } from "lucide-react";
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
import { courseIconMap } from "../../constants/icons";
import { useTranslation } from "react-i18next";

export default function AdminCourses() {
  const { usuario, logout } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const { addToast } = useToast();
  const { t } = useTranslation('admin');

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
        addToast(t("courses.toasts.updated"), "success");
      } else {
        await courseService.createCourse(courseData);
        addToast(t("courses.toasts.created"), "success");
      }
      const nextCourses = await courseService.getAdminCourses();
      setCourses(nextCourses);
      setIsCreateModalOpen(false);
      setCourseToEdit(null);
    } catch (error) {
      console.error(error);
      addToast(t("courses.toasts.saveError"), "error");
    }
  }

  function handleDeleteCourse(curso) {
    setCourseToDelete(curso);
  }

  async function handleConfirmDelete() {
    try {
      await courseService.deleteCourse(courseToDelete.id);

      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      addToast(t("courses.toasts.deleted"), "success");
    } catch (error) {
      console.error(error);
      addToast(t("courses.toasts.deleteError"), "error");
    } finally {
      setCourseToDelete(null);
    }
  }

  async function handleEditCourse(curso) {
    try {
      const fullCourse = await courseService.getCourseById(curso.id);
      setCourseToEdit(fullCourse);
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      addToast(t("courses.toasts.loadError"), "error");
    }
  }

  async function handleDuplicateCourse(curso) {
    try {
      const fullCourse = await courseService.getCourseById(curso.id);
      await courseService.createCourse({
        ...fullCourse,
        idCurso: null,
        nombreCurso: fullCourse.nombreCurso + " (Copia)"
      });
      addToast(t("courses.toasts.duplicated"), "success");
      const nextCourses = await courseService.getAdminCourses();
      setCourses(nextCourses);
    } catch (error) {
      console.error("Error al duplicar:", error);
      addToast(t("courses.toasts.duplicateError"), "error");
    }
  }

  return (
    <>
      <main className={styles.page}>
        <AdminTopbar
          startContent={
            <div className={styles.textButton}>
              <Settings className={styles.brandIcon} strokeWidth={1.8} />
              <span>{t("courses.topbar")}</span>
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
                {t("courses.createBtn")}
              </button>
              <button type="button" className={styles.textButton} onClick={logout}>
                <LogOut className={styles.textButtonIcon} strokeWidth={1.8} />
                {t("courses.logoutBtn")}
              </button>
            </div>
          }
        />

        <section className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{t("courses.greeting")}, {usuario?.nombre || t("courses.defaultUser")}</h1>
            <p className={styles.subtitle}>
              {t("courses.subtitle")}
            </p>
          </header>

          {isLoading ? (
            <p>{t("courses.loading")}</p>
          ) : (
            <div className={styles.grid}>
              {courses.map((course) => {
                // Hacemos la lectura tolerante a fallos, mayúsculas o si el backend envía "icon"
                const iconKey = (course.icono || course.icon || "").trim().toLowerCase();
                const CourseIcon = courseIconMap[iconKey] || BookOpen;

                return (
                  <AdminCourseCard
                    key={course.id}
                    course={course}
                    icon={CourseIcon}
                    onDelete={handleDeleteCourse}
                    onEdit={handleEditCourse}
                    onDuplicate={handleDuplicateCourse}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCourseToEdit(null);
        }}
        onSubmit={handleCreateCourse}
        courseToEdit={courseToEdit}
      />

      <Modal
        isOpen={courseToDelete !== null}
        onClose={() => setCourseToDelete(null)}
        title={t("courses.deleteModal.title")}
        showAction={false}
      >
        <div className={styles.confirmWrapper}>
          <div className={styles.dangerIconBox}>
            <AlertCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
          </div>

          <div className={styles.confirmTextGroup}>
            <p className={styles.confirmQuestion}>{t("courses.deleteModal.warning")}</p>
            <h3 className={styles.confirmTargetName}>{courseToDelete?.name}</h3>
          </div>

          <div className={styles.modalActionsVertical}>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleConfirmDelete}
            >
              {t("courses.deleteModal.confirm")}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setCourseToDelete(null)}
            >
              {t("courses.deleteModal.cancel")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
