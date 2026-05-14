package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.dto.CitaDTO;
import es.iesdeteis.gestorcitas.dto.CancelacionCitaRequest;
import es.iesdeteis.gestorcitas.dto.CancelacionCitaResponse;
import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.model.Usuario;
import es.iesdeteis.gestorcitas.service.ICitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    // --- ATRIBUTOS ---
    @Autowired
    private ICitaService citaService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping
    public List<CitaDTO> getCitas() {
        return toDtoList(citaService.findAll());
    }

    @GetMapping("/taller/{idTaller}")
    public List<CitaDTO> getCitasByTaller(@PathVariable Long idTaller) {
        if (idTaller == null || idTaller <= 0) {
            return List.of();
        }
        return toDtoList(citaService.findByTallerIdTaller(idTaller));
    }

    @GetMapping("/curso/{idCurso}")
    public List<CitaDTO> getCitasByCurso(@PathVariable Long idCurso) {
        if (idCurso == null || idCurso <= 0) {
            return List.of();
        }
        return toDtoList(citaService.findByCursoId(idCurso));
    }

    @GetMapping("/{id}")
    public CitaDTO getCitaById(@PathVariable Long id) {
        return toDto(citaService.findById(id));
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

    private List<CitaDTO> toDtoList(List<Cita> citas) {
        return citas.stream()
                .map(this::toDto)
                .toList();
    }

    private CitaDTO toDto(Cita cita) {
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
            tallerDto.setNombreTaller(taller.getNombreTaller());
            tallerDto.setIdCurso(taller.getIdCurso());
            dto.setTaller(tallerDto);
        }

        return dto;
    }
}