package es.iesdeteis.gestorcitas.service;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.Map;
import java.util.Locale;

@Service
public class TranslationService {

    private static final Map<String, String> COURSE_KEYS = new HashMap<>();
    private static final Map<String, String> WORKSHOP_KEYS = new HashMap<>();

    static {
        COURSE_KEYS.put("peluqueria", "course.1");
        COURSE_KEYS.put("cuidado facial", "course.2");
        COURSE_KEYS.put("tratamiento corporal", "course.3");
        COURSE_KEYS.put("manicura", "course.4");
        COURSE_KEYS.put("maquillaje artistico", "course.5");
        COURSE_KEYS.put("spa y bienestar", "course.6");

        WORKSHOP_KEYS.put("corte y peinado", "workshop.1");
        WORKSHOP_KEYS.put("colorimetria", "workshop.2");
        WORKSHOP_KEYS.put("limpieza facial", "workshop.3");
        WORKSHOP_KEYS.put("manicura y pedicura", "workshop.4");
        WORKSHOP_KEYS.put("maquillaje social", "workshop.5");
        WORKSHOP_KEYS.put("maquillaje de fantasia", "workshop.6");
        WORKSHOP_KEYS.put("pestanas y cejas", "workshop.7");
        WORKSHOP_KEYS.put("masaje relajante", "workshop.8");
        WORKSHOP_KEYS.put("aromaterapia", "workshop.9");
        WORKSHOP_KEYS.put("hidroterapia", "workshop.10");
    }

    private final MessageSource messageSource;

    public TranslationService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String courseName(Long courseId, String fallback, Locale locale) {
        return messageForCourse(courseId, fallback, locale, "name");
    }

    public String courseDescription(Long courseId, String fallback, Locale locale) {
        return messageForCourse(courseId, fallback, locale, "description");
    }

    public String courseLevel(String level, Locale locale) {
        return message("level." + normalizeKey(level), level, locale);
    }

    public String courseWorkshopPageDescription(Long courseId, String fallback, Locale locale) {
        return messageForCourse(courseId, fallback, locale, "workshopPageDescription");
    }

    public String workshopName(Long workshopId, String fallback, Locale locale) {
        return messageForWorkshop(workshopId, fallback, locale, "name");
    }

    public String workshopDescription(Long workshopId, String fallback, Locale locale) {
        return messageForWorkshop(workshopId, fallback, locale, "description");
    }

    public String workshopType(Long workshopId, String fallback, Locale locale) {
        return messageForWorkshop(workshopId, fallback, locale, "type");
    }

    public String weekday(String day, Locale locale) {
        if (day == null || day.trim().isEmpty()) {
            return "";
        }
        return message("weekday." + normalizeKey(day), day, locale);
    }

    public String scheduleLabel(String day, Time start, Time end, Locale locale) {
        String weekday = weekday(day, locale);
        String from = message("schedule.from", "de", locale);
        String to = message("schedule.to", "a", locale);
        String startTime = start != null ? start.toLocalTime().toString().substring(0, 5) : "";
        String endTime = end != null ? end.toLocalTime().toString().substring(0, 5) : "";
        return weekday + " - " + from + " " + startTime + " " + to + " " + endTime;
    }

    private String message(String key, String fallback, Locale locale) {
        return messageSource.getMessage(key, null, fallback, locale);
    }

    private String messageForCourse(Long courseId, String fallback, Locale locale, String suffix) {
        if (courseId != null) {
            String key = "course." + courseId + "." + suffix;
            String translated = messageSource.getMessage(key, null, null, locale);
            if (translated != null) {
                return translated;
            }
        }

        String alias = COURSE_KEYS.get(normalizeLookup(fallback));
        if (alias != null) {
            String translated = messageSource.getMessage(alias + "." + suffix, null, null, locale);
            if (translated != null) {
                return translated;
            }
        }

        return fallback;
    }

    private String messageForWorkshop(Long workshopId, String fallback, Locale locale, String suffix) {
        if (workshopId != null) {
            String key = "workshop." + workshopId + "." + suffix;
            String translated = messageSource.getMessage(key, null, null, locale);
            if (translated != null) {
                return translated;
            }
        }

        String alias = WORKSHOP_KEYS.get(normalizeLookup(fallback));
        if (alias != null) {
            String translated = messageSource.getMessage(alias + "." + suffix, null, null, locale);
            if (translated != null) {
                return translated;
            }
        }

        return fallback;
    }

    private String normalizeKey(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").trim().toLowerCase(Locale.ROOT).replace(' ', '_');
    }

    private String normalizeLookup(String value) {
        if (value == null) {
            return "";
        }
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "").trim().toLowerCase(Locale.ROOT);
    }
}