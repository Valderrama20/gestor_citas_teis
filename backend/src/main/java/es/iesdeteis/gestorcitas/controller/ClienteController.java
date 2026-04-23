package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.model.Cliente;
import es.iesdeteis.gestorcitas.service.IClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private IClienteService clienteService;

    @GetMapping
    public List<Cliente> getCliente() { return clienteService.findAll();}

    @GetMapping("/{id}")
    public Cliente getClienteById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    @PostMapping
    public void saveCliente(@RequestBody Cliente cliente) {clienteService.save(cliente);}

    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable("id") Long id) { clienteService.deleteById(id);}

    @PutMapping
    public void updateCliente(@RequestBody Cliente cliente){ clienteService.save(cliente);}

    }
