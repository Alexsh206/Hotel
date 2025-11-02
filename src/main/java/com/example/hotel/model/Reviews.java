package com.example.hotel.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Customers customer;

    @ManyToOne(optional = false)
    private Rooms room;

    private int rating;
    private String comment;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
