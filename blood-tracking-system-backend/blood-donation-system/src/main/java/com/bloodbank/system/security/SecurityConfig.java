package com.bloodbank.system.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            //  Disable CSRF (JWT = stateless)
            .csrf(csrf -> csrf.disable())

            //  No session (JWT only)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            //  API authorization rules
            .authorizeHttpRequests(auth -> auth

            	    // PUBLIC
            	    .requestMatchers("/auth/**","/error").permitAll()

            	    // ADMIN
            	    .requestMatchers("/api/admin/**").hasRole("ADMIN")

            	    // HOSPITAL & DONOR - Both can access blood requests (method-level security handles specifics)
            	    .requestMatchers("/api/hospital/**").hasAnyRole("HOSPITAL", "DONOR")
            	    
            	    // DONATIONS - Both roles can access
            	    .requestMatchers("/api/donations/**").hasAnyRole("HOSPITAL", "DONOR")

            	    // DONOR
            	    .requestMatchers("/api/donors/**").hasRole("DONOR")

            	    // COMMON AUTH
            	    .anyRequest().authenticated()
            	)
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())



            // Add JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    
    
 // 4. ADD THIS KEY METHOD
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Allow Frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication manager (needed for login)
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
