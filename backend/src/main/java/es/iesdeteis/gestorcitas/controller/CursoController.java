package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Curso;
import es.iesdeteis.gestorcitas.service.ICursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/CursosController")
public class CursoController {

    @Autowired
    private ICursoService cursosService;

    @GetMapping
    public List<Curso> getCursos() { return cursosService.findAll();}

    @GetMapping("/{id}")
    public Curso getCursosById(@PathVariable Long id){ return cursosService.findById(id);
    }

    @PostMapping
    public void saveCursos(@RequestBody Curso curso) {cursosService.save(curso);}

    @DeleteMapping("/{id}")
    public void deleteCursos(@PathVariable("id") Long id) { cursosService.deleteById(id);}

    @PutMapping
    public void updateCursos(@RequestBody Curso curso){ cursosService.save(curso);}

}

