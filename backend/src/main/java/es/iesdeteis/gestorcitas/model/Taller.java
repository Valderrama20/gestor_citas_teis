package es.iesdeteis.gestorcitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "talleres")

public class Taller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_taller;

    private String nombre_taller;
    private int duracion_minutos;
    private String tipo_taller;
    private int capacidad_maxima;

    @ManyToOne
    @JoinColumn(name = "id_curso")
    private Curso curso;

    public Taller(int id_taller, String nombre_taller, int duracion_minutos, String tipo_taller, int capacidad_maxima, Curso curso) {
        this.id_taller = id_taller;
        this.nombre_taller = nombre_taller;
        this.duracion_minutos = duracion_minutos;
        this.tipo_taller = tipo_taller;
        this.capacidad_maxima = capacidad_maxima;
        this.curso = curso;
    }

    public int getId_taller() {
        return id_taller;
    }

    public void setId_taller(int id_taller) {
        this.id_taller = id_taller;
    }

    public String getNombre_taller() {
        return nombre_taller;
    }

    public void setNombre_taller(String nombre_taller) {
        this.nombre_taller = nombre_taller;
    }

    public int getDuracion_minutos() {
        return duracion_minutos;
    }

    public void setDuracion_minutos(int duracion_minutos) {
        this.duracion_minutos = duracion_minutos;
    }

    public String getTipo_taller() {
        return tipo_taller;
    }

    public void setTipo_taller(String tipo_taller) {
        this.tipo_taller = tipo_taller;
    }

    public int getCapacidad_maxima() {
        return capacidad_maxima;
    }

    public void setCapacidad_maxima(int capacidad_maxima) {
        this.capacidad_maxima = capacidad_maxima;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    @Override
    public String toString() {
        return "Taller id=" + id_taller + ", Nombre='" + nombre_taller + ", Tipo='" + tipo_taller;
    }
}
