package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.model.Cliente;
import es.iesdeteis.gestorcitas.repository.CitaRepository;
import es.iesdeteis.gestorcitas.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaService implements ICitaService {

    // --- ATRIBUTOS ---
    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // --- MÉTODOS HEREDADOS ---
    @Override
    public List<Cita> findAll() {
        return (List<Cita>) citaRepository.findAll();
    }

    @Override
    public Cita findById(Long id) {
        return citaRepository.findById(id).orElse(null);
    }

    // 🚀 AQUÍ UNIFICAMOS LA LÓGICA NUESTRA CON EL MÉTODO DE LA INTERFAZ
    @Override
    public void save(Cita cita) {
        Cliente clienteRequest = cita.getCliente();

        // 1. Verificamos que nos llega un cliente con un email
        if (clienteRequest != null && clienteRequest.getEmail() != null) {

            // 2. Buscamos si el email ya existe en la base de datos
            Optional<Cliente> clienteExistente = clienteRepository.findByEmail(clienteRequest.getEmail());

            if (clienteExistente.isPresent()) {
                // 3A. Si existe, sobrescribimos el cliente de la cita con el que ya tiene ID en la BD
                cita.setCliente(clienteExistente.get());
            } else {
                // 3B. Si NO existe, guardamos al nuevo cliente en la BD para generar su ID...
                Cliente nuevoCliente = clienteRepository.save(clienteRequest);
                // ...y se lo asignamos a la cita
                cita.setCliente(nuevoCliente);
            }
        }

        // 4. Guardamos la cita (ya no usamos "return" porque el método es void)
        citaRepository.save(cita);
    }

    @Override
    public void deleteById(Long id) {
        citaRepository.deleteById(id);
    }
}