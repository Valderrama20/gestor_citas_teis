package es.iesdeteis.gestorcitas.dto;

public class AuthResponse {
    private final String token;
    private final UsuarioDTO usuario;

    public AuthResponse(String token, UsuarioDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() {
        return token;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }
}
