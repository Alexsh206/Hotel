import React, { useEffect, useState } from "react";
import {
    getStatisticsOverview,
    getMonthlyRevenue,
    getPopularRooms,
    getTopRatedRooms,
    getRevenueByPaymentMethod,
    getRevenueByPeriod
} from "../api/api";

import { useAuth } from "../auth/AuthProvider";
import MyChart from "../components/MyChart";

const normalizeObjects = (arr, key1, key2) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map(item => {
            if (item[key1] === undefined || item[key2] === undefined) return null;
            return {
                [key1]: item[key1],
                [key2]: item[key2]
            };
        })
        .filter(Boolean);
};

const normalizeData = {
    overview: (data) => ({
        ...data,
        mostBookedRoomTypes: normalizeObjects(data?.mostBookedRoomTypes, "type", "count"),
        topRatedRooms: normalizeObjects(data?.topRatedRooms, "type", "avgRating"),
        averagePriceByType: normalizeObjects(data?.averagePriceByType, "type", "price"),
    }),
    monthly: (data) => normalizeObjects(data, "month", "revenue"),
    popular: (data) => normalizeObjects(data, "type", "count"),
    rated: (data) => normalizeObjects(data, "type", "avgRating"),
    methods: (data) => normalizeObjects(data, "method", "amount"),
};

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();

    const [overview, setOverview] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [popularRooms, setPopularRooms] = useState([]);
    const [topRatedRooms, setTopRatedRooms] = useState([]);
    const [revenueByMethod, setRevenueByMethod] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [revStart, setRevStart] = useState("");
    const [revEnd, setRevEnd] = useState("");
    const [revenuePeriod, setRevenuePeriod] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [
                    overviewRes,
                    monthlyRes,
                    popularRes,
                    ratedRes,
                    methodRes
                ] = await Promise.allSettled([
                    getStatisticsOverview(),
                    getMonthlyRevenue(),
                    getPopularRooms(),
                    getTopRatedRooms(),
                    getRevenueByPaymentMethod()
                ]);

                if (overviewRes.status === "fulfilled")
                    setOverview(normalizeData.overview(overviewRes.value));

                if (monthlyRes.status === "fulfilled")
                    setMonthlyRevenue(normalizeData.monthly(monthlyRes.value));

                if (popularRes.status === "fulfilled")
                    setPopularRooms(normalizeData.popular(popularRes.value));

                if (ratedRes.status === "fulfilled")
                    setTopRatedRooms(normalizeData.rated(ratedRes.value));

                if (methodRes.status === "fulfilled")
                    setRevenueByMethod(normalizeData.methods(methodRes.value));

            } catch (e) {
                setError("Не вдалося завантажити дані");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) load();
        else setLoading(false);
    }, [isAuthenticated, user]);

    const loadRevenuePeriod = async () => {
        if (!revStart || !revEnd) return;
        try {
            const data = await getRevenueByPeriod(revStart, revEnd);
            setRevenuePeriod(data);
        } catch (e) {
            console.error(e);
        }
    };

    if (!isAuthenticated || !user)
        return <p style={{ textAlign: "center", marginTop: 50 }}>🚫 Доступ заборонено.</p>;

    if (loading)
        return <p style={{ textAlign: "center", marginTop: 50 }}>⏳ Завантаження...</p>;

    if (error || !overview)
        return <p style={{ textAlign: "center", marginTop: 50 }}>⚠️ Дані недоступні.</p>;

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <h1>Аналітика готелю</h1>
                <p>Вітаємо, {user.name}!</p>
            </header>

            {/* ОГЛЯД */}
            <section className="overview-section">
                <div className="stat-card">
                    <h3>Бронювання</h3>
                    <p className="value">{overview.totalBookings}</p>
                </div>

                <div className="stat-card">
                    <h3>Активні</h3>
                    <p className="value green">{overview.activeBookings}</p>
                </div>

                <div className="stat-card">
                    <h3>Скасовані</h3>
                    <p className="value red">{overview.canceledBookings}</p>
                </div>

                <div className="stat-card">
                    <h3>Дохід</h3>
                    <p className="value blue">{overview.totalRevenue.toFixed(2)} ₴</p>
                </div>

                <div className="stat-card">
                    <h3>Середній рейтинг</h3>
                    <p className="value yellow">{overview.averageRating?.toFixed(1)} ⭐</p>
                </div>
            </section>

            <section className="chart-section">
                <h2>💵 Дохід за вибраний період</h2>

                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <input type="date" value={revStart} onChange={(e) => setRevStart(e.target.value)} />
                    <input type="date" value={revEnd} onChange={(e) => setRevEnd(e.target.value)} />
                    <button onClick={loadRevenuePeriod}>Завантажити</button>
                </div>

                {revenuePeriod ? (
                    <div className="period-box">
                        <p>📅 <b>{revStart}</b> → <b>{revEnd}</b></p>
                        <p>💰 Дохід: <b>{revenuePeriod.totalRevenue} ₴</b></p>
                    </div>
                ) : (
                    <p>Оберіть період.</p>
                )}
            </section>

            <section className="chart-section">
                <MyChart
                    option={{
                        title: { text: "💰 Дохід по місяцях" },
                        tooltip: {},
                        xAxis: { type: "category", data: monthlyRevenue.map(x => x.month) },
                        yAxis: { type: "value" },
                        series: [{
                            type: "bar",
                            data: monthlyRevenue.map(x => x.revenue),
                            itemStyle: { color: "#007bff" }
                        }]
                    }}
                />
            </section>

            <section className="chart-section">
                <MyChart
                    option={{
                        title: { text: "🏨 Популярні типи номерів" },
                        tooltip: {},
                        xAxis: { type: "category", data: popularRooms.map(x => x.type) },
                        yAxis: {},
                        series: [{
                            type: "bar",
                            data: popularRooms.map(x => x.count),
                            itemStyle: { color: "#28a745" }
                        }]
                    }}
                />
            </section>

            <section className="chart-section">
                <MyChart
                    option={{
                        title: { text: "⭐ Найкращі кімнати" },
                        xAxis: { type: "category", data: topRatedRooms.map(x => x.type) },
                        yAxis: { min: 0, max: 5 },
                        tooltip: {},
                        series: [{
                            type: "bar",
                            data: topRatedRooms.map(x => x.avgRating),
                            itemStyle: { color: "#ffc107" }
                        }]
                    }}
                />
            </section>

            <section className="chart-section">
                <MyChart
                    height={400}
                    option={{
                        title: { text: "💳 Розподіл доходів за типом оплати" },
                        tooltip: { trigger: "item" },
                        series: [
                            {
                                type: "pie",
                                radius: "60%",
                                data: revenueByMethod.map(x => ({
                                    name: x.method,
                                    value: x.amount
                                }))
                            }
                        ]
                    }}
                />
            </section>
        </div>
    );
}
