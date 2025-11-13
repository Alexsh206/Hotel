package com.example.hotel.controller;

import com.example.hotel.service.StatisticsService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService service;

    public StatisticsController(StatisticsService service) {
        this.service = service;
    }

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        return service.getOverview();
    }

    @GetMapping("/revenue/monthly")
    public List<Map<String, Object>> getMonthlyRevenue() {
        return service.getMonthlyRevenue();
    }

    @GetMapping("/rooms/popular")
    public List<Map<String, Object>> getPopularRooms() {
        return service.getMostBookedRoomTypes();
    }

    @GetMapping("/rooms/top-rated")
    public List<Map<String, Object>> getTopRatedRooms() {
        return service.getTopRatedRooms();
    }

    @GetMapping("/revenue/methods")
    public List<Map<String, Object>> getRevenueByMethod() {
        return service.getRevenueByPaymentMethod();
    }
}
