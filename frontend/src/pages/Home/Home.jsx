import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import courseService from "../../services/courseService";
import FAQSection from "../../components/FAQSection";
import styles from "./Home.module.css";
import { courseIconMap } from "../../constants/icons";

export default function Home() {
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      const courses = await courseService.getPublicCourses();

      console.log(courses);

      if (isMounted) {
        setSpecialties(courses);
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.main}>
      <div className={styles.header}>
        <span className={styles.tagline}>Ciclo Formativo de Grado Medio y Superior</span>
        <h1 className={styles.title}>
          Realza tu <span className={styles.titleHighlight}>belleza natural</span>
          <span className={styles.breakDesktop}> con el talento de nuestros alumn@s</span>
        </h1>
        <p className={styles.subtitle}>
          Tratamientos profesionales de peluqueria y estetica a precios de
          taller educativo. Elige tu especialidad.
        </p>
      </div>

      <div className={styles.grid}>
        {specialties.map((specialty) => (
          <ServiceCard
            key={specialty.idCurso}
            title={specialty.nombreCurso}
            description={specialty.descripcion}
            Icon={courseIconMap[specialty.icono] ?? Sparkles}
            to={`/curso/${specialty.idCurso}/talleres`}
          />
        ))}
      </div>

      <FAQSection />
    </section>
  );
}
