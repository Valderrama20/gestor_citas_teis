package es.iesdeteis.gestorcitas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import es.iesdeteis.gestorcitas.dto.ContactRequest;
import es.iesdeteis.gestorcitas.service.EmailService;

@RestController
@RequestMapping("/contacto")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarMensajeContacto(@RequestBody ContactRequest contactRequest) {
        try {
            // Validaciones básicas
            if (contactRequest.getNombre() == null || contactRequest.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es requerido");
            }
            if (contactRequest.getEmail() == null || contactRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es requerido");
            }
            if (contactRequest.getMensaje() == null || contactRequest.getMensaje().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El mensaje es requerido");
            }

            // Enviar el email
            emailService.sendContactEmail(
                    contactRequest.getNombre(),
                    contactRequest.getEmail(),
                    contactRequest.getMensaje());

            return ResponseEntity.ok().body("Mensaje enviado correctamente. Nos pondremos en contacto pronto.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al enviar el mensaje: " + e.getMessage());
        }
    }
}
