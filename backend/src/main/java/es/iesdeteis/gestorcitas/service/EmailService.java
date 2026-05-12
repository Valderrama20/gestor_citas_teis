package es.iesdeteis.gestorcitas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendContactEmail(String nombre, String emailOrigen, String mensaje) {
        SimpleMailMessage email = new SimpleMailMessage();

        // El email se envía a la dirección del instituto
        email.setTo("rafamendoza.dev@gmail.com"); // cambiar a: ies.teis@edu.xunta.gal
        email.setFrom("noreply@iesteis.es");
        email.setSubject("Nuevo mensaje de contacto de " + nombre);

        // Cuerpo del email con los datos del contacto
        String cuerpo = "Ha llegado un nuevo mensaje de contacto:\n\n" +
                "Nombre: " + nombre + "\n" +
                "Email de contacto: " + emailOrigen + "\n\n" +
                "Mensaje:\n" + mensaje;

        email.setText(cuerpo);

        mailSender.send(email);
    }
}
