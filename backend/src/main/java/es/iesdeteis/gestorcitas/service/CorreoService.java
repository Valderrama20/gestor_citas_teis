package es.iesdeteis.gestorcitas.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;

@Service
public class CorreoService implements ICorreoService {

    private static final Logger logger = LoggerFactory.getLogger(CorreoService.class);

    // --- ATRIBUTOS ---
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${mail.from:}")
    private String fromEmail;

    // --- METODOS HEREDADOS ---
    @Async("taskExecutor")
    @Override
    public void enviarCorreoHtml(String destinatario, String asunto, String nombrePlantilla, Map<String, Object> variables) {
        try {
            Context context = new Context();
            context.setVariables(variables != null ? variables : Collections.emptyMap());

            String html = templateEngine.process(nombrePlantilla, context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            String from = fromEmail != null ? fromEmail.trim() : "";
            if (!from.isEmpty()) {
                helper.setFrom(from);
            }

            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            logger.error("No se pudo enviar el correo HTML a {}", destinatario, e);
        }
    }
}
