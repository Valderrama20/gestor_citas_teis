import styles from './Footer.module.css';
import { useState, useRef } from 'react';
import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiYoutube
} from '@icons-pack/react-simple-icons';
import { ChevronDown } from 'lucide-react';
import contactService from '../../services/contactService';
import { useContext } from 'react';
import { useToast } from '../../context/ToastContext';

const faqs = [
  { q: "¿Quién realiza los tratamientos?", a: "Todos los servicios son realizados por nuestros alumnos en formación, siempre bajo la supervisión directa de profesores cualificados." },
  { q: "¿Es seguro realizarse tratamientos aquí?", a: "Totalmente. Los profesores evalúan y guían cada paso del proceso para garantizar tu seguridad y un excelente resultado." },
  { q: "¿Cuánto tiempo duran las citas?", a: "Al ser un entorno de aprendizaje, los tratamientos pueden llevar algo más de tiempo que en un salón convencional. Agradecemos tu paciencia." },
  { q: "¿Los servicios tienen algún coste?", a: "Tienen precios muy reducidos, destinados únicamente a cubrir el coste de los materiales profesionales utilizados durante las prácticas." },
  { q: "¿Qué ocurre si no estoy satisfecho?", a: "Nuestros profesores están presentes para intervenir en cualquier momento y asegurar que el resultado final cumpla con los estándares." },
  { q: "¿Puedo elegir qué alumno me atiende?", a: "Las asignaciones se realizan en base a las rotaciones y necesidades de aprendizaje de los alumnos, por lo que no es posible elegir." },
  { q: "¿Qué tipo de productos utilizáis?", a: "Empleamos exclusivamente productos profesionales de peluquería y estética de primeras marcas." },
  { q: "¿Es obligatorio pedir cita previa?", a: "Sí, es imprescindible reservar tu plaza a través de esta plataforma para poder organizar las clases adecuadamente." },
  { q: "¿Puedo cancelar mi cita si surge un imprevisto?", a: "Por supuesto. Te rogamos que lo hagas con la mayor antelación posible desde la aplicación para poder asignar el turno a otra persona." },
  { q: "¿Tienen flexibilidad horaria?", a: "Nuestros horarios de atención están estrictamente vinculados a las horas lectivas del centro educativo y sus módulos." }
];

export default function Footer() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

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
      addToast('Por favor, ingresa tu nombre', 'error');
      return;
    }
    if (!formData.email.trim()) {
      addToast('Por favor, ingresa tu correo electrónico', 'error');
      return;
    }
    if (!formData.mensaje.trim()) {
      addToast('Por favor, escribe un mensaje', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.sendContactMessage({
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
      });

      addToast('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      addToast('Error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* --- BLOQUE FAQS (ESTILO ACTUALIZADO) --- */}
        <div className={styles.faqBlock}>
          <div className={styles.faqHeader}>

            <h3 className={styles.sectionTitleLeft}>Preguntas frecuentes</h3>

            <p className={styles.faqDescription}>
              Conoce todos los detalles sobre nuestros servicios, horarios y funcionamiento.
              Si no ves tu pregunta en la lista, no dudes en{' '}
              <a href="mailto:ies.teis@edu.xunta.gal">ponerte en contacto con nosotros</a>.
            </p>
          </div>

          <div className={styles.faqSection}>
            <div className={styles.faqList}>
              {faqs.map((faq, idx) => (
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

        {/* --- BLOQUE CONTACTO Y FORMULARIO (NUEVO) --- */}
        <div className={styles.contactFormBlock}>

          {/* Izquierda: Info de contacto */}
          <div className={styles.contactInfoSide}>
            <h3 className={styles.sectionTitleLeft}>Contacto</h3>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Email:</span>
              <a href="mailto:ies.teis@edu.xunta.gal" className={styles.infoValue}>ies.teis@edu.xunta.gal</a>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Teléfono:</span>
              <a href="tel:+34886120464" className={styles.infoValue}>+34 886 12 04 64</a>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Dirección:</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=IES+Teis,+Av.+de+Galicia,+101,+36216,+Vigo,+Pontevedra,+España"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoValue}
              >
                Av. de Galicia, 101, 36216<br />
                Teis, Vigo, Pontevedra<br />
                España
              </a>
            </div>
          </div>

          {/* Derecha: Formulario */}
          <div className={styles.contactFormSide}>
            <form className={styles.contactForm} onSubmit={handleContactSubmit} ref={formRef}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Tu Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre completo"
                    value={formData.nombre}
                    onChange={handleContactChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    value={formData.email}
                    onChange={handleContactChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Mensaje</label>
                <textarea
                  name="mensaje"
                  placeholder="Escribe algo..."
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
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- BLOQUE INFERIOR: COPYRIGHT Y REDES SOCIALES --- */}
      <div className={styles.bottomBlock}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} IES Teis. Todos los derechos reservados.
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
          <a href="#privacidad">Política de Privacidad</a>
          <a href="#terminos">Términos y Condiciones</a>
          <a href="#cookies">Política de Cookies</a>
        </div>
      </div>

    </footer>
  );
}
