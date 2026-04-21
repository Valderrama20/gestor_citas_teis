package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.HorarioTaller;
import es.iesdeteis.gestorcitas.repository.HorarioTallerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioTallerService implements IHorarioTallerService {

    @Autowired
    private HorarioTallerRepository horarioTallerRepository;

    @Override
    public List<HorarioTaller> findAll() {
        return (List<HorarioTaller>) horarioTallerRepository.findAll();
    }

    @Override
    public HorarioTaller findById(Long id) {
        return horarioTallerRepository.findById(id).orElse(null);
    }

    @Override
    public void save(HorarioTaller horarioTaller) {
        horarioTallerRepository.save(horarioTaller);
    }

    @Override
    public void deleteById(Long id) {
        horarioTallerRepository.deleteById(id);
    }
}
