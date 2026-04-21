package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Taller;
import es.iesdeteis.gestorcitas.repository.TallerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TallerService implements ITallerService {

    @Autowired
    private TallerRepository tallerRepository;

    @Override
    public List<Taller> findAll() {
        return (List<Taller>) tallerRepository.findAll();
    }

    @Override
    public Taller findById(Long id) {
        return tallerRepository.findById(id).orElse(null);
    }

    @Override
    public void save(Taller taller) {
        tallerRepository.save(taller);
    }

    @Override
    public void deleteByiId(Long id) {
        tallerRepository.deleteById(id);
    }
}
