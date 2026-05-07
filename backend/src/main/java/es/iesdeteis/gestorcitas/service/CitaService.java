package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.model.PerfilCliente;
import es.iesdeteis.gestorcitas.model.Rol;
import es.iesdeteis.gestorcitas.model.Usuario;
import es.iesdeteis.gestorcitas.repository.CitaRepository;
import es.iesdeteis.gestorcitas.repository.PerfilClienteRepository;
import es.iesdeteis.gestorcitas.repository.RolRepository;
import es.iesdeteis.gestorcitas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional // <-- CRÍTICO: Asegura la integridad de los datos
public class CitaService implements ICitaService {

    @Autowired
    private CitaRepository citaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PerfilClienteRepository perfilClienteRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Cita> findAll() {
        return (List<Cita>) citaRepository.findAll();
    }

    @Override
    public Cita findById(Long id) {
        return citaRepository.findById(id).orElse(null);
    }

    @Override
    public void save(Cita cita) {
        Usuario usuarioRequest = cita.getCliente();

        if (usuarioRequest != null && usuarioRequest.getEmail() != null) {
            String emailNormalizado = usuarioRequest.getEmail().trim();
            
            // Buscamos si existe. Si existe lo actualizamos, si no, lo creamos.
            Usuario usuarioFinal = usuarioRepository.findByEmail(emailNormalizado)
                    .map(usuarioDB -> procesarUsuarioExistente(usuarioDB, usuarioRequest))
                    .orElseGet(() -> procesarNuevoUsuario(usuarioRequest, emailNormalizado));

            cita.setCliente(usuarioFinal);
        }

        citaRepository.save(cita);
    }

    // --- MÉTODOS PRIVADOS DE LÓGICA DE NEGOCIO ---

    private Usuario procesarUsuarioExistente(Usuario usuarioDB, Usuario usuarioRequest) {
        actualizarNombre(usuarioDB, usuarioRequest.getNombre());
        actualizarPerfilCliente(usuarioDB, usuarioRequest.getPerfilCliente());
        // No es estrictamente necesario hacer un .save() aquí porque @Transactional 
        // aplica un dirty-checking y guarda los cambios al terminar, pero es buena práctica.
        return usuarioRepository.save(usuarioDB); 
    }

    private Usuario procesarNuevoUsuario(Usuario usuarioRequest, String emailNormalizado) {
        Usuario usuarioNuevo = new Usuario();
        usuarioNuevo.setEmail(emailNormalizado);
        usuarioNuevo.setNombre(resolverNombre(usuarioRequest.getNombre(), emailNormalizado));
        usuarioNuevo.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        usuarioNuevo.setActivo(Boolean.TRUE);
        asignarRolUsuario(usuarioNuevo);

        // 1. Guardamos el usuario PRIMERO para que obtenga su ID
        Usuario usuarioCreado = usuarioRepository.save(usuarioNuevo);

        // 2. AHORA actualizamos su perfil (porque ya tiene ID generado)
        actualizarPerfilCliente(usuarioCreado, usuarioRequest.getPerfilCliente());

        return usuarioCreado;
    }

    private void actualizarNombre(Usuario usuario, String nombreRequest) {
        if (nombreRequest == null) return;
        
        String nombreNormalizado = nombreRequest.trim();
        if (!nombreNormalizado.isEmpty() && !nombreNormalizado.equals(usuario.getNombre())) {
            usuario.setNombre(nombreNormalizado);
        }
    }

    private void actualizarPerfilCliente(Usuario usuario, PerfilCliente perfilRequest) {
        if (perfilRequest == null || perfilRequest.getNotasAlergias() == null) return;

        PerfilCliente perfil = usuario.getPerfilCliente();
        if (perfil == null) {
            perfil = new PerfilCliente();
            perfil.setUsuario(usuario);
            usuario.setPerfilCliente(perfil);
        }

        perfil.setNotasAlergias(perfilRequest.getNotasAlergias());

        // Como nos aseguramos de llamar a este método solo cuando el usuario ya tiene ID:
        if (usuario.getIdUsuario() != null) {
            perfil.setIdUsuario(usuario.getIdUsuario());
            perfilClienteRepository.save(perfil);
        }
    }

    private void asignarRolUsuario(Usuario usuario) {
        Optional<Rol> rolUsuario = rolRepository.findByNombreRol("ROLE_USUARIO");
        if (rolUsuario.isPresent()) {
            Set<Rol> roles = usuario.getRoles();
            if (roles == null) {
                roles = new HashSet<>();
            }
            roles.add(rolUsuario.get());
            usuario.setRoles(roles);
        }
    }

    private String resolverNombre(String nombreRequest, String email) {
        if (nombreRequest != null) {
            String nombreNormalizado = nombreRequest.trim();
            if (!nombreNormalizado.isEmpty()) {
                return nombreNormalizado;
            }
        }
        int separador = email.indexOf("@");
        return (separador > 0) ? email.substring(0, separador) : "Cliente";
    }

    @Override
    public void deleteById(Long id) {
        citaRepository.deleteById(id);
    }

    @Override
    public List<Cita> findByTallerIdTaller(Long idTaller) {
        return citaRepository.findByTallerIdTaller(idTaller);
    }

    @Override
    public List<Cita> findByCursoId(Long idCurso) {
        return citaRepository.findByTallerIdCurso(idCurso);
    }
}