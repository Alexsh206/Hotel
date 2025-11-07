package com.example.hotel.controller;

import com.example.hotel.model.Staff;
import com.example.hotel.service.StaffService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // GET  /api/staff
    @GetMapping
    public List<Staff> getAll() {
        return staffService.findAll();
    }

    // GET  /api/staff/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getById(@PathVariable Integer id) {
        return staffService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/staff
    @PostMapping
    public ResponseEntity<Staff> create(@RequestBody Staff s) {
        Staff created = staffService.create(s);
        return ResponseEntity.ok(created);
    }

    // PUT  /api/staff/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Staff> update(@PathVariable Integer id,
                                        @RequestBody Staff s) {
        return staffService.findById(id)
                .map(existing -> {
                    s.setId(Long.valueOf(id));
                    Staff updated = staffService.update(s);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/staff/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Integer id) {
        return staffService.findById(id)
                .map(existing -> {
                    staffService.delete(id);
                    return ResponseEntity.<Void>ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/staff/login
    @PostMapping("/login")
    public ResponseEntity<Staff> login(@RequestBody LoginRequest creds) {
        return staffService
                .login(creds.getEmail(), creds.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    // Внутрішній DTO для логіну
    @Setter
    @Getter
    public static class LoginRequest {
        private String Email;
        private String password;

    }
}
