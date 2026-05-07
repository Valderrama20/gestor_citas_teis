package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.service.ICitaService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Cita> getCitas() {
        return citaService.findAll();
    }

    // Nuevo endpoint: obtener todas las citas de un taller
    @GetMapping("/taller/{idTaller}")
    public List<Cita> getCitasByTaller(@PathVariable Long idTaller) {
        if (idTaller == null || idTaller <= 0) {
            return List.of();
        }
        return citaService.findByTallerIdTaller(idTaller);
    }

    @GetMapping("/{id}")
    public Cita getCitaById(@PathVariable Long id) {
        return citaService.findById(id);
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
}