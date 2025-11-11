package com.example.hotel.controller;

import com.example.hotel.model.Bookings;
import com.example.hotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/customer/{id}")
    public List<Bookings> getByCustomer(@PathVariable Long id) {
        return service.getByCustomerId(id);
    }

    // ✅ JSON-версія
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Bookings booking) {
        try {
            return ResponseEntity.ok(service.createBooking(booking));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    " Некоректні дати: дата виїзду повинна бути пізніше дати заїзду."
            );
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(
                    " Обрана кімната вже заброньована на вибрані дати."
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    " Помилка створення бронювання: " + e.getMessage()
            );
        }
    }

    @PutMapping("/{id}/cancel")
    public Bookings cancel(@PathVariable Long id) {
        return service.cancelBooking(id);
    }
    @PutMapping("/{id}")
    public Bookings updateBooking(@PathVariable Long id, @RequestBody Bookings updated) {
        return service.updateBooking(id, updated);
    }
}
