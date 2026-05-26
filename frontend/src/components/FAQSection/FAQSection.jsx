import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './FAQSection.module.css';

export default function FAQSection() {
    const { t } = useTranslation('faq');
    const faqItems = t('items', { returnObjects: true });

    return (
        <div className={styles.faqWrapper}>
            <div className={styles.faqBlock}>
                <div className={styles.faqHeader}>
                    <h2 className={styles.title}>
                        {t('title1')}<span className={styles.highlight}>{t('title2')}</span>
                    </h2>
                    <p className={styles.faqDescription}>
                        {t('description')}
                    </p>
                </div>

                <div className={styles.faqSection}>
                    <div className={styles.faqList}>
                        {faqItems.map((faq, idx) => (
                            <details key={idx} name="faq-accordion" className={styles.faqItem}>
                                <summary className={styles.faqSummary}>
                                    <span className={styles.faqText}>{faq.q}</span>
                                    <ChevronDown className={styles.faqIcon} size={22} />
                                </summary>
                                <div className={styles.faqContent}>{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}