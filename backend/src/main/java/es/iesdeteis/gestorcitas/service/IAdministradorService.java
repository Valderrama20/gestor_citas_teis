package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Administrador;

import java.util.List;

public interface IAdministradorService {


    public List<Administrador> findAll();
    public Administrador findById(Long idAdmin);
    public void save(Administrador administrador);
    public void deleteById(Long id);
}
