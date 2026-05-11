package es.iesdeteis.gestorcitas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "perfil_cliente")
public class PerfilCliente {

    @Id
    private Integer idUsuario;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    private String telefono;
    private String notasAlergias;

    public Integer getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getTelefono() {
        return telefono;
    }
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getNotasAlergias() {
        return notasAlergias;
    }
    public void setNotasAlergias(String notasAlergias) {
        this.notasAlergias = notasAlergias;
    }

}
