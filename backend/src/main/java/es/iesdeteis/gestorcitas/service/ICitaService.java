package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.dto.CancelacionCitaResponse;

import java.util.List;

public interface ICitaService {

    // --- MÉTODOS PROPIOS ---
    public List<Cita> findAll();

    public Cita findById(Long id);

    public void save(Cita cita);

    public void deleteById(Long id);

    public CancelacionCitaResponse cancelarPorToken(String token);

    public List<Cita> findByTallerIdTaller(Long idTaller);

    public List<Cita> findByCursoId(Long idCurso);
}