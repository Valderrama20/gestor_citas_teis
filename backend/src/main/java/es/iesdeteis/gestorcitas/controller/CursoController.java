package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Administrador;
import es.iesdeteis.gestorcitas.model.Curso;
import es.iesdeteis.gestorcitas.service.ICursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CursoController {

    @Autowired
    private ICursoService cursosService;

    @GetMapping("cursos")
    public List<Curso> getCursos() { return cursosService.findAll();}

    @GetMapping("/cursos/{id}")
    public Curso getCursosById(@PathVariable Long id){ return cursosService.findById(id);
    }

    @PostMapping("/cursos")
    public void saveCursos(@RequestBody Curso curso) {cursosService.save(curso);}

    @DeleteMapping("/cursos/{id}")
    public void deleteCursos(@PathVariable Long idCurso) { cursosService.deleteById(idCurso);}

    @PutMapping ("cursos/{id}")
    public void updateCursos(@RequestBody Curso curso){ cursosService.save(curso);}

}

