import { Phone, Scissors, Sparkles, Wind, Zap } from "lucide-react";
import styles from "./AboutUs.module.css";

export default function AboutUs() {
    const services = [
        {
            icon: Sparkles,
            title: "Estética y Bienestar",
            items: [
                "Tratamientos faciales: Higiene facial, hidratación y tratamientos específicos",
                "Tratamientos corporales: Masajes relajantes, drenaje linfático",
                "Manicura y Pedicura: Cuidado de uñas y esmaltado",
                "Depilación: Cera y otros métodos",
                "Maquillaje: Social, de día, noche o eventos",
            ],
        },
        {
            icon: Scissors,
            title: "Peluquería",
            items: [
                "Corte, peinado y acabados",
                "Coloración: tintes, mechas, balayage",
                "Tratamientos capilares específicos",
            ],
        },
    ];

    const workshops = [
        { name: "Taller 1", phone: "886 120 469" },
        { name: "Taller 2", phone: "886 120 468" },
        { name: "Taller 3", phone: "886 120 461" },
        { name: "Taller 4", phone: "886 120 463" },
    ];

    return (
        <main className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        Sobre <span className={styles.highlight}>Nosotros</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Servicios de estética y peluquería de calidad a precios accesibles
                    </p>
                </div>
                <div className={styles.glowTop} />
            </section>

            {/* Introducción */}
            <section className={styles.intro}>
                <div className={styles.introContent}>
                    <h2 className={styles.sectionTitle}>Nuestro Departamento</h2>
                    <p className={styles.introText}>
                        El IES de Teis, a través del departamento de Imagen Personal, ofrece servicios
                        de estética y peluquería abiertos al público general. Estos servicios son
                        realizados por el alumnado de los diferentes Ciclos Formativos como parte de su
                        formación práctica, siempre bajo la supervisión del profesorado.
                    </p>
                </div>
            </section>

            {/* Servicios */}
            <section className={styles.services}>
                <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
                <div className={styles.servicesGrid}>
                    {services.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <div key={service.title} className={styles.serviceCard}>
                                <div className={styles.serviceIconBox}>
                                    <IconComponent className={styles.serviceIcon} strokeWidth={1.8} />
                                </div>
                                <h3 className={styles.serviceTitle}>{service.title}</h3>
                                <ul className={styles.serviceList}>
                                    {service.items.map((item) => (
                                        <li key={item} className={styles.serviceItem}>
                                            <span className={styles.bullet}>•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Cita Previa */}
            <section className={styles.booking}>
                <div className={styles.bookingContent}>
                    <div className={styles.bookingText}>
                        <h2 className={styles.sectionTitle}>Cita Previa</h2>
                        <p className={styles.bookingDescription}>
                            Para disfrutar de nuestros servicios a precios muy reducidos (destinados
                            a cubrir el coste de los materiales), es obligatorio solicitar cita previa.
                        </p>
                        <p className={styles.bookingSubtext}>
                            Puedes reservar tu cita a través de nuestra plataforma o contactando
                            directamente con cualquiera de nuestros talleres.
                        </p>
                    </div>

                    <div className={styles.workshopsGrid}>
                        {workshops.map((workshop) => (
                            <div key={workshop.name} className={styles.workshopCard}>
                                <Phone className={styles.phoneIcon} strokeWidth={1.8} />
                                <h4 className={styles.workshopName}>{workshop.name}</h4>
                                <a href={`tel:${workshop.phone}`} className={styles.phoneLink}>
                                    {workshop.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.glowBottom} />
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <h2 className={styles.ctaTitle}>
                    ¿Listo para reservar tu cita?
                </h2>
                <a href="/reservar" className={styles.ctaButton}>
                    Reservar Ahora
                </a>
            </section>
        </main>
    );
}
