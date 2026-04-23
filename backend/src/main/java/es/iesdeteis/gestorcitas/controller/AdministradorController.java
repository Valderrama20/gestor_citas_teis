package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Administrador;
import es.iesdeteis.gestorcitas.service.IAdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/administradores")
public class AdministradorController {

    @Autowired
    private IAdministradorService administradorService;

    @GetMapping
    public List<Administrador> getAdministrador() { return administradorService.findAll();}

    @GetMapping("{id}")
    public Administrador getAdministradoresById(@PathVariable Long id){ return administradorService.findById(id);
    }

    @PostMapping
    public void saveAdministrador(@RequestBody Administrador administrador) {administradorService.save(administrador);}

    @DeleteMapping("/{id}")
    public void deleteAdministradores(@PathVariable Long id) { administradorService.deleteById(id);}

    @PutMapping
    public void updateAdministradores(@RequestBody Administrador administrador){ administradorService.save(administrador);}
    }


