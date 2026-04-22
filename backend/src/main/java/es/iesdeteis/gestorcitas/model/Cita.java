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

    @ManyToOne
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
}
