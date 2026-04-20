package es.iesdeteis.gestorcitas.model;

import jakarta.persistence.*;

import java.sql.Time;

@Entity
@Table(name = "horarios_talleres")

public class HorarioTaller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_horario;

    private String dia_semana;
    private Time hora_apertura;
    private Time hora_cierre;

    @ManyToOne
    @JoinColumn(name = "id_taller")
    private Taller taller;

    public HorarioTaller(int id_horario, String dia_semana, Time hora_apertura, Time hora_cierre, Taller taller) {
        this.id_horario = id_horario;
        this.dia_semana = dia_semana;
        this.hora_apertura = hora_apertura;
        this.hora_cierre = hora_cierre;
        this.taller = taller;
    }

    public int getId_horario() {
        return id_horario;
    }

    public void setId_horario(int id_horario) {
        this.id_horario = id_horario;
    }

    public String getDia_semana() {
        return dia_semana;
    }

    public void setDia_semana(String dia_semana) {
        this.dia_semana = dia_semana;
    }

    public Time getHora_apertura() {
        return hora_apertura;
    }

    public void setHora_apertura(Time hora_apertura) {
        this.hora_apertura = hora_apertura;
    }

    public Time getHora_cierre() {
        return hora_cierre;
    }

    public void setHora_cierre(Time hora_cierre) {
        this.hora_cierre = hora_cierre;
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
                "id_horario=" + id_horario +
                ", dia_semana='" + dia_semana + '\'' +
                ", hora_apertura=" + hora_apertura +
                ", hora_cierre=" + hora_cierre +
                ", taller=" + taller +
                '}';
    }
}
