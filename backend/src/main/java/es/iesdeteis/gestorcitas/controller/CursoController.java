package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.dto.CursoDTO;
import es.iesdeteis.gestorcitas.model.Curso;
import es.iesdeteis.gestorcitas.service.ICursoService;
import es.iesdeteis.gestorcitas.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/CursosController")
public class CursoController {

    @Autowired
    private ICursoService cursosService;

    @Autowired
    private TranslationService translationService;

    @GetMapping
    public List<CursoDTO> getCursos(Locale locale) {
        return cursosService.findAll().stream()
                .map(curso -> toDto(curso, locale))
                .toList();
    }

    @GetMapping("/{id}")
    public CursoDTO getCursosById(@PathVariable Long id, Locale locale) {
        return toDto(cursosService.findById(id), locale);
    }

    @PostMapping
    public void saveCursos(@RequestBody Curso curso) {
        cursosService.save(curso);
    }

    @DeleteMapping("/{id}")
    public void deleteCursos(@PathVariable("id") Long id) {
        cursosService.deleteById(id);
    }

    @PutMapping
    public void updateCursos(@RequestBody Curso curso) {
        cursosService.save(curso);
    }

    private CursoDTO toDto(Curso curso, Locale locale) {
        if (curso == null) {
            return null;
        }

        CursoDTO dto = new CursoDTO();
        dto.setIdCurso(curso.getIdCurso());
        dto.setNombreCurso(translationService.courseName(curso.getIdCurso(), curso.getNombreCurso(), locale));
        dto.setCursoAcademico(curso.getCursoAcademico());
        dto.setAlumnos(curso.getAlumnos());
        dto.setDescripcion(translationService.courseDescription(curso.getIdCurso(), curso.getDescripcion(), locale));
        dto.setIcono(curso.getIcono());
        dto.setNivel(translationService.courseLevel(curso.getNivel(), locale));
        dto.setWorkshopPageDescription(
                translationService.courseWorkshopPageDescription(curso.getIdCurso(), curso.getDescripcion(), locale)
        );
        return dto;
    }
}

