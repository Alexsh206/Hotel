package com.example.hotel.repository;

import com.example.hotel.model.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomsRepository extends JpaRepository<Rooms, Long> {
    @Query("SELECT r.type, COUNT(r) FROM Rooms r GROUP BY r.type")
    List<Object[]> countRoomsByType();

    @Query("SELECT r.type, AVG(r.price) FROM Rooms r GROUP BY r.type")
    List<Object[]> getAveragePriceByType();
}
