package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.dto.TallerDTO;
import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.service.ITallerService;
import es.iesdeteis.gestorcitas.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/talleres")
public class TallerController {

    // --- ATRIBUTOS ---
    @Autowired
    private ITallerService tallerService;

    @Autowired
    private TranslationService translationService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping
    public List<TallerDTO> getTalleres(Locale locale) {
        return tallerService.findAll().stream()
                .map(taller -> toDto(taller, locale))
                .toList();
    }

    @GetMapping("/{id}")
    public TallerDTO getTallerById(@PathVariable Long id, Locale locale) {
        return toDto(tallerService.findById(id), locale);
    }

    @GetMapping("/curso/{idCurso}")
    public List<TallerDTO> getTalleresByCurso(@PathVariable Long idCurso, Locale locale) {
        return tallerService.findByIdCurso(idCurso).stream()
                .map(taller -> toDto(taller, locale))
                .toList();
    }

    @PostMapping
    public Taller saveTaller(@RequestBody Taller taller) { // ⚠️ Aquí dice Taller
        return tallerService.save(taller);                 // ⚠️ Aquí hay un return
    }

    @DeleteMapping("/{id}")
    public void deleteTaller(@PathVariable Long id) {
        tallerService.deleteById(id);
    }

    @PutMapping
    public void updateTaller(@RequestBody Taller taller) {
        tallerService.save(taller);
    }

    private TallerDTO toDto(Taller taller, Locale locale) {
        if (taller == null) {
            return null;
        }

        TallerDTO dto = new TallerDTO();
        dto.setIdTaller(taller.getIdTaller());
        dto.setNombreTaller(translationService.workshopName(taller.getIdTaller(), taller.getNombreTaller(), locale));
        dto.setDuracionMinutos(taller.getDuracionMinutos());
        dto.setTipoTaller(translationService.workshopType(taller.getIdTaller(), taller.getTipoTaller(), locale));
        dto.setCapacidadMaxima(taller.getCapacidadMaxima());
        dto.setDescripcion(translationService.workshopDescription(taller.getIdTaller(), taller.getDescripcion(), locale));
        dto.setIcono(taller.getIcono());
        dto.setIdCurso(taller.getIdCurso());
        return dto;
    }
}
