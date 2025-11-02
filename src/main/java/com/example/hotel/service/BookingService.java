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

    public BookingService(BookingRepository bookingRepo, RoomsRepository roomRepo, CustomersRepository customerRepo) {
        this.bookingRepo = bookingRepo;
        this.roomRepo = roomRepo;
        this.customerRepo = customerRepo;
    }

    @Transactional
    public Bookings createBooking(Long customerId, Long roomId, LocalDate from, LocalDate to) {
        if (!from.isBefore(to))
            throw new IllegalArgumentException("checkIn must be before checkOut");

        Rooms room = roomRepo.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        Customers customer = customerRepo.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Bookings> overlaps = bookingRepo.findOverlaps(room.getId(), from, to);
        if (!overlaps.isEmpty())
            throw new IllegalStateException("Room not available for the selected dates");

        Bookings booking = Bookings.builder()
                .customer(customer)
                .room(room)
                .checkIn(from)
                .checkOut(to)
                .status(BookingStatus.ACTIVE)
                .build();

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

    public Bookings getById(Long id) {
        return bookingRepo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
