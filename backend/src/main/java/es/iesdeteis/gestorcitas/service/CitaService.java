package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Cita;
import es.iesdeteis.gestorcitas.model.PerfilCliente;
import es.iesdeteis.gestorcitas.model.Usuario;
import es.iesdeteis.gestorcitas.repository.CitaRepository;
import es.iesdeteis.gestorcitas.repository.PerfilClienteRepository;
import es.iesdeteis.gestorcitas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaService implements ICitaService {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilClienteRepository perfilClienteRepository;

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
            Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuarioRequest.getEmail());

            if (usuarioExistente.isPresent()) {
                Usuario usuarioDB = usuarioExistente.get();

                if (usuarioRequest.getPerfilCliente() != null && usuarioRequest.getPerfilCliente().getNotasAlergias() != null) {
                    PerfilCliente perfil = usuarioDB.getPerfilCliente();
                    if (perfil != null) {
                        perfil.setNotasAlergias(usuarioRequest.getPerfilCliente().getNotasAlergias());
                        perfilClienteRepository.save(perfil);
                    }
                }
                
                cita.setCliente(usuarioDB);
            } else {
                throw new RuntimeException("El usuario con email " + usuarioRequest.getEmail() + " no existe. El registro temporal está deshabilitado.");
            }
        }

        citaRepository.save(cita);
    }

    @Override
    public void deleteById(Long id) {
        citaRepository.deleteById(id);
    }
<<<<<<< HEAD
}
=======

    @Override
    public List<Cita> findByTallerIdTaller(Long idTaller) {
        return citaRepository.findByTallerIdTaller(idTaller);
    }

    @Override
    public List<Cita> findByCursoId(Long idCurso) {
        return citaRepository.findByTallerIdCurso(idCurso);
    }
}
>>>>>>> main
