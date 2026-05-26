import { Phone, Scissors, Sparkles, Wind, Zap } from "lucide-react";
import FAQSection from "../../components/FAQSection";
import styles from "./AboutUs.module.css";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
    const { t } = useTranslation('about');

    const serviceCategories = t('services.categories', { returnObjects: true });
    const serviceIcons = [Sparkles, Scissors];

    const services = serviceCategories.map((cat, idx) => ({
        icon: serviceIcons[idx] || Sparkles,
        title: cat.title,
        items: cat.items
    }));

    const workshops = [
        { name: `${t('booking.workshopPrefix')} 1`, phone: "886 120 469" },
        { name: `${t('booking.workshopPrefix')} 2`, phone: "886 120 468" },
        { name: `${t('booking.workshopPrefix')} 3`, phone: "886 120 461" },
        { name: `${t('booking.workshopPrefix')} 4`, phone: "886 120 463" },
    ];

    return (
        <main className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        {t('header.title1')}<span className={styles.highlight}>{t('header.titleHighlight')}</span>
                    </h1>
                    <p className={styles.subtitle}>
                        {t('header.subtitle')}
                    </p>
                </div>
                <div className={styles.glowTop} />
            </section>

            {/* Introducción */}
            <section className={styles.intro}>
                <div className={styles.introContent}>
                    <h2 className={styles.sectionTitle}>{t('intro.title')}</h2>
                    <p className={styles.introText}>
                        {t('intro.text')}
                    </p>
                </div>
            </section>

            {/* Servicios */}
            <section className={styles.services}>
                <h2 className={styles.sectionTitle}>{t('services.title')}</h2>
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
                        <h2 className={styles.sectionTitle}>{t('booking.title')}</h2>
                        <p className={styles.bookingDescription}>
                            {t('booking.description1')}
                        </p>
                        <p className={styles.bookingSubtext}>
                            {t('booking.description2')}
                        </p>
                    </div>

                    <div className={styles.workshopsGrid}>
                        {workshops.map((workshop) => (
                            <a href={`tel:${workshop.phone}`} className={styles.phoneLink}>
                                <div key={workshop.name} className={styles.workshopCard}>
                                    <Phone className={styles.phoneIcon} strokeWidth={1.8} />
                                    <h4 className={styles.workshopName}>{workshop.name}</h4>
                                    {workshop.phone}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div className={styles.glowBottom} />
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <h2 className={styles.ctaTitle}>
                    {t('cta.title')}
                </h2>
                <a href="/reservar" className={styles.ctaButton}>
                    {t('cta.button')}
                </a>
            </section>

            <FAQSection />
        </main>
    );
}
