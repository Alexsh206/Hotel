package com.example.hotel.repository;

import com.example.hotel.model.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Bookings, Long> {

    @Query("""
SELECT b FROM Bookings b
WHERE b.room.id = :roomId
  AND b.status = 'ACTIVE'
  AND b.checkIn <= :to
  AND b.checkOut >= :from
""")
    List<Bookings> findOverlaps(@Param("roomId") Long roomId,
                                @Param("from") LocalDate from,
                                @Param("to") LocalDate to);


    long countByStatus(com.example.hotel.model.BookingStatus status);
}
