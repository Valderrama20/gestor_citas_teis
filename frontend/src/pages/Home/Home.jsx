import styles from "./Home.module.css";
import FeatureCard from "../../components/FeatureCard";

const data = [
    {
        id: 1,
        icon: "✂️",
        title: "Corte Clásico",
        description:
            "Estilos atemporales y modernos adaptados a tus gustos y tipo de cabello.",
    },
    {
        id: 2,
        icon: "🧔",
        title: "Arreglo de Barba",
        description:
            "Perfilado, rebajado y tratamiento con toalla caliente para una barba impecable.",
    },
    {
        id: 3,
        icon: "🎨",
        title: "Coloración",
        description:
            "Tintes, mechas y reflejos de primera calidad que respetan tu salud capilar.",
    },
];

export default function Home() {
    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Bienvenido a la Peluquería</h1>
            <p className={styles.subtitle}>
                Los mejores cortes y arreglos de la ciudad.
            </p>

            <div className={styles.featuresGrid}>
                {data.map((carta) => {
                    return (
                        <FeatureCard
                            icon={carta.icon}
                            title={carta.title}
                            description={carta.description}
                        />
                    );
                })}
            </div>
        </div>
    );
}
