package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.HorarioTaller;

import java.util.List;

public interface IHorarioTallerService {

    // --- MÉTODOS PROPIOS ---
    public List<HorarioTaller> findAll();

    public HorarioTaller findById(Long id);

    public List<HorarioTaller> findByTallerId(Long idTaller);

    public void save(HorarioTaller horarioTaller);

    public void deleteById(Long id);
}
