package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.Taller;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TallerRepository extends CrudRepository<Taller, Long> {
    List<Taller> findByIdCurso(Long idCurso);
}