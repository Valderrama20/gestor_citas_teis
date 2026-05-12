package es.iesdeteis.gestorcitas.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class CitaCancelacionTokenService {

    @Value("${citas.cancelacion.secret}")
    private String secret;

    @Value("${citas.cancelacion.issuer:gestor_citas}")
    private String issuer;

    public String generarToken(Long idCita, Instant expiracion) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .issuer(issuer)
                .claim("idCita", idCita)
                .expiration(Date.from(expiracion))
                .issuedAt(new Date())
                .signWith(key)
                .compact();
    }

    public Long extraerIdCita(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Number id = claims.get("idCita", Number.class);
        return id != null ? id.longValue() : null;
    }
}
