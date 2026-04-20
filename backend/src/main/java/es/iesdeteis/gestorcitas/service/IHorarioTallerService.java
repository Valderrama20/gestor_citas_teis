package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.HorarioTaller;

import java.util.List;

public interface IHorarioTallerService {

    public List<HorarioTaller> findAll();

    public HorarioTaller findById(int id);

    public void save(HorarioTaller horarioTaller);

    public void deleteByiId(int id);
}
