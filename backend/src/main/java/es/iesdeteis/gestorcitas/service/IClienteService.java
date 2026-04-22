package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cliente;
import es.iesdeteis.gestorcitas.model.Curso;

import java.util.List;

public interface IClienteService {

    public List<Cliente> findAll();
    public Cliente findById(Long idCliente);
    public void save(Cliente cliente);
    public void deleteById(Long idCliente);
}
