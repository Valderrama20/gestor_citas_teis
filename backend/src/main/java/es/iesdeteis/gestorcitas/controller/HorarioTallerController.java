package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.dto.HorarioDisponibleDTO;
import es.iesdeteis.gestorcitas.enums.EstadoCita;
import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.model.HorarioTaller;
import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.service.ICitaService;
import es.iesdeteis.gestorcitas.service.IHorarioTallerService;
import es.iesdeteis.gestorcitas.service.ITallerService;
import es.iesdeteis.gestorcitas.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.text.Normalizer;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/horarios-talleres")
public class HorarioTallerController {

    // --- ATRIBUTOS ---
    @Autowired
    private IHorarioTallerService horarioTallerService;

    @Autowired
    private ICitaService citaService;

    @Autowired
    private ITallerService tallerService;

    @Autowired
    private TranslationService translationService;

    private static final int SEMANAS_POR_DEFECTO = 4;
    private static final DateTimeFormatter HORA_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    // --- MÉTODOS PROPIOS ---
    @GetMapping
    public List<HorarioTaller> getTalleres() {
        return horarioTallerService.findAll();
    }

    @GetMapping("/{id}")
    public HorarioTaller getHorarioTallerById(@PathVariable Long id) {
        return horarioTallerService.findById(id);
    }

    @GetMapping("/taller/{idTaller}")
    public List<HorarioDisponibleDTO> getDisponibilidadByTaller(
            @PathVariable Long idTaller,
            @RequestParam(name = "semanas", required = false, defaultValue = "4") int semanas,
            Locale locale
    ) {
        if (idTaller == null || idTaller <= 0) {
            return List.of();
        }

        int semanasFinal = semanas > 0 ? semanas : SEMANAS_POR_DEFECTO;

        List<HorarioTaller> horarios = horarioTallerService.findByTallerId(idTaller);
        if (horarios.isEmpty()) {
            return List.of();
        }

        Taller taller = tallerService.findById(idTaller);
        Integer capacidadMaxima = taller != null ? taller.getCapacidadMaxima() : null;

        Map<LocalDate, Long> ocupacionPorFecha = citaService.findByTallerIdTaller(idTaller).stream()
                .filter(cita -> cita != null && cita.getFecha() != null)
                .filter(cita -> cita.getEstado() != EstadoCita.CANCELADA)
                .collect(Collectors.groupingBy(Cita::getFecha, Collectors.counting()));

        return horarios.stream()
            .flatMap(horario -> buildDisponibilidadSemanas(horario, idTaller, capacidadMaxima, ocupacionPorFecha, semanasFinal, locale).stream())
            .filter(dto -> dto != null)
            .filter(dto -> dto.getCapacidadMaxima() == null
                || dto.getOcupacionActual() < dto.getCapacidadMaxima())
            .toList();
    }


    @PostMapping
    public void saveHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }

    @DeleteMapping("/{id}")
    public void deleteHorarioTaller(@PathVariable Long id) {
        horarioTallerService.deleteById(id);
    }

    @PutMapping
    public void updateHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }

    private List<HorarioDisponibleDTO> buildDisponibilidadSemanas(
            HorarioTaller horario,
            Long idTaller,
            Integer capacidadMaxima,
            Map<LocalDate, Long> ocupacionPorFecha,
                int semanas,
                Locale locale
    ) {
        if (horario == null) {
            return List.of();
        }

        LocalDate base = calcularProximaFecha(horario.getDiaSemana());
        if (base == null) {
            return List.of();
        }

        List<HorarioDisponibleDTO> resultados = new ArrayList<>();
        for (int i = 0; i < semanas; i++) {
            LocalDate fecha = base.plusWeeks(i);
            HorarioDisponibleDTO dto = toDisponibleDto(horario, idTaller, capacidadMaxima, ocupacionPorFecha, fecha, locale);
            if (dto != null) {
                resultados.add(dto);
            }
        }

        return resultados;
    }

    private HorarioDisponibleDTO toDisponibleDto(
            HorarioTaller horario,
            Long idTaller,
            Integer capacidadMaxima,
            Map<LocalDate, Long> ocupacionPorFecha,
                LocalDate fecha,
                Locale locale
    ) {
        if (horario == null) {
            return null;
        }

        String diaSemana = horario.getDiaSemana();
        int ocupacion = fecha != null
                ? ocupacionPorFecha.getOrDefault(fecha, 0L).intValue()
                : 0;

        Taller taller = horario.getIdTaller();
        Integer capacidad = capacidadMaxima != null
                ? capacidadMaxima
                : (taller != null ? taller.getCapacidadMaxima() : null);

        HorarioDisponibleDTO dto = new HorarioDisponibleDTO();
        dto.setId(horario.getIdHorario());
        dto.setWorkshopId(taller != null ? taller.getIdTaller() : idTaller);
        dto.setLabel(buildLabel(diaSemana, horario.getHoraApertura(), horario.getHoraCierre(), locale));
        dto.setDate(diaSemana);
        dto.setTime(formatHora(horario.getHoraApertura()));
        dto.setFecha(fecha);
        dto.setCapacidadMaxima(capacidad);
        dto.setOcupacionActual(ocupacion);
        return dto;
    }

    private String buildLabel(String diaSemana, Time horaInicio, Time horaFin, Locale locale) {
        return translationService.scheduleLabel(diaSemana, horaInicio, horaFin, locale);
    }

    private String formatHora(Time hora) {
        if (hora == null) {
            return "";
        }
        return hora.toLocalTime().format(HORA_FORMATTER);
    }

    private LocalDate calcularProximaFecha(String diaSemana) {
        DayOfWeek dayOfWeek = parseDiaSemana(diaSemana);
        if (dayOfWeek == null) {
            return null;
        }

        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        return today.with(TemporalAdjusters.nextOrSame(dayOfWeek));
    }

    private DayOfWeek parseDiaSemana(String diaSemana) {
        if (diaSemana == null) {
            return null;
        }

        String normalized = Normalizer.normalize(diaSemana, Normalizer.Form.NFD);
        String cleaned = normalized.replaceAll("\\p{M}", "").trim().toLowerCase(Locale.ROOT);

        return switch (cleaned) {
            case "lunes" -> DayOfWeek.MONDAY;
            case "martes" -> DayOfWeek.TUESDAY;
            case "miercoles" -> DayOfWeek.WEDNESDAY;
            case "jueves" -> DayOfWeek.THURSDAY;
            case "viernes" -> DayOfWeek.FRIDAY;
            case "sabado" -> DayOfWeek.SATURDAY;
            case "domingo" -> DayOfWeek.SUNDAY;
            default -> null;
        };
    }
}
