package com.example.hotel.repository;

import com.example.hotel.model.BookingStatus;
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
    List<Bookings> findOverlaps(
            @Param("roomId") Long roomId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
    List<Bookings> findByCustomerId(Long id);

    long countByStatus(BookingStatus status);

    @Query("SELECT b FROM Bookings b WHERE b.checkIn >= :from AND b.checkOut <= :to")
    List<Bookings> findByPeriod(LocalDate from, LocalDate to);

    @Query("SELECT b.room.type, COUNT(b) FROM Bookings b GROUP BY b.room.type ORDER BY COUNT(b) DESC")
    List<Object[]> getMostBookedRoomTypes();
    @Query("""
        SELECT COUNT(b) > 0 FROM Bookings b
        WHERE b.room.id = :roomId
        AND b.checkOut > :start
        AND b.checkIn < :end
    """)
    boolean hasConflict(
            @Param("roomId") Long roomId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
    @Query("""
       SELECT b FROM Bookings b 
       WHERE b.room.id = :roomId
       AND b.checkOut >= :today
    """)
    List<Bookings> findFutureBookingsByRoom(@Param("roomId") Long roomId,
                                            @Param("today") LocalDate today);
}
