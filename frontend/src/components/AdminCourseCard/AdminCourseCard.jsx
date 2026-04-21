import { ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./AdminCourseCard.module.css";

export default function AdminCourseCard({ course }) {
  return (
    <Link to={`/admin/cursos/${course.id}`} className={styles.card}>
      <div className={styles.iconBox}>
        <GraduationCap className={styles.icon} strokeWidth={1.8} />
      </div>
      <h3 className={styles.title}>{course.name}</h3>
      <p className={styles.info}>
        {course.level} | {course.period}
      </p>
      <div className={styles.footer}>
        <span>{course.studentCount} alumnos</span>
        <ArrowRight className={styles.arrow} strokeWidth={1.8} />
      </div>
    </Link>
  );
}
