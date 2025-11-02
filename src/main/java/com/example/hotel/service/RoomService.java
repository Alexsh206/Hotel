package com.example.hotel.service;

import com.example.hotel.model.Rooms;
import com.example.hotel.repository.RoomsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService {
    private final RoomsRepository repo;

    public RoomService(RoomsRepository repo) {
        this.repo = repo;
    }

    public List<Rooms> getAll() {
        return repo.findAll();
    }

    public Rooms getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Rooms create(Rooms room) {
        return repo.save(room);
    }

    public Rooms update(Long id, Rooms updatedRoom) {
        Rooms existing = getById(id);
        existing.setNumber(updatedRoom.getNumber());
        existing.setType(updatedRoom.getType());
        existing.setPrice(updatedRoom.getPrice());
        existing.setAvailable(updatedRoom.getAvailable());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
