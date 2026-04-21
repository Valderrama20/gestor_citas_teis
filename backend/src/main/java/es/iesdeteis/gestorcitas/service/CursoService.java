package es.iesdeteis.gestorcitas.service;

import es.iesdeteis.gestorcitas.model.Curso;
import es.iesdeteis.gestorcitas.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CursoService implements ICursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public List<Curso> findAll() {
        return (List<Curso>) cursoRepository.findAll();
    }

    @Override
    public Curso findById(Long idCurso) {
        return cursoRepository.findById(idCurso).orElse(null);
    }

    @Override
    public void save(Curso curso) {
        cursoRepository.save(curso);
    }

    @Override
    public void deleteById(Long idCurso) {
        cursoRepository.deleteById(idCurso);
    }

}
