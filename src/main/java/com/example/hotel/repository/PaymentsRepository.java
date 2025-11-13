package com.example.hotel.repository;

import com.example.hotel.model.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentsRepository extends JpaRepository<Payments, Long> {
    @Query("SELECT SUM(p.amount) FROM Payments p")
    Double getTotalRevenue();

    @Query("SELECT SUM(p.amount) FROM Payments p WHERE p.date BETWEEN :start AND :end")
    Double getRevenueByPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p.method, SUM(p.amount) FROM Payments p GROUP BY p.method")
    List<Object[]> getRevenueByMethod();
}
