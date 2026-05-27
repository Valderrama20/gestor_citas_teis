import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ServiceCard from "../../components/ServiceCard";
import { workshopIconMap } from "../../constants/icons";
import { Home, ScissorsLineDashed, Sparkles } from "lucide-react";
import courseService from "../../services/courseService";
import workshopService from "../../services/workshopService";
import styles from "./Talleres.module.css";

export default function Talleres() {
  const { courseId } = useParams();
  const { t } = useTranslation('workshops');
  const [course, setCourse] = useState(undefined);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadContent() {
      const [nextCourse, nextWorkshops] = await Promise.all([
        courseService.getCourseById(courseId),
        workshopService.getWorkshopsByCourseId(courseId),
      ]);

      if (!isMounted) {
        return;
      }

      setCourse(nextCourse);
      setWorkshops(nextWorkshops);
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (course === undefined) {
    return (
      <section className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.title}>{t('loading')}</h2>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.title}>{t('notFoundTitle')}</h2>
          <Link to="/" className={styles.backBtn} onClick={() => window.scrollTo(0, 0)}>
            {t('backToSpecialties')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.main}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn} onClick={() => window.scrollTo(0, 0)}>
          {t('backToSpecialties')}
        </Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.eyebrow}>{t('eyebrow')}</span>
        <h2 className={styles.title}>{t('title', { courseName: course.nombreCurso })}</h2>
        <p className={styles.description}>{course.workshopPageDescription}</p>
      </div>

      {workshops.length === 0 ? (
        <section className={styles.emptyCard}>
          <div className={styles.emptyBadge}>
            <ScissorsLineDashed className={styles.emptyBadgeIcon} strokeWidth={1.8} />
            {t('emptyBadge')}
          </div>

          <p className={styles.emptyCode}>0</p>

          <h3 className={styles.emptyTitle}>
            {t('emptyTitle')} <span className={styles.emptyTitleHighlight}>{t('emptyTitleHighlight')}</span>
          </h3>

          <p className={styles.emptyDescription}>
            {t('emptyDescription')}
          </p>

          <Link to="/" className={styles.emptyAction} onClick={() => window.scrollTo(0, 0)}>
            <Home className={styles.emptyActionIcon} strokeWidth={1.8} />
            {t('backToSpecialties')}
          </Link>
        </section>
      ) : (
        <div className={styles.grid}>
          {workshops.map((workshop) => (
            <ServiceCard
              key={workshop.idTaller}
              title={workshop.nombreTaller}
              description={workshop.descripcion}
              Icon={workshopIconMap[workshop.icono] ?? Sparkles}
              to="/reservar"
              state={{
                selectedWorkshopId: workshop.idTaller,
                selectedCourseId: course.id,
              }}
              onClick={() => window.scrollTo(0, 0)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
