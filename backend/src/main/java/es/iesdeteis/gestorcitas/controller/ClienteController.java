package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Cliente;
import es.iesdeteis.gestorcitas.service.ClienteService;
import es.iesdeteis.gestorcitas.service.IClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClienteController {

    @Autowired
    private IClienteService clienteService;

    @GetMapping("cliente")
    public List<Cliente> getCliente() { return clienteService.findAll();}

    @GetMapping("/cliente/{id}")
    public Cliente getClienteById(@PathVariable Long id) {
        return clienteService.findById(id);
    }
        @PostMapping("/cliente")
        public void saveAdministrador(Cliente cliente) {clienteService.save(cliente);}

        @DeleteMapping("/cliente/{id}")
        public void deleteAdministradores(@PathVariable Long id) { clienteService.deleteById(id);}

        @PutMapping ("/cliente")
        public void updateAdministradores(@RequestBody Cliente cliente){ clienteService.save(cliente);}

    }
