package com.example.hotel.controller;

import com.example.hotel.config.JwtConfig;
import com.example.hotel.model.Customers;
import com.example.hotel.model.Staff;
import com.example.hotel.service.CustomerService;
import com.example.hotel.service.StaffService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ProfileController {

    private final CustomerService customerService;
    private final StaffService staffService;
    private final JwtConfig jwtConfig;

    public ProfileController(CustomerService customerService,
                             StaffService staffService,
                             JwtConfig jwtConfig) {
        this.customerService = customerService;
        this.staffService   = staffService;
        this.jwtConfig      = jwtConfig;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        try {
            Jws<Claims> jwt    = jwtConfig.parseToken(token);
            Claims    body     = jwt.getBody();
            String    role     = body.get("role", String.class);
            int       id       = Integer.parseInt(body.getSubject());

            if ("patient".equals(role)) {
                Customers c = customerService.getById((long) id);
                return ResponseEntity.ok(Map.of(
                        "id",   c.getId(),
                        "name", c.getName(),
                        "role", "patient"
                ));
            } else {
                Staff s = staffService.findById(id).orElseThrow();
                return ResponseEntity.ok(Map.of(
                        "id",       s.getId(),
                        "name",     s.getFullName(),
                        "role",     "staff",
                        "position", s.getPosition()
                ));
            }
        } catch (JwtException e) {
            // токен истёк или неверен
            return ResponseEntity.status(401).build();
        }
    }
}