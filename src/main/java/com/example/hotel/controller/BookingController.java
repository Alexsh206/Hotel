package com.example.hotel.controller;

import com.example.hotel.model.Bookings;
import com.example.hotel.repository.BookingRepository;
import com.example.hotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService service;
    private final BookingRepository bookingRepository;

    public BookingController(BookingService service, BookingRepository bookingRepository) {
        this.service = service;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Bookings> getAll() {
        return service.getAll();
    }

    @GetMapping("/customer/{id}")
    public List<Bookings> getByCustomer(@PathVariable Long id) {
        return service.getByCustomerId(id);
    }

    @GetMapping("/check")
    public boolean checkAvailability(
            @RequestParam Long roomId,
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut
    ) {
        return !bookingRepository.hasConflict(roomId, checkIn, checkOut);
    }

    @GetMapping("/room/{roomId}/unavailable-dates")
    public List<Map<String, LocalDate>> getUnavailableDates(@PathVariable Long roomId) {
        return service.getUnavailableDates(roomId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Bookings booking) {

        try {
            Bookings saved = service.createBooking(booking);
            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Некоректні дати: дата виїзду повинна бути пізніше дати заїзду.")
            );

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Обрана кімната вже заброньована на вибрані дати.")
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Помилка створення бронювання: " + e.getMessage())
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
