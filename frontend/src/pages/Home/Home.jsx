import { Flower2, Hand, Scissors, Sparkles } from "lucide-react";
import styles from "./Home.module.css";
import ServiceCard from "../../components/ServiceCard";

const specialties = [
  {
    id: 1,
    title: "Peluqueria",
    description: "Corte, colorimetria y tratamientos capilares.",
    Icon: Scissors,
  },
  {
    id: 2,
    title: "Cuidado Facial",
    description: "Higiene, hidratacion y maquillaje profesional.",
    Icon: Sparkles,
  },
  {
    id: 3,
    title: "Tratamiento Corporal",
    description: "Masajes, exfoliaciones y depilacion.",
    Icon: Flower2,
  },
  {
    id: 4,
    title: "Manicura",
    description: "Cuidado de unas, esmaltado y pedicura.",
    Icon: Hand,
  },
];

export default function Home() {
  return (
    <section className={styles.main}>
      <div className={styles.header}>
        <span className={styles.tagline}>Ciclo Formativo de Grado Medio y Superior</span>
        <h1 className={styles.title}>
          Realza tu <span className={styles.titleHighlight}>belleza natural</span>
          <span className={styles.breakDesktop}> con el talento de nuestros alumnos</span>
        </h1>
        <p className={styles.subtitle}>
          Tratamientos profesionales de peluqueria y estetica a precios de
          taller educativo. Elige tu especialidad.
        </p>
      </div>

      <div className={styles.grid}>
        {specialties.map((specialty) => (
          <ServiceCard
            key={specialty.id}
            title={specialty.title}
            description={specialty.description}
            Icon={specialty.Icon}
            to={`/curso/${specialty.id}/talleres`}
          />
        ))}
      </div>
    </section>
  );
}
