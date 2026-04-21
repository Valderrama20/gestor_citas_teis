package es.iesdeteis.gestorcitas.model;


import jakarta.persistence.*;

@Entity
@Table(name = "administrador")
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin")
    private Long idAdmin;
    private String nombre;
    private String email;
    private String password;
    // UN administrador gestiona MUCHOS cursos
    // "mappedBy" indica el nombre de la variable en la clase Curso
//    @OneToMany(mappedBy = "administrador", cascade = CascadeType.ALL, orphanRemoval = true)
//    private ArrayList<Curso> cursos;

    public Administrador() {
    }

    public Administrador(Long idAdmin, String nombre, String email, String password) {
        this.idAdmin = idAdmin;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
//        this.cursos = new ArrayList<>();
    }

    public Administrador(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
//        this.cursos = new ArrayList<>();
    }

    public Long getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

//    public ArrayList<Curso> getCursos() {
//        return cursos;
//    }
//
//    public void setCursos(ArrayList<Curso> cursos) {
//        this.cursos = cursos;
//    }

    @Override
    public String toString() {
        return "Administradores{" +
                "id_admin=" + idAdmin +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
//                ", cursos=" + cursos +
                '}';
    }
}
