import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    getStatisticsOverview,
    getMonthlyRevenue,
    getPopularRooms,
    getTopRatedRooms,
    getRevenueByPaymentMethod
} from "../api/api";
import { useAuth } from "../auth/AuthProvider";

// --- Головна "супер-безпечна" нормалізація ---
const asPairs = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
        try {
            return Object.entries(data);
        } catch {
            return [];
        }
    }
    return []; // усе інше — число, рядок, boolean
};

const toObjects = (data, key1, key2) => {
    try {
        return asPairs(data)
            .filter(
                (el) =>
                    Array.isArray(el) &&
                    el.length === 2 &&
                    el[0] != null &&
                    typeof el[0] !== "object"
            )
            .map(([k, v]) => ({ [key1]: k, [key2]: v }));
    } catch (e) {
        console.warn("⚠️ toObjects error for", key1, key2, e);
        return [];
    }
};

const normalizeData = {
    overview: (data) => ({
        ...data,
        mostBookedRoomTypes: toObjects(data?.mostBookedRoomTypes, "type", "count"),
        topRatedRooms: toObjects(data?.topRatedRooms, "type", "avgRating"),
        averagePriceByType: toObjects(data?.averagePriceByType, "type", "price"),
    }),
    monthly: (data) => toObjects(data, "month", "revenue"),
    popular: (data) => toObjects(data, "type", "count"),
    rated: (data) => toObjects(data, "type", "avgRating"),
    methods: (data) => toObjects(data, "method", "amount"),
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

    const COLORS = ["#007bff", "#28a745", "#ffc107", "#ff4d4f", "#6f42c1"];

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

                console.log("📊 RAW DATA:", {
                    overview: overviewRes?.value,
                    monthly: monthlyRes?.value,
                    popular: popularRes?.value,
                    rated: ratedRes?.value,
                    methods: methodRes?.value
                });

                if (overviewRes.status === "fulfilled") {
                    setOverview(normalizeData.overview(overviewRes.value));
                }
                if (monthlyRes.status === "fulfilled") {
                    setMonthlyRevenue(normalizeData.monthly(monthlyRes.value));
                }
                if (popularRes.status === "fulfilled") {
                    setPopularRooms(normalizeData.popular(popularRes.value));
                }
                if (ratedRes.status === "fulfilled") {
                    setTopRatedRooms(normalizeData.rated(ratedRes.value));
                }
                if (methodRes.status === "fulfilled") {
                    setRevenueByMethod(normalizeData.methods(methodRes.value));
                }
            } catch (e) {
                console.error("❌ Помилка завантаження статистики:", e);
                setError("Не вдалося завантажити аналітику");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) load();
        else setLoading(false);
    }, [isAuthenticated, user]);

    if (!isAuthenticated || !user) {
        return (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
                🚫 Доступ лише для адміністратора або персоналу.
            </p>
        );
    }

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>⏳ Завантаження аналітики...</p>;
    }

    if (error || !overview) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>⚠️ Дані аналітики недоступні.</p>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>📊 Аналітика готелю</h1>
                <p>Вітаємо, {user.name || "користувач"}! Нижче наведено актуальну статистику.</p>
            </header>

            <section className="overview-section">
                <div className="stat-card">
                    <h3>Бронювання</h3>
                    <p className="value">{overview.totalBookings || 0}</p>
                    <span>усього</span>
                </div>
                <div className="stat-card">
                    <h3>Активні</h3>
                    <p className="value green">{overview.activeBookings || 0}</p>
                    <span>поточні бронювання</span>
                </div>
                <div className="stat-card">
                    <h3>Скасовані</h3>
                    <p className="value red">{overview.canceledBookings || 0}</p>
                    <span>всього</span>
                </div>
                <div className="stat-card">
                    <h3>Дохід</h3>
                    <p className="value blue">
                        {overview.totalRevenue ? overview.totalRevenue.toFixed(2) : 0} ₴
                    </p>
                    <span>усього отримано</span>
                </div>
                <div className="stat-card">
                    <h3>Середній рейтинг</h3>
                    <p className="value yellow">
                        {overview.averageRating ? overview.averageRating.toFixed(1) : "—"} ⭐
                    </p>
                    <span>за всі номери</span>
                </div>
            </section>

            {/* === ДІАГРАМИ === */}
            <section className="chart-section">
                <h2>💰 Дохід по місяцях</h2>
                {monthlyRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Немає даних по доходу.</p>
                )}
            </section>

            <section className="chart-section">
                <h2>🏨 Популярні типи номерів</h2>
                {popularRooms.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={popularRooms}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#28a745" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Немає даних по популярності номерів.</p>
                )}
            </section>

            <section className="chart-section">
                <h2>⭐ Найкращі кімнати за рейтингом</h2>
                {topRatedRooms.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={topRatedRooms}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Bar dataKey="avgRating" fill="#ffc107" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Немає даних по рейтингу кімнат.</p>
                )}
            </section>

            <section className="chart-section">
                <h2>💳 Розподіл доходів за типом оплати</h2>
                {revenueByMethod.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={revenueByMethod}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="amount"
                                nameKey="method"
                            >
                                {revenueByMethod.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Немає даних про способи оплати.</p>
                )}
            </section>
        </div>
    );
}
