package com.example.hotel.controller;

import com.example.hotel.model.Customers;
import com.example.hotel.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Customers> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Customers getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Customers create(@RequestBody Customers customer) {
        return service.create(customer);
    }

    @PutMapping("/{id}")
    public Customers update(@PathVariable Long id, @RequestBody Customers updated) {
        return service.update(id, updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
