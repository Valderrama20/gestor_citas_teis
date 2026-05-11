package es.iesdeteis.gestorcitas.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Collections;
import java.util.Map;

@Service
public class CorreoService implements ICorreoService {

    private static final Logger logger = LoggerFactory.getLogger(CorreoService.class);

    // --- ATRIBUTOS ---
    @Autowired
    private Resend resend;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${resend.from-email}")
    private String fromEmail;

    // --- METODOS HEREDADOS ---
    @Async("taskExecutor")
    @Override
    public void enviarCorreoHtml(String destinatario, String asunto, String nombrePlantilla, Map<String, Object> variables) {
        try {
            Context context = new Context();
            context.setVariables(variables != null ? variables : Collections.emptyMap());

            String html = templateEngine.process(nombrePlantilla, context);

            CreateEmailOptions email = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(destinatario)
                    .subject(asunto)
                    .html(html)
                    .build();

            resend.emails().send(email);
        } catch (Exception e) {
            logger.error("No se pudo enviar el correo HTML a {}", destinatario, e);
        }
    }
}
