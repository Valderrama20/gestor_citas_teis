package es.iesdeteis.gestorcitas.model.dto;

import java.time.LocalDateTime;

public class CitaDTO {
    
    private Long id;
    private String paciente;
    private LocalDateTime fechaHora;
    private String motivo;

    public CitaDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaciente() { return paciente; }
    public void setPaciente(String paciente) { this.paciente = paciente; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
