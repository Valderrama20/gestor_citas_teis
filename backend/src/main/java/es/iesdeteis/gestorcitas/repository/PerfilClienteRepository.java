package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.PerfilCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerfilClienteRepository extends JpaRepository<PerfilCliente, Integer> {
}
