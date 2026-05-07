package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.Cita;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CitaRepository extends CrudRepository<Cita, Long> {
    List<Cita> findByTallerIdTaller(Long idTaller);

    List<Cita> findByTallerIdCurso(Long idCurso);
}