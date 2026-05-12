package es.iesdeteis.gestorcitas.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {}) // Si ya se tiene configuración Cors en un bean o WebMvcConfigurer, esto le permite encontrarla
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Accesos públicos
                .requestMatchers("/auth/login", "/auth/registro", "/error/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/CursosController/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/talleres/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/horarios-talleres/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/citas/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/contacto/**").permitAll()
                // Reglas según Roles. Asumiendo nombres exactos mapeados a ROLE_ADMIN y ROLE_PROFESOR
                .requestMatchers("/administradores/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/talleres/**").hasAnyRole("ADMIN", "PROFESOR")
                .requestMatchers(HttpMethod.PUT, "/talleres/**").hasAnyRole("ADMIN", "PROFESOR")
                .requestMatchers(HttpMethod.DELETE, "/talleres/**").hasAnyRole("ADMIN", "PROFESOR")
                    .requestMatchers(HttpMethod.GET, "/citas/**").hasAnyRole("ADMIN", "PROFESOR")
                    .requestMatchers(HttpMethod.PUT, "/citas/**").hasAnyRole("ADMIN", "PROFESOR")
                // Cualquier otra requerir autenticación
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
