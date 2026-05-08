package es.iesdeteis.gestorcitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "curso")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Long idCurso;

    @Column(name = "nombre_curso")
    private String nombreCurso;

    @Column(name = "curso_academico")
    private String cursoAcademico;

    @Column(name = "alumnos")
    private Integer alumnos;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "icono")
    private String icono;

    @Column(name = "nivel")
    private String nivel;

    @ManyToOne
    @JoinColumn(name = "id_gestor")
    private Usuario gestor;

    public Long getIdCurso() {
        return idCurso;
    }
    public void setIdCurso(Long idCurso) {
        this.idCurso = idCurso;
    }

    public String getNombreCurso() {
        return nombreCurso;
    }
    public void setNombreCurso(String nombreCurso) {
        this.nombreCurso = nombreCurso;
    }

    public String getCursoAcademico() {
        return cursoAcademico;
    }
    public void setCursoAcademico(String cursoAcademico) {
        this.cursoAcademico = cursoAcademico;
    }

    public Integer getAlumnos() {
        return alumnos;
    }
    public void setAlumnos(Integer alumnos) {
        this.alumnos = alumnos;
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

    public String getNivel() {
        return nivel;
    }
    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public Usuario getGestor() {
        return gestor;
    }
    public void setGestor(Usuario gestor) {
        this.gestor = gestor;
    }

}
