package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cita;

import java.util.List;

public interface ICitaService {

    // --- MÉTODOS PROPIOS ---
    public List<Cita> findAll();

    public Cita findById(Long id);

    public void save(Cita cita);

    public void deleteById(Long id);

    public List<Cita> findByTallerIdTaller(Long idTaller);
}