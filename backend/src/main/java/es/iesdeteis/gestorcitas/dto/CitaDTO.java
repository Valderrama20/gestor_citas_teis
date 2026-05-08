package es.iesdeteis.gestorcitas.dto;

import es.iesdeteis.gestorcitas.enums.EstadoCita;

import java.time.LocalDate;
import java.time.LocalTime;

public class CitaDTO {
    private Long idCita;
    private LocalDate fecha;
    private LocalTime hora;
    private EstadoCita estado;
    private ClienteDTO cliente;
    private TallerDTO taller;

    public Long getIdCita() {
        return idCita;
    }

    public void setIdCita(Long idCita) {
        this.idCita = idCita;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public TallerDTO getTaller() {
        return taller;
    }

    public void setTaller(TallerDTO taller) {
        this.taller = taller;
    }

    public static class ClienteDTO {
        private Integer idUsuario;
        private String nombre;
        private String email;

        public Integer getIdUsuario() {
            return idUsuario;
        }

        public void setIdUsuario(Integer idUsuario) {
            this.idUsuario = idUsuario;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class TallerDTO {
        private Long idTaller;
        private String nombreTaller;
        private Long idCurso;

        public Long getIdTaller() {
            return idTaller;
        }

        public void setIdTaller(Long idTaller) {
            this.idTaller = idTaller;
        }

        public String getNombreTaller() {
            return nombreTaller;
        }

        public void setNombreTaller(String nombreTaller) {
            this.nombreTaller = nombreTaller;
        }

        public Long getIdCurso() {
            return idCurso;
        }

        public void setIdCurso(Long idCurso) {
            this.idCurso = idCurso;
        }
    }
}
