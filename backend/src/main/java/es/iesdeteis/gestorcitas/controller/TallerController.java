package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.service.ITallerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/talleres")
@CrossOrigin(origins = "*")
public class TallerController {

    // --- ATRIBUTOS ---
    @Autowired
    private ITallerService tallerService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping
    public List<Taller> getTalleres() {
        return tallerService.findAll();
    }

    @GetMapping("/{id}")
    public Taller getTallerById(@PathVariable Long id) {
        return tallerService.findById(id);
    }

    @GetMapping("/curso/{idCurso}")
    public List<Taller> getTalleresByCurso(@PathVariable Long idCurso) {
        return tallerService.findByIdCurso(idCurso);
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
}