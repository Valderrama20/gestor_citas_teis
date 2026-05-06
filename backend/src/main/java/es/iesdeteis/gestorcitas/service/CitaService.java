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

    @Override
    public void save(Cita cita) {
        Cliente clienteRequest = cita.getCliente();

        if (clienteRequest != null && clienteRequest.getEmail() != null) {

            Optional<Cliente> clienteExistente = clienteRepository.findByEmail(clienteRequest.getEmail());

            if (clienteExistente.isPresent()) {
                // 3A. Si el cliente existe, lo sacamos de la BD
                Cliente clienteDB = clienteExistente.get();

                // ¡NUEVO!: Actualizamos sus alergias con lo que acaba de escribir en el formulario
                clienteDB.setNotasAlergias(clienteRequest.getNotasAlergias());

                // Guardamos el cliente para que se actualice en la base de datos
                clienteRepository.save(clienteDB);

                // Se lo asignamos a la cita
                cita.setCliente(clienteDB);
            } else {
                // 3B. Si NO existe, creamos uno nuevo como hacíamos antes
                Cliente nuevoCliente = clienteRepository.save(clienteRequest);
                cita.setCliente(nuevoCliente);
            }
        }

        // 4. Guardamos la cita
        citaRepository.save(cita);
    }

    @Override
    public void deleteById(Long id) {
        citaRepository.deleteById(id);
    }
}