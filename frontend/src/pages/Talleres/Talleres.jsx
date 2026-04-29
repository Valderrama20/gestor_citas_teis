import {
  Brush,
  Droplets,
  Flower2,
  Hand,
  Scissors,
  Sparkles,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard";
import courseService from "../../services/courseService";
import workshopService from "../../services/workshopService";
import styles from "./Talleres.module.css";

const workshopIconMap = {
  brush: Brush,
  droplets: Droplets,
  flower: Flower2,
  hand: Hand,
  scissors: Scissors,
  sparkles: Sparkles,
  waves: Waves,
};

export default function Talleres() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(undefined);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
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
          <h2 className={styles.title}>Cargando talleres...</h2>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.title}>Especialidad no encontrada</h2>
          <Link to="/" className={styles.backBtn}>
            Volver a especialidades
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.main}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          Volver a especialidades
        </Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.eyebrow}>Taller educativo</span>
        <h2 className={styles.title}>Talleres de {course.nombreCurso}</h2>
        <p className={styles.description}>{course.workshopPageDescription}</p>
      </div>

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
          />
        ))}
      </div>
    </section>
  );
}
