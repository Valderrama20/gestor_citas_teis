package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cliente;
import es.iesdeteis.gestorcitas.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService implements IClienteService {

    @Autowired
    private ClienteRepository clienteRepository;


    @Autowired
    public List<Cliente> findAll() {
        return (List<Cliente>) clienteRepository.findAll();
    }

    @Override
    public Cliente findById(Long idCliente) {
        return clienteRepository.findById(idCliente).orElse(null);
    }

    @Override
    public void save(Cliente cliente) {
        System.out.println(cliente);
        clienteRepository.save(cliente);
    }

    @Override
    public void deleteById(Long idCliente) {
        clienteRepository.deleteById(idCliente);

    }
}
