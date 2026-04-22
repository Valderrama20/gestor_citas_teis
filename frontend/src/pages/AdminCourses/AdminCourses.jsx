import { LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminCourseCard from "../../components/AdminCourseCard";
import AdminTopbar from "../../components/AdminTopbar";
import courseService from "../../services/courseService";
import styles from "./AdminCourses.module.css";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      const nextCourses = await courseService.getAdminCourses();

      if (isMounted) {
        setCourses(nextCourses);
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <AdminTopbar
        startContent={
          <div className={styles.brand}>
            <Settings className={styles.brandIcon} strokeWidth={1.8} />
            <span>Panel administrativo</span>
          </div>
        }
        endContent={
          <Link to="/admin/login" className={styles.textButton}>
            <LogOut className={styles.textButtonIcon} strokeWidth={1.8} />
            Salir
          </Link>
        }
      />

      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Hola, profesor</h1>
          <p className={styles.subtitle}>
            Selecciona un curso para gestionar sus citas.
          </p>
        </header>

        <div className={styles.grid}>
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
