package es.iesdeteis.gestorcitas.repository;

import es.iesdeteis.gestorcitas.model.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    // Métodos de consulta personalizados pueden ir aquí
}
