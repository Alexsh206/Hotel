package com.example.hotel.repository;

import com.example.hotel.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmailAndPassword(String Email, String password);
}
