package com.example.hotel.controller;

import com.example.hotel.model.Bookings;
import com.example.hotel.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Bookings> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Bookings getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Bookings createBooking(
            @RequestParam Long customerId,
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        LocalDate from = LocalDate.parse(checkIn);
        LocalDate to = LocalDate.parse(checkOut);
        return service.createBooking(customerId, roomId, from, to);
    }

    @PutMapping("/{id}/cancel")
    public Bookings cancel(@PathVariable Long id) {
        return service.cancelBooking(id);
    }
}
