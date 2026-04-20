import {
  Brush,
  Droplets,
 Flower2,
  Hand,
  Scissors,
  Sparkles,
  Waves,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard";
import styles from "./Talleres.module.css";

const courseContent = {
  "1": {
    name: "Peluqueria",
    description:
      "Selecciona un taller de ejemplo para ver como podriamos organizar los servicios disponibles.",
    workshops: [
      {
        id: "corte",
        title: "Corte y peinado",
        description: "Cortes clasicos, brushing y acabados para el dia a dia.",
        Icon: Scissors,
      },
      {
        id: "color",
        title: "Coloracion",
        description: "Tintes, matices y retoque de raiz con asesoria previa.",
        Icon: Sparkles,
      },
      {
        id: "tratamiento",
        title: "Tratamiento capilar",
        description: "Hidratacion profunda, mascarillas y cuidado del cuero cabelludo.",
        Icon: Droplets,
      },
      {
        id: "recogidos",
        title: "Recogidos",
        description: "Peinados para eventos, ondas y recogidos de practica.",
        Icon: Waves,
      },
    ],
  },
  "2": {
    name: "Cuidado Facial",
    description:
      "Estos bloques sirven como placeholder para futuras fichas de tratamientos faciales.",
    workshops: [
      {
        id: "limpieza",
        title: "Limpieza facial",
        description: "Rutina completa con exfoliacion, vapor y extraccion suave.",
        Icon: Sparkles,
      },
      {
        id: "maquillaje",
        title: "Maquillaje social",
        description: "Pruebas de maquillaje de dia, tarde y eventos sencillos.",
        Icon: Brush,
      },
      {
        id: "hidratacion",
        title: "Hidratacion intensiva",
        description: "Mascarillas y activos adaptados a cada tipo de piel.",
        Icon: Droplets,
      },
      {
        id: "cejas",
        title: "Diseno de cejas",
        description: "Perfilado basico y armonizacion del rostro.",
        Icon: Flower2,
      },
    ],
  },
  "3": {
    name: "Tratamiento Corporal",
    description:
      "Aqui puedes mostrar mas adelante cada servicio corporal con sus horarios y plazas.",
    workshops: [
      {
        id: "masaje",
        title: "Masaje relajante",
        description: "Sesiones enfocadas en bienestar, descarga y relajacion.",
        Icon: Flower2,
      },
      {
        id: "exfoliacion",
        title: "Exfoliacion corporal",
        description: "Preparacion de la piel con productos y maniobras suaves.",
        Icon: Droplets,
      },
      {
        id: "depilacion",
        title: "Depilacion basica",
        description: "Practicas guiadas por zonas con protocolo higienico.",
        Icon: Sparkles,
      },
      {
        id: "ritual",
        title: "Ritual spa",
        description: "Experiencia combinada con envoltura y masaje final.",
        Icon: Waves,
      },
    ],
  },
  "4": {
    name: "Manicura",
    description:
      "Estos ejemplos mantienen la misma presentacion del inicio y ayudan a visualizar el flujo.",
    workshops: [
      {
        id: "manicura-basica",
        title: "Manicura basica",
        description: "Limpieza, limado, cuticulas y esmaltado tradicional.",
        Icon: Hand,
      },
      {
        id: "pedicura",
        title: "Pedicura",
        description: "Cuidado integral del pie con acabado estetico.",
        Icon: Flower2,
      },
      {
        id: "semipermanente",
        title: "Semipermanente",
        description: "Aplicacion de color de larga duracion y retirada segura.",
        Icon: Sparkles,
      },
      {
        id: "nail-art",
        title: "Nail art",
        description: "Disenos sencillos para practicas creativas del alumnado.",
        Icon: Brush,
      },
    ],
  },
};

export default function Talleres() {
  const { courseId } = useParams();
  const currentCourse = courseContent[courseId] ?? courseContent["1"];

  return (
    <section className={styles.main}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          Volver a especialidades
        </Link>
      </div>

      <div className={styles.hero}>
        <span className={styles.eyebrow}>Taller educativo</span>
        <h2 className={styles.title}>Talleres de {currentCourse.name}</h2>
        <p className={styles.description}>{currentCourse.description}</p>
      </div>

      <div className={styles.grid}>
        {currentCourse.workshops.map((workshop) => (
          <ServiceCard
            key={workshop.id}
            title={workshop.title}
            description={workshop.description}
            Icon={workshop.Icon}
            to="/reservar"
            state={{
              selectedWorkshop: workshop.title,
              selectedCourse: currentCourse.name,
            }}
          />
        ))}
      </div>
    </section>
  );
}
