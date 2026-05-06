package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitaService implements ICitaService {

    // --- ATRIBUTOS ---
    @Autowired
    private CitaRepository citaRepository;

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
        citaRepository.save(cita);
    }

    @Override
    public void deleteById(Long id) {
        citaRepository.deleteById(id);
    }

    @Override
    public List<Cita> findByTallerIdTaller(Long idTaller) {
        return citaRepository.findByTallerIdTaller(idTaller);
    }
}