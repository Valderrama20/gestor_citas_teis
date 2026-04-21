package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.service.ITallerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TallerController {

    @Autowired
    private ITallerService tallerService;

    @GetMapping("/talleres")
    public List<Taller> getTalleres() {
        return tallerService.findAll();
    }

    @GetMapping("talleres/{id}")
    public Taller getTallerById(@PathVariable Long id) {
        return tallerService.findById(id);
    }

    @PostMapping("/talleres/")
    public void saveTaller(@RequestBody Taller taller) {
        tallerService.save(taller);
    }

    @DeleteMapping("/talleres/{id}")
    public void deleteTaller(@PathVariable Long id) {
        tallerService.deleteByiId(id);
    }

    @PutMapping("/talleres/")
    public void updateTaller(@RequestBody Taller taller) {
        tallerService.save(taller);
    }
}