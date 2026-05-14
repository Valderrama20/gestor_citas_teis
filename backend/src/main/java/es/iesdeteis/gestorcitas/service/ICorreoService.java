package es.iesdeteis.gestorcitas.service;

import java.util.Map;

public interface ICorreoService {

    // --- METODOS PROPIOS ---
    public void enviarCorreoHtml(String destinatario, String asunto, String nombrePlantilla, Map<String, Object> variables);
}
