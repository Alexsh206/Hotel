package com.example.hotel.controller;

import com.example.hotel.model.Payments;
import com.example.hotel.service.PaymentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Payments> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Payments getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Payments create(@RequestBody Payments payment) {
        return service.create(payment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
