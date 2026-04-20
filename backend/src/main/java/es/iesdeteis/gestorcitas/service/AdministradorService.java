package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Administrador;
import es.iesdeteis.gestorcitas.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministradorService implements IAdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    public List<Administrador> findAll() { return (List<Administrador>) administradorRepository.findAll();}

    @Override
    public Administrador findById(Long id_admin) {return administradorRepository.findById(id_admin).orElse(null);
    }

    @Override
    public void save(Administrador administrador){
        administradorRepository.save(administrador);
    }

    @Override
    public void deleteById(Long id_admin) {
        administradorRepository.deleteById(id_admin);
    }
}
