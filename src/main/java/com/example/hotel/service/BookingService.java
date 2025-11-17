package com.example.hotel.service;

import com.example.hotel.model.*;
import com.example.hotel.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final RoomsRepository roomRepo;
    private final CustomersRepository customerRepo;

    public BookingService(BookingRepository bookingRepo,
                          RoomsRepository roomRepo,
                          CustomersRepository customerRepo) {
        this.bookingRepo = bookingRepo;
        this.roomRepo = roomRepo;
        this.customerRepo = customerRepo;
    }

    @Transactional
    public Bookings createBooking(Bookings booking) {
        LocalDate from = booking.getCheckIn();
        LocalDate to = booking.getCheckOut();
        boolean conflict = bookingRepo.hasConflict(
                booking.getRoom().getId(),
                booking.getCheckIn(),
                booking.getCheckOut()
        );

        if (conflict) {
            throw new RuntimeException("Room already booked for selected dates");
        }
        if (from == null || to == null || !from.isBefore(to)) {
            throw new IllegalArgumentException("Invalid booking dates");
        }

        Rooms room = roomRepo.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Customers customer = customerRepo.findById(booking.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Bookings> overlaps = bookingRepo.findOverlaps(room.getId(), from, to);
        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("Room not available for the selected dates");
        }

        booking.setRoom(room);
        booking.setCustomer(customer);
        booking.setStatus(BookingStatus.ACTIVE);

        return bookingRepo.save(booking);
    }

    @Transactional
    public Bookings cancelBooking(Long bookingId) {
        Bookings booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELED);
        return bookingRepo.save(booking);
    }

    public List<Bookings> getAll() {
        return bookingRepo.findAll();
    }

    public List<Bookings> getByCustomerId(Long id) {
        return bookingRepo.findByCustomerId(id);
    }

    @Transactional
    public Bookings updateBooking(Long id, Bookings updated) {
        Bookings existing = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (updated.getCheckIn() != null) existing.setCheckIn(updated.getCheckIn());
        if (updated.getCheckOut() != null) existing.setCheckOut(updated.getCheckOut());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        if (!existing.getCheckIn().isBefore(existing.getCheckOut())) {
            throw new IllegalArgumentException("Некоректні дати: check-in має бути раніше за check-out");
        }

        return bookingRepo.save(existing);
    }
    public List<Map<String, LocalDate>> getUnavailableDates(Long roomId) {
        List<Bookings> bookings = bookingRepo.findFutureBookingsByRoom(roomId, LocalDate.now());

        return bookings.stream()
                .map(b -> Map.of(
                        "start", b.getCheckIn(),
                        "end", b.getCheckOut()
                ))
                .toList();
    }

}
