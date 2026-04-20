package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Taller;

import java.util.List;

public interface ITallerService {
    public List<Taller> findAll();

    public Taller findById(int id);

    public void save(Taller taller);

    public void deleteByiId(int id);
}
