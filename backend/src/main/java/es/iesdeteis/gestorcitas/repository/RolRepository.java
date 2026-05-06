package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
}
