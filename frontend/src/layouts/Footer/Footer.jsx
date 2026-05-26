import styles from './Footer.module.css';
import { useState, useRef } from 'react';
import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiYoutube
} from '@icons-pack/react-simple-icons';
import contactService from '../../services/contactService';
import { useContext } from 'react';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const { t } = useTranslation('footer');

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!formData.nombre.trim()) {
      addToast(t('form.errors.nameRequired'), 'error');
      return;
    }
    if (!formData.email.trim()) {
      addToast(t('form.errors.emailRequired'), 'error');
      return;
    }
    if (!formData.mensaje.trim()) {
      addToast(t('form.errors.messageRequired'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.sendContactMessage({
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
      });

      addToast(t('form.success'), 'success');
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      addToast(t('form.errors.sendError'), 'error');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* --- BLOQUE CONTACTO Y FORMULARIO --- */}
        <div className={styles.contactFormBlock}>

          {/* Izquierda: Info de contacto */}
          <div className={styles.contactInfoSide}>
            <h3 className={styles.sectionTitleLeft}>{t('contact.title')}</h3>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>{t('contact.email')}</span>
              <a href="mailto:ies.teis@edu.xunta.gal" className={styles.infoValue}>ies.teis@edu.xunta.gal</a>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>{t('contact.phone')}</span>
              <a href="tel:+34886120464" className={styles.infoValue}>+34 886 12 04 64</a>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>{t('contact.address')}</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=IES+Teis,+Av.+de+Galicia,+101,+36216,+Vigo,+Pontevedra,+España"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoValue}
              >
                Av. de Galicia, 101, 36216<br />
                Teis, Vigo, Pontevedra<br />
                {t('contact.country')}
              </a>
            </div>
          </div>

          {/* Separador */}
          <div className={styles.contactDivider}></div>

          {/* Derecha: Formulario */}
          <div className={styles.contactFormSide}>
            <form className={styles.contactForm} onSubmit={handleContactSubmit} ref={formRef}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>{t('form.nameLabel')}</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder={t('form.namePlaceholder')}
                    value={formData.nombre}
                    onChange={handleContactChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>{t('form.emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('form.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleContactChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>{t('form.messageLabel')}</label>
                <textarea
                  name="mensaje"
                  placeholder={t('form.messagePlaceholder')}
                  rows="5"
                  value={formData.mensaje}
                  onChange={handleContactChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- BLOQUE INFERIOR: COPYRIGHT Y REDES SOCIALES --- */}
      <div className={styles.bottomBlock}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} IES Teis. {t('legal.rights')}
        </p>

        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com/iesdeteis/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
            <SiInstagram size={20} />
          </a>
          <a href="https://www.facebook.com/iesteis/?locale=es_ES" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
            <SiFacebook size={20} />
          </a>
          <a href="https://x.com/iesteis" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X (Twitter)">
            <SiX size={20} />
          </a>
          <a href="https://www.youtube.com/@Webteis" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
            <SiYoutube size={20} />
          </a>
        </div>

        <div className={styles.legalLinks}>
          <a href="#privacidad">{t('legal.privacy')}</a>
          <a href="#terminos">{t('legal.terms')}</a>
          <a href="#cookies">{t('legal.cookies')}</a>
        </div>
      </div>

    </footer>
  );
}
