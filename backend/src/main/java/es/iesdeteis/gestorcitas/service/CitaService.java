package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.dto.CitaDTO;
import java.util.List;

public interface CitaService {
    List<CitaDTO> findAll();
    CitaDTO findById(Long id);
    CitaDTO save(CitaDTO citaDTO);
    void deleteById(Long id);
}
