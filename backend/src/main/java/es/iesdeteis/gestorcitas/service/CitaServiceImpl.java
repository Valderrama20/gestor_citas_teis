package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.exception.ResourceNotFoundException;
import es.iesdeteis.gestorcitas.model.dto.CitaDTO;
import es.iesdeteis.gestorcitas.model.entity.Cita;
import es.iesdeteis.gestorcitas.repository.CitaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaServiceImpl implements CitaService {

    private final CitaRepository citaRepository;

    public CitaServiceImpl(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    @Override
    public List<CitaDTO> findAll() {
        return citaRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public CitaDTO findById(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));
        return convertToDto(cita);
    }

    @Override
    public CitaDTO save(CitaDTO citaDTO) {
        Cita cita = convertToEntity(citaDTO);
        Cita savedCita = citaRepository.save(cita);
        return convertToDto(savedCita);
    }

    @Override
    public void deleteById(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cita no encontrada con id: " + id);
        }
        citaRepository.deleteById(id);
    }

    // Métodos de mapeo manual (se podría usar MapStruct o ModelMapper)
    private CitaDTO convertToDto(Cita cita) {
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        dto.setPaciente(cita.getPaciente());
        dto.setFechaHora(cita.getFechaHora());
        dto.setMotivo(cita.getMotivo());
        return dto;
    }

    private Cita convertToEntity(CitaDTO dto) {
        Cita cita = new Cita();
        cita.setId(dto.getId()); // Si es null es para creación
        cita.setPaciente(dto.getPaciente());
        cita.setFechaHora(dto.getFechaHora());
        cita.setMotivo(dto.getMotivo());
        return cita;
    }
}
