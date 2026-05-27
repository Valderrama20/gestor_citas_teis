package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.dto.CitaDTO;
import es.iesdeteis.gestorcitas.dto.CancelacionCitaRequest;
import es.iesdeteis.gestorcitas.dto.CancelacionCitaResponse;
import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.model.Usuario;
import es.iesdeteis.gestorcitas.service.ICitaService;
import es.iesdeteis.gestorcitas.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/citas")
public class CitaController {

    // --- ATRIBUTOS ---
    @Autowired
    private ICitaService citaService;

    @Autowired
    private TranslationService translationService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping
    public List<CitaDTO> getCitas(Locale locale) {
        return toDtoList(citaService.findAll(), locale);
    }

    @GetMapping("/taller/{idTaller}")
    public List<CitaDTO> getCitasByTaller(@PathVariable Long idTaller, Locale locale) {
        if (idTaller == null || idTaller <= 0) {
            return List.of();
        }
        return toDtoList(citaService.findByTallerIdTaller(idTaller), locale);
    }

    @GetMapping("/curso/{idCurso}")
    public List<CitaDTO> getCitasByCurso(@PathVariable Long idCurso, Locale locale) {
        if (idCurso == null || idCurso <= 0) {
            return List.of();
        }
        return toDtoList(citaService.findByCursoId(idCurso), locale);
    }

    @GetMapping("/{id}")
    public CitaDTO getCitaById(@PathVariable Long id, Locale locale) {
        return toDto(citaService.findById(id), locale);
    }

    @PostMapping
    public void saveCita(@RequestBody Cita cita) {
        citaService.save(cita);
    }

    @DeleteMapping("/{id}")
    public void deleteCita(@PathVariable Long id) {
        citaService.deleteById(id);
    }

    @PutMapping
    public void updateCita(@RequestBody Cita cita) {
        citaService.save(cita);
    }

    @PostMapping("/cancelar")
    public ResponseEntity<CancelacionCitaResponse> cancelarCita(@RequestBody(required = false) CancelacionCitaRequest request) {
        String token = request != null ? request.getToken() : null;
        CancelacionCitaResponse response = citaService.cancelarPorToken(token);
        HttpStatus status = switch (response.getStatus()) {
            case "CANCELADA", "YA_CANCELADA" -> HttpStatus.OK;
            case "NO_ENCONTRADA" -> HttpStatus.NOT_FOUND;
            case "TOKEN_EXPIRADO" -> HttpStatus.GONE;
            default -> HttpStatus.BAD_REQUEST;
        };

        return ResponseEntity.status(status).body(response);
    }

    private List<CitaDTO> toDtoList(List<Cita> citas, Locale locale) {
        return citas.stream()
                .map(cita -> toDto(cita, locale))
                .toList();
    }

    private CitaDTO toDto(Cita cita, Locale locale) {
        if (cita == null) {
            return null;
        }

        CitaDTO dto = new CitaDTO();
        dto.setIdCita(cita.getIdCita());
        dto.setFecha(cita.getFecha());
        dto.setHora(cita.getHora());
        dto.setEstado(cita.getEstado());

        Usuario cliente = cita.getCliente();
        if (cliente != null) {
            CitaDTO.ClienteDTO clienteDto = new CitaDTO.ClienteDTO();
            clienteDto.setIdUsuario(cliente.getIdUsuario());
            clienteDto.setNombre(cliente.getNombre());
            clienteDto.setEmail(cliente.getEmail());
            dto.setCliente(clienteDto);
        }

        Taller taller = cita.getTaller();
        if (taller != null) {
            CitaDTO.TallerDTO tallerDto = new CitaDTO.TallerDTO();
            tallerDto.setIdTaller(taller.getIdTaller());
            tallerDto.setNombreTaller(translationService.workshopName(taller.getIdTaller(), taller.getNombreTaller(), locale));
            tallerDto.setIdCurso(taller.getIdCurso());
            dto.setTaller(tallerDto);
        }

        return dto;
    }
}
