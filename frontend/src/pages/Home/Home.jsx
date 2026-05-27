import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "../../components/ServiceCard";
import courseService from "../../services/courseService";
import FAQSection from "../../components/FAQSection";
import styles from "./Home.module.css";
import { courseIconMap } from "../../constants/icons";

export default function Home() {
  const [specialties, setSpecialties] = useState([]);
  const { t } = useTranslation('home');

  useEffect(() => {
    window.scrollTo(0, 0);
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
        <span className={styles.tagline}>{t("hero.tagline")}</span>
        <h1 className={styles.title}>
          {t("hero.title1")}<span className={styles.titleHighlight}>{t("hero.titleHighlight")}</span>
          <span className={styles.breakDesktop}>{t("hero.title2")}</span>
        </h1>
        <p className={styles.subtitle}>
          {t("hero.subtitle")}
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
            onClick={() => window.scrollTo(0, 0)}
          />
        ))}
      </div>

      <FAQSection />
    </section>
  );
}
