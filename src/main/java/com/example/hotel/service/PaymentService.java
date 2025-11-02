package com.example.hotel.service;

import com.example.hotel.model.Payments;
import com.example.hotel.repository.PaymentsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentsRepository repo;

    public PaymentService(PaymentsRepository repo) {
        this.repo = repo;
    }

    public List<Payments> getAll() {
        return repo.findAll();
    }

    public Payments getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public Payments create(Payments payment) {
        return repo.save(payment);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
