package com.example.hotel.controller;

import com.example.hotel.config.JwtConfig;
import com.example.hotel.service.CustomerService;
import com.example.hotel.service.StaffService;
import com.example.hotel.model.Customers;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final CustomerService customerService;
    private final StaffService staffService;
    private final JwtConfig jwtConfig;

    public AuthController(CustomerService customerService,
                          StaffService staffService,
                          JwtConfig jwtConfig) {
        this.customerService = customerService;
        this.staffService = staffService;
        this.jwtConfig = jwtConfig;
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> loginApi(@RequestBody LoginRequest creds) {
        return doLogin(creds);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginRoot(@RequestBody LoginRequest creds) {
        return doLogin(creds);
    }

    // Загальна логіка логіну
    private ResponseEntity<?> doLogin(LoginRequest creds) {
        return customerService.login(creds.getEmail(), creds.getPassword())
                .map(c -> buildResponse(c.getId(), "customer",
                        Map.of("name", c.getName(),
                                "email", c.getEmail())))
                .or(() -> staffService.login(creds.getEmail(), creds.getPassword())
                        .map(s -> buildResponse(s.getId(), "staff",
                                Map.of("name", s.getFullName(),
                                        "position", s.getPosition()))))
                .orElseGet(() ->
                        ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"))
                );
    }

    private ResponseEntity<Map<String, Object>> buildResponse(Long id, String role, Map<String, Object> extras) {
        String token = jwtConfig.createToken(Math.toIntExact(id), role);
        Map<String, Object> out = new HashMap<>(extras);
        out.put("token", token);
        out.put("role", role);
        out.put("id", id);
        return ResponseEntity.ok(out);
    }

    @Setter
    @Getter
    public static class LoginRequest {
        private String email;
        private String password;
    }
}
