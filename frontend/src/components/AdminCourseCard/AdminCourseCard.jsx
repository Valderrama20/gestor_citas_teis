import { ArrowRight, Copy, Edit3, GraduationCap, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminCourseCard.module.css";

export default function AdminCourseCard({ course, icon: Icon, onDelete, onEdit, onDuplicate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (e, action) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (action === 'delete') onDelete(course);
    if (action === 'edit') onEdit(course);
    if (action === 'duplicate') onDuplicate(course);
  };

  return (
    <Link to={`/admin/cursos/${course.id}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          {Icon ? (
            <Icon className={styles.icon} strokeWidth={1.8} />
          ) : (
            <GraduationCap className={styles.icon} strokeWidth={1.8} />
          )}
        </div>

        <div className={styles.menuContainer}>
          <button onClick={toggleMenu} className={styles.menuTrigger} title="Opciones">
            <MoreVertical strokeWidth={1.8} size={20} />
          </button>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              <button onClick={(e) => handleAction(e, 'edit')} className={styles.dropdownItem}>
                <Edit3 size={16} /> Editar
              </button>
              <button onClick={(e) => handleAction(e, 'duplicate')} className={styles.dropdownItem}>
                <Copy size={16} /> Duplicar
              </button>
              <div className={styles.dropdownDivider} />
              <button onClick={(e) => handleAction(e, 'delete')} className={`${styles.dropdownItem} ${styles.danger}`}>
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className={styles.title}>{course.nombreCurso || course.name}</h3>
      <p className={styles.info}>
        {course.nivel || course.level} | {course.cursoAcademico || course.period}
      </p>
      <div className={styles.footer}>
        <span>{course.alumnos || course.studentCount || 0} alumnos</span>
        <ArrowRight className={styles.arrow} strokeWidth={1.8} />
      </div>
    </Link >
  );
}
