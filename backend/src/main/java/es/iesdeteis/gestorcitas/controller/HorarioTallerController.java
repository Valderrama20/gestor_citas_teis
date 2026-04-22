package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.HorarioTaller;
import es.iesdeteis.gestorcitas.service.IHorarioTallerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HorarioTallerController {

    // --- ATRIBUTOS ---
    @Autowired
    private IHorarioTallerService horarioTallerService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping("/horariostalleres")
    public List<HorarioTaller> getTalleres() {
        return horarioTallerService.findAll();
    }

    @GetMapping("/horariostalleres/{id}")
    public HorarioTaller getHorarioTallerById(@PathVariable Long id) {
        return horarioTallerService.findById(id);
    }

    @PostMapping("/horariostalleres/")
    public void saveHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }

    @DeleteMapping("/horariostalleres/{id}")
    public void deleteHorarioTaller(@PathVariable Long id) {
        horarioTallerService.deleteById(id);
    }

    @PutMapping("/horariostalleres/")
    public void updateHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }
}