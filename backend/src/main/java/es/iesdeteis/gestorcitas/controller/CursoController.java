package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Curso;
import es.iesdeteis.gestorcitas.service.ICursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CursoController {

    @Autowired
    private ICursoService cursosService;

    @GetMapping("curso")
    public List<Curso> getCursos() { return cursosService.findAll();}

    @GetMapping("/curso/{id}")
    public Curso getCursosById(@PathVariable Long id){ return cursosService.findById(id);
    }

    @PostMapping("/curso")
    public void saveCursos(@RequestBody Curso curso) {cursosService.save(curso);}

    @DeleteMapping("/curso/{id}")
    public void deleteCursos(@PathVariable("id") Long id) { cursosService.deleteById(id);}

    @PutMapping ("/curso/")
    public void updateCursos(@RequestBody Curso curso){ cursosService.save(curso);}

}

