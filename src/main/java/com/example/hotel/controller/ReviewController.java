package com.example.hotel.controller;

import com.example.hotel.model.Reviews;
import com.example.hotel.service.ReviewService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reviews> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Reviews getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Reviews create(@RequestBody Reviews review) {
        return service.create(review);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
