package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.Cliente;
import org.springframework.data.repository.CrudRepository;

public interface ClienteRepository extends CrudRepository <Cliente, Long> {
}
