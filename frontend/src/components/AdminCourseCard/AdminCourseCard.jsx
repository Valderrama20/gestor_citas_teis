import { ArrowRight, Copy, Edit3, GraduationCap, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./AdminCourseCard.module.css";

export default function AdminCourseCard({ course, icon: Icon, onDelete, onEdit, onDuplicate }) {
  const { t } = useTranslation('admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const getLevelLabel = (level) => {
    const normalized = String(level || "").trim().toLowerCase();
    if (normalized === "grado medio") return t("courseCard.levels.medium");
    if (normalized === "grado superior") return t("courseCard.levels.higher");
    return level;
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
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

        <div className={styles.menuContainer} ref={menuRef}>
          <button onClick={toggleMenu} className={styles.menuTrigger} title={t('courseCard.options')}>
            <MoreVertical strokeWidth={1.8} size={20} />
          </button>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              <button onClick={(e) => handleAction(e, 'edit')} className={styles.dropdownItem}>
                <Edit3 size={16} /> {t('courseCard.edit')}
              </button>
              <button onClick={(e) => handleAction(e, 'duplicate')} className={styles.dropdownItem}>
                <Copy size={16} /> {t('courseCard.duplicate')}
              </button>
              <div className={styles.dropdownDivider} />
              <button onClick={(e) => handleAction(e, 'delete')} className={`${styles.dropdownItem} ${styles.danger}`}>
                <Trash2 size={16} /> {t('courseCard.delete')}
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className={styles.title}>{course.nombreCurso || course.name}</h3>
      <p className={styles.info}>
        {getLevelLabel(course.nivel || course.level)} | {course.cursoAcademico || course.period}
      </p>
      <div className={styles.footer}>
        <span>{course.alumnos || course.studentCount || 0} {t('courseCard.students')}</span>
        <ArrowRight className={styles.arrow} strokeWidth={1.8} />
      </div>
    </Link >
  );
}
