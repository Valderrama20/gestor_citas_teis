package es.iesdeteis.gestorcitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cursos")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCurso;
    private String nombreCurso;
    private String cursoAcademico;
    // MUCHOS cursos pertenecen a UN administrador
    //@ManyToOne
    //@JoinColumn(name = "idAdmin")
    //private Administrador administrador;

    public Curso() {
    }

    public Curso(String nombreCurso, String cursoAcademico, Administrador administrador) {
        this.nombreCurso = nombreCurso;
        this.cursoAcademico = cursoAcademico;
        //this.administrador = administrador;
    }

    public Curso(Long idCurso, String nombreCurso, String cursoAcademico, Administrador administrador) {
        this.idCurso = idCurso;
        this.nombreCurso = nombreCurso;
        this.cursoAcademico = cursoAcademico;
        //this.administrador = administrador;
    }

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

    /*public Administrador getAdministrador() {
        return administrador;
    }
    */

    /*public void setAdministrador(Administrador administrador) {
        this.administrador = administrador;
    }
    */

    @Override
    public String toString() {
        return "Cursos{" +
                "idCurso=" + idCurso +
                ", nombreCurso='" + nombreCurso + '\'' +
                ", cursoAcademico='" + cursoAcademico + '\'' +
                //", administrador=" + administrador +
                '}';
    }
}
