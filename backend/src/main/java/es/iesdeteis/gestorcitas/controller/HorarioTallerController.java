package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.HorarioTaller;
import es.iesdeteis.gestorcitas.service.IHorarioTallerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios-talleres")
public class HorarioTallerController {

    // --- ATRIBUTOS ---
    @Autowired
    private IHorarioTallerService horarioTallerService;

    // --- MÉTODOS PROPIOS ---
    @GetMapping
    public List<HorarioTaller> getTalleres() {
        return horarioTallerService.findAll();
    }

    @GetMapping("/{id}")
    public HorarioTaller getHorarioTallerById(@PathVariable Long id) {
        return horarioTallerService.findById(id);
    }


    @PostMapping
    public void saveHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }

    @DeleteMapping("/{id}")
    public void deleteHorarioTaller(@PathVariable Long id) {
        horarioTallerService.deleteById(id);
    }

    @PutMapping
    public void updateHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }
}