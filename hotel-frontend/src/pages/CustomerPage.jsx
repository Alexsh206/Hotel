import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export default function CustomerPage() {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        if (!user) {
            nav("/login");
            return;
        }

        const loadData = async () => {
            try {
                const [bookingsRes, roomsRes] = await Promise.all([
                    axios.get(`${API_BASE}/bookings/customer/${user.id}`),
                    axios.get(`${API_BASE}/rooms`)
                ]);

                setBookings(bookingsRes.data);

                // 🔹 Вибираємо лише унікальні номери (по type)
                const uniqueByType = roomsRes.data.reduce((acc, room) => {
                    if (!acc.some(r => r.type === room.type)) acc.push(room);
                    return acc;
                }, []);
                setRooms(uniqueByType);
            } catch (err) {
                console.error("Помилка при завантаженні даних:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user, nav]);

    if (!user) return null;

    const activeBookings = bookings.filter(b => b.status === "ACTIVE");
    const pastBookings = bookings.filter(b => b.status === "CANCELED" || b.status === "COMPLETED");

    return (
        <div className="customer-page">
            <header className="customer-header">
                <h1>👋 Вітаємо, {user.name}</h1>
                <button className="logout-btn" onClick={logout}>
                    🚪 Вийти з акаунту
                </button>
            </header>

            <section className="profile-section">
                <h2>Ваш профіль</h2>
                <p><b>Ім’я:</b> {user.name}</p>
                <p><b>Email:</b> {user.email || "—"}</p>
                <p><b>Телефон:</b> {user.phone || "—"}</p>
            </section>

            <section className="active-bookings">
                <h2>Дійсні бронювання</h2>
                {activeBookings.length === 0 ? (
                    <p>Немає активних бронювань.</p>
                ) : (
                    <ul>
                        {activeBookings.map(b => (
                            <li key={b.id}>
                                Номер: <b>{b.room.type}</b> | {b.checkIn} → {b.checkOut}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="past-bookings">
                <h2>Історія бронювань</h2>
                {pastBookings.length === 0 ? (
                    <p>Історія відсутня.</p>
                ) : (
                    <ul>
                        {pastBookings.map(b => (
                            <li key={b.id}>
                                {b.room.type} ({b.status}) — {b.checkIn} → {b.checkOut}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="rooms-section">
                <h2>Усі номери готелю</h2>
                {rooms.length === 0 ? (
                    <p>Номери не знайдено.</p>
                ) : (
                    <div className="room-list">
                        {rooms.map(r => (
                            <div key={r.id} className="room-card">
                                <h3>{r.type}</h3>
                                <p>Ціна: {r.price}₴ / ніч</p>
                                <button onClick={() => nav("/booking")}>Забронювати</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
