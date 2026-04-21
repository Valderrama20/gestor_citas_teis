package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Curso;

import java.util.List;

public interface ICursoService {

    public List<Curso> findAll();
    public Curso findById(Long idCurso);
    public void save(Curso curso);
    public void deleteById(Long idCurso);
}
