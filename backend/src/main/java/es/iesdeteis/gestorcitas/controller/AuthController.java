package es.iesdeteis.gestorcitas.controller;

import es.iesdeteis.gestorcitas.dto.AuthRequest;
import es.iesdeteis.gestorcitas.dto.AuthResponse;
import es.iesdeteis.gestorcitas.dto.UsuarioDTO;
import es.iesdeteis.gestorcitas.model.Usuario;
import es.iesdeteis.gestorcitas.service.IUsuarioService;
import es.iesdeteis.gestorcitas.security.CustomUserDetailsService;
import es.iesdeteis.gestorcitas.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private IUsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {

        System.out.println( " Console.log: "+ authRequest);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authRequest.getEmail());

        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario usuario = usuarioService.findByEmail(authRequest.getEmail()).orElse(null);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        UsuarioDTO usuarioDTO = new UsuarioDTO(
                usuario != null ? usuario.getIdUsuario() : null,
                usuario != null ? usuario.getNombre() : null,
                authRequest.getEmail(),
                roles
        );

        AuthResponse res = new AuthResponse(jwt, usuarioDTO);

        return ResponseEntity.ok(res);
    }
}
