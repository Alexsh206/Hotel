package com.example.hotel.repository;

import com.example.hotel.model.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Long> {

    List<Reviews> findByRoomId(Long roomId);

    @Query("SELECT AVG(r.rating) FROM Reviews r WHERE r.room.id = :roomId")
    Double getAverageRatingForRoom(Long roomId);

    @Query("SELECT AVG(r.rating) FROM Reviews r")
    Double getGlobalAverageRating();

    @Query("SELECT r.room.type, AVG(r.rating) FROM Reviews r GROUP BY r.room.type ORDER BY AVG(r.rating) DESC")
    List<Object[]> getTopRatedRooms();
}
