package es.iesdeteis.gestorcitas.model;

import es.iesdeteis.gestorcitas.enums.EstadoCita;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "cita")
public class Cita {

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
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "id_taller")
    private Taller taller;


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

    public Usuario getCliente() {
        return cliente;
    }
    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public Taller getTaller() {
        return taller;
    }
    public void setTaller(Taller taller) {
        this.taller = taller;
    }

}
