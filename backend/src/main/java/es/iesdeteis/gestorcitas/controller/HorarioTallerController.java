package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.HorarioTaller;
import es.iesdeteis.gestorcitas.service.IHorarioTallerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HorarioTallerController {

    @Autowired
    private IHorarioTallerService horarioTallerService;

    @GetMapping("/horariostalleres")
    public List<HorarioTaller> getTalleres() {
        return horarioTallerService.findAll();
    }

    @GetMapping("horariostalleres/{id}")
    public HorarioTaller getHorarioTallerById(@PathVariable Integer id) {
        return horarioTallerService.findById(id);
    }

    @PostMapping("/horariostalleres/")
    public void saveHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }

    @DeleteMapping("/horariostalleres/{id}")
    public void deleteHorarioTaller(@PathVariable Integer id) {
        horarioTallerService.deleteByiId(id);
    }

    @PutMapping("/horariostalleres/")
    public void updateHorarioTaller(@RequestBody HorarioTaller horarioTaller) {
        horarioTallerService.save(horarioTaller);
    }
}
