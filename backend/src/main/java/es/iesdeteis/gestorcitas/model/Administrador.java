package es.iesdeteis.gestorcitas.model;


import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name ="administrators")
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_admin;
    private String nombre;
    private String email;
    private String password;
    private ArrayList<Cursos> cursos;

    public Administrador() {
    }

    public Administrador(Long id_admin, String nombre, String email, String password, ArrayList Cursos) {
        this.id_admin = id_admin;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.cursos = new ArrayList<>();
    }

    public Administrador(String nombre, String email, String password, ArrayList Cursos) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.cursos = new ArrayList<>();
    }

    public Long getId_admin() {
        return id_admin;
    }

    public void setId_admin(Long id_admin) {
        this.id_admin = id_admin;
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

    public ArrayList<Cursos> getCursos() {
        return cursos;
    }

    public void setCursos(ArrayList<Cursos> cursos) {
        this.cursos = cursos;
    }

    @Override
    public String toString() {
        return "Administrador{" +
                "id_admin=" + id_admin +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", cursos=" + cursos +
                '}';
    }
}
