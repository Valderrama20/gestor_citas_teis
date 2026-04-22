package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.service.ICitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CitaController {

    // --- ATRIBUTOS ---
    @Autowired
    private ICitaService citaService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping("/citas")
    public List<Cita> getCitas() {
        return citaService.findAll();
    }

    @GetMapping("/citas/{id}")
    public Cita getCitaById(@PathVariable Long id) {
        return citaService.findById(id);
    }

    @PostMapping("/citas/")
    public void saveCita(@RequestBody Cita cita) {
        citaService.save(cita);
    }

    @DeleteMapping("/citas/{id}")
    public void deleteCita(@PathVariable Long id) {
        citaService.deleteById(id);
    }

    @PutMapping("/citas/")
    public void updateCita(@RequestBody Cita cita) {
        citaService.save(cita);
    }
}