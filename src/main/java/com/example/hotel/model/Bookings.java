package com.example.hotel.model;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings", indexes = {
        @Index(columnList = "room_id"),
        @Index(columnList = "check_in, check_out")
})
public class Bookings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Customers customer;

    @ManyToOne(optional = false)
    private Rooms room;

    @NotNull
    @Column(name = "check_in")
    private LocalDate checkIn;

    @NotNull
    @Column(name = "check_out")
    private LocalDate checkOut;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
