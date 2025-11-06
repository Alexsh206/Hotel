package com.example.hotel.service;

import com.example.hotel.model.Staff;
import com.example.hotel.repository.StaffRepository;
import jakarta.validation.constraints.Email;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {
    private final StaffRepository repo;

    public StaffService(StaffRepository repo) {
        this.repo = repo;
    }

    public List<Staff> findAll() {
        return repo.findAll();
    }

    public Optional<Staff> findById(Integer id) {
        return repo.findById(Long.valueOf(id));
    }

    public Staff create(Staff s) {
        return repo.save(s);
    }

    public Staff update(Staff s) {
        return repo.save(s);
    }

    public void delete(Integer id) {
        repo.deleteById(Long.valueOf(id));
    }

    public Optional<Staff> login(String Email, String password) {
        return repo.findByEmailAndPassword(Email, password);
    }
}
