package com.example.hotel.controller;

import com.example.hotel.model.Rooms;
import com.example.hotel.service.RoomService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    @GetMapping
    public List<Rooms> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Rooms getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Rooms create(@RequestBody Rooms room) {
        return service.create(room);
    }

    @PutMapping("/{id}")
    public Rooms update(@PathVariable Long id, @RequestBody Rooms updatedRoom) {
        return service.update(id, updatedRoom);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
