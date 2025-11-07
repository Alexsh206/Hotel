package com.example.hotel.service;

import com.example.hotel.model.Customers;
import com.example.hotel.repository.CustomersRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    private final CustomersRepository repo;

    public CustomerService(CustomersRepository repo) {
        this.repo = repo;
    }

    public List<Customers> getAll() {
        return repo.findAll();
    }

    public Customers getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customers create(Customers customer) {
        return repo.save(customer);
    }

    public Customers update(Long id, Customers updated) {
        Customers existing = getById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setPassword(updated.getPassword());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Optional<Customers> login(String Email, String password) {
        return repo.findByEmailAndPassword(Email, password);
    }
}
