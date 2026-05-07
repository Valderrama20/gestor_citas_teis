package es.iesdeteis.gestorcitas.model;

import es.iesdeteis.gestorcitas.enums.EstadoCita;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "cita")
public class Cita {

    // --- ATRIBUTOS ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita")
    private Long idCita;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "hora")
    private LocalTime hora;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoCita estado = EstadoCita.PENDIENTE;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_taller")
    private Taller taller;

//    @ManyToOne
//    @JoinColumn(name = "id_alumno")
//    private Alumno alumno;

    // --- CONSTRUCTORES ---
    public Cita() {
    }

    public Cita(LocalDate fecha, LocalTime hora, Cliente cliente, Taller taller) {
        this.fecha = fecha;
        this.hora = hora;
        this.cliente = cliente;
        this.taller = taller;
    }

    public Cita(Long idCita, LocalDate fecha, LocalTime hora, EstadoCita estado, Cliente cliente, Taller taller) {
        this.idCita = idCita;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = estado;
        this.cliente = cliente;
        this.taller = taller;
    }

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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Taller getTaller() {
        return taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    @Override
    public String toString() {
        return "Cita{" +
                "idCita=" + idCita +
                ", fecha=" + fecha +
                ", hora=" + hora +
                ", estado=" + estado +
                ", cliente=" + cliente +
                ", taller=" + taller +
                '}';
    }
}
