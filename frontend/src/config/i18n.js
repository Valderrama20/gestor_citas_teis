import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonES from '../locales/es/common.json';
import homeES from '../locales/es/home.json';
import faqES from '../locales/es/faq.json';
import footerES from '../locales/es/footer.json';
import aboutES from '../locales/es/about.json';
import bookingES from '../locales/es/booking.json';
import appointmentFormES from '../locales/es/appointmentForm.json';
import adminES from '../locales/es/admin.json';
import notFoundES from '../locales/es/notFound.json';
import workshopsES from '../locales/es/workshops.json';

import commonGL from '../locales/gl/common.json';
import homeGL from '../locales/gl/home.json';
import faqGL from '../locales/gl/faq.json';
import footerGL from '../locales/gl/footer.json';
import aboutGL from '../locales/gl/about.json';
import bookingGL from '../locales/gl/booking.json';
import appointmentFormGL from '../locales/gl/appointmentForm.json';
import adminGL from '../locales/gl/admin.json';
import notFoundGL from '../locales/gl/notFound.json';
import workshopsGL from '../locales/gl/workshops.json';

import commonEN from '../locales/en/common.json';
import homeEN from '../locales/en/home.json';
import faqEN from '../locales/en/faq.json';
import footerEN from '../locales/en/footer.json';
import aboutEN from '../locales/en/about.json';
import bookingEN from '../locales/en/booking.json';
import appointmentFormEN from '../locales/en/appointmentForm.json';
import adminEN from '../locales/en/admin.json';
import notFoundEN from '../locales/en/notFound.json';
import workshopsEN from '../locales/en/workshops.json';

const resources = {
    es: {
        common: commonES,
        home: homeES,
        faq: faqES,
        footer: footerES,
        about: aboutES,
        booking: bookingES,
        appointmentForm: appointmentFormES,
        admin: adminES,
        notFound: notFoundES,
        workshops: workshopsES
    },
    gl: {
        common: commonGL,
        home: homeGL,
        faq: faqGL,
        footer: footerGL,
        about: aboutGL,
        booking: bookingGL,
        appointmentForm: appointmentFormGL,
        admin: adminGL,
        notFound: notFoundGL,
        workshops: workshopsGL
    },
    en: {
        common: commonEN,
        home: homeEN,
        faq: faqEN,
        footer: footerEN,
        about: aboutEN,
        booking: bookingEN,
        appointmentForm: appointmentFormEN,
        admin: adminEN,
        notFound: notFoundEN,
        workshops: workshopsEN
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es', // idioma de respaldo si falta alguna traducción
        ns: ['common', 'home', 'faq', 'footer', 'about', 'booking', 'appointmentForm', 'admin', 'notFound', 'workshops'], // declaramos los módulos disponibles
        defaultNS: 'common', // namespace por defecto para componentes genéricos
        interpolation: {
            escapeValue: false // React ya protege contra inyecciones XSS
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
