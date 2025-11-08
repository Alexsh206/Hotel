package com.example.hotel.service;

import com.example.hotel.model.*;
import com.example.hotel.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

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

        if (from == null || to == null || !from.isBefore(to)) {
            throw new IllegalArgumentException("Invalid booking dates");
        }

        Rooms room = roomRepo.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Customers customer = customerRepo.findById(booking.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // ✅ перевірка на перетин
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
}
