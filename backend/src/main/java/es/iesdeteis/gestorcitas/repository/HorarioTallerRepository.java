package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.HorarioTaller;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface HorarioTallerRepository extends CrudRepository<HorarioTaller, Long> {
	List<HorarioTaller> findByIdTallerIdTaller(Long idTaller);
}