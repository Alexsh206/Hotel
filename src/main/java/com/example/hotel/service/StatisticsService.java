package com.example.hotel.service;

import com.example.hotel.model.BookingStatus;
import com.example.hotel.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final BookingRepository bookingRepo;
    private final PaymentsRepository paymentRepo;
    private final ReviewsRepository reviewRepo;
    private final RoomsRepository roomRepo;

    public StatisticsService(BookingRepository bookingRepo,
                             PaymentsRepository paymentRepo,
                             ReviewsRepository reviewRepo,
                             RoomsRepository roomRepo) {
        this.bookingRepo = bookingRepo;
        this.paymentRepo = paymentRepo;
        this.reviewRepo = reviewRepo;
        this.roomRepo = roomRepo;
    }

    public Map<String, Object> getOverview() {
        Map<String, Object> data = new LinkedHashMap<>();

        data.put("totalBookings", bookingRepo.count());
        data.put("activeBookings", bookingRepo.countByStatus(BookingStatus.ACTIVE));
        data.put("canceledBookings", bookingRepo.countByStatus(BookingStatus.CANCELED));
        data.put("totalRevenue", Optional.ofNullable(paymentRepo.getTotalRevenue()).orElse(0.0));
        data.put("averageRating", Optional.ofNullable(reviewRepo.getGlobalAverageRating()).orElse(0.0));
        data.put("mostBookedRoomTypes", bookingRepo.getMostBookedRoomTypes());
        data.put("topRatedRooms", reviewRepo.getTopRatedRooms());
        data.put("averagePriceByType", roomRepo.getAveragePriceByType());

        return data;
    }

    public List<Map<String, Object>> getMonthlyRevenue() {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.from(now.minusMonths(i));
            LocalDate start = month.atDay(1);
            LocalDate end = month.atEndOfMonth();
            Double total = Optional.ofNullable(paymentRepo.getRevenueByPeriod(start.atStartOfDay(), end.atStartOfDay())).orElse(0.0);

            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month.getMonth().toString());
            entry.put("revenue", total);
            result.add(entry);
        }
        return result;
    }

    public List<Map<String, Object>> getMostBookedRoomTypes() {
        return bookingRepo.getMostBookedRoomTypes().stream()
                .map(o -> Map.of("type", o[0], "count", o[1]))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTopRatedRooms() {
        return reviewRepo.getTopRatedRooms().stream()
                .map(o -> Map.of("type", o[0], "avgRating", o[1]))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRevenueByPaymentMethod() {
        return paymentRepo.getRevenueByMethod().stream()
                .map(o -> Map.of("method", o[0], "amount", o[1]))
                .collect(Collectors.toList());
    }
}
