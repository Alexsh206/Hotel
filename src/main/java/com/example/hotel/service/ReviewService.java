package com.example.hotel.service;

import com.example.hotel.model.Reviews;
import com.example.hotel.repository.ReviewsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewsRepository repo;

    public ReviewService(ReviewsRepository repo) {
        this.repo = repo;
    }

    public List<Reviews> getAll() {
        return repo.findAll();
    }

    public Reviews getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public Reviews create(Reviews review) {
        return repo.save(review);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
