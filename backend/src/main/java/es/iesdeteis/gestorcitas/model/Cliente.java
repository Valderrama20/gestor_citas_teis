package es.iesdeteis.gestorcitas.model;


import jakarta.persistence.*;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCLiente;
    private String nombre;
    private String email;
    private String telefono;
    private String password;
    @Column(name = "notas_alergias")
    private String notasAlergias;

    public Cliente() {
    }

    public Cliente(String nombre, String email, String telefono, String password, String notasAlergias) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.password = password;
        this.notasAlergias = notasAlergias;
    }

    public Cliente(Long idCLiente, String nombre, String email, String telefono, String password, String notasAlergias) {
        this.idCLiente = idCLiente;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.password = password;
        this.notasAlergias = notasAlergias;
    }

    public Long getIdCLiente() {
        return idCLiente;
    }

    public void setIdCLiente(Long idCLiente) {
        this.idCLiente = idCLiente;
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

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNotasAlergias() {
        return notasAlergias;
    }

    public void setNotasAlergias(String notasAlergias) {
        this.notasAlergias = notasAlergias;
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "idCLiente=" + idCLiente +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", password='" + password + '\'' +
                ", notasAlergias='" + notasAlergias + '\'' +
                '}';
    }
}
