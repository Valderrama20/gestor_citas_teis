package es.iesdeteis.gestorcitas.model;

import jakarta.persistence.*;

import java.sql.Time;

@Entity
@Table(name = "horario_taller")

public class HorarioTaller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Long idHorario;

    @Column(name = "dia_semana")
    private String diaSemana;

    @Column(name = "hora_apertura")
    private Time horaApertura;

    @Column(name = "hora_cierre")
    private Time horaCierre;

    @ManyToOne
    @JoinColumn(name = "id_taller")
    private Taller taller;

    public HorarioTaller(Long idHorario, String diaSemana, Time horaApertura, Time horaCierre, Taller taller) {
        this.idHorario = idHorario;
        this.diaSemana = diaSemana;
        this.horaApertura = horaApertura;
        this.horaCierre = horaCierre;
        this.taller = taller;
    }

    public HorarioTaller() {
    }

    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public Time getHoraApertura() {
        return horaApertura;
    }

    public void setHoraApertura(Time horaApertura) {
        this.horaApertura = horaApertura;
    }

    public Time getHoraCierre() {
        return horaCierre;
    }

    public void setHoraCierre(Time horaCierre) {
        this.horaCierre = horaCierre;
    }

    public Taller getTaller() {
        return taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    @Override
    public String toString() {
        return "HorarioTaller{" +
                "idHorario=" + idHorario +
                ", dia_semana='" + diaSemana + '\'' +
                ", horaApertura=" + horaApertura +
                ", horaCierre=" + horaCierre +
                '}';
    }
}
