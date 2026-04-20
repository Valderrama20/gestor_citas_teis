package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Administrador;
import es.iesdeteis.gestorcitas.service.IAdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class AdministradorController {

    @Autowired
    private IAdministradorService administradorService;

    @GetMapping("administradores")
    public List<Administrador> getAdministrador() { return administradorService.findAll();}

    @GetMapping("/administradores/{id}")
    public Administrador getOpinionesById(PathVariable Long id_admin){ return administradorService.findById(id_admin);
    }

    @PostMapping("/administrador")
    public void saveAdministrador(@RequestBody Administrador administrador) {administradorService.save(administrador);}

    @DeleteMapping("/administradores/{id}")
    public void deleteAdministradores(@PathVariable Long id_admin )
}
