package es.iesdeteis.gestorcitas.dto;

public class CursoDTO {
    private Long idCurso;
    private String nombreCurso;
    private String cursoAcademico;
    private Integer alumnos;
    private String descripcion;
    private String icono;
    private String nivel;
    private String workshopPageDescription;

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

    public String getWorkshopPageDescription() {
        return workshopPageDescription;
    }

    public void setWorkshopPageDescription(String workshopPageDescription) {
        this.workshopPageDescription = workshopPageDescription;
    }
}