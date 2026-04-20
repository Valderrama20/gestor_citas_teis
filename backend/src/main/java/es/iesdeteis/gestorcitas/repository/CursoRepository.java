package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.Curso;
import jakarta.persistence.Entity;
import org.springframework.data.repository.CrudRepository;


public interface CursoRepository extends CrudRepository <Curso, Long> {
}
