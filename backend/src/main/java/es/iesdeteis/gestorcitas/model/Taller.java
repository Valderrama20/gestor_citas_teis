package es.iesdeteis.gestorcitas.model;

import jakarta.persistence.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "taller")
public class Taller {

    // --- ATRIBUTOS ---
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_taller")
    private Long idTaller;

    @Column(name = "nombre_taller")
    private String nombreTaller;

    @Column(name = "duracion_minutos")
    private Integer duracionMinutos;

    @Column(name = "tipo_taller")
    private String tipoTaller;

    @Column(name = "capacidad_maxima")
    private Integer capacidadMaxima;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "icono")
    private String icono;

    @Column(name = "id_curso")
    private Long idCurso;

    // @OneToMany(cascade = CascadeType.ALL)
    // @JoinColumn(name = "id_taller")
    // @JsonIgnore
    // private List<HorarioTaller> horarios;

    // --- CONSTRUCTORES ---
    public Taller() {
    }

    public Taller(String nombreTaller, Integer duracionMinutos, String tipoTaller, Integer capacidadMaxima, String descripcion, String icono, Long idCurso) {
        this.nombreTaller = nombreTaller;
        this.duracionMinutos = duracionMinutos;
        this.tipoTaller = tipoTaller;
        this.capacidadMaxima = capacidadMaxima;
        this.descripcion = descripcion;
        this.icono = icono;
        this.idCurso = idCurso;
    }

    // --- GETTERS Y SETTERS ---
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

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(int duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public String getTipoTaller() {
        return tipoTaller;
    }

    public void setTipoTaller(String tipoTaller) {
        this.tipoTaller = tipoTaller;
    }

    public Integer getCapacidadMaxima() {
        return capacidadMaxima;
    }

    public void setCapacidadMaxima(int capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public Long getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Long idCurso) {
        this.idCurso = idCurso;
    }

    // public List<HorarioTaller> getHorarios() {
    //     return horarios;
    // }

    // public void setHorarios(List<HorarioTaller> horarios) {
    //     this.horarios = horarios;
    // }

    // --- OVERRIDES DE OBJECT ---
    @Override
    public String toString() {
        return "Taller id=" + idTaller + ", Nombre='" + nombreTaller + ", Tipo='" + tipoTaller;
    }
}
