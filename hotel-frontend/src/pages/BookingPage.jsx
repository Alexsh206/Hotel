import React, { useState, useEffect } from "react";
import { getRooms, createBooking } from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import PaymentModal from "../components/PaymentModal";
import {useLocation, useNavigate} from "react-router-dom";

export default function BookingPage() {
    const { user, isAuthenticated } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [newBooking, setNewBooking] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location }, replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    useEffect(() => {
        setLoading(true);
        getRooms()
            .then((data) => {
                const uniqueByType = data.reduce((acc, room) => {
                    if (!acc.some((r) => r.type === room.type)) acc.push(room);
                    return acc;
                }, []);
                setRooms(uniqueByType);
            })
            .catch((err) => {
                console.error("Помилка при завантаженні кімнат:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    // ✅ створення бронювання
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (!isAuthenticated || !user) {
            setMessage("❌ Ви не авторизовані. Увійдіть у систему.");
            setLoading(false);
            return;
        }

        const booking = {
            room: { id: selectedRoom },
            customer: { id: user.id },
            checkIn,
            checkOut,
        };

        try {
            const res = await createBooking(booking);
            setMessage("✅ Бронювання створено успішно!");
            setNewBooking(res); // ✅ відкриваємо модалку оплати
            setSelectedRoom("");
            setCheckIn("");
            setCheckOut("");
        } catch (err) {
            console.error("Помилка створення бронювання:", err);
            if (err.response?.data?.message?.includes("already booked")) {
                setMessage("❌ Цей номер уже заброньований на вибрані дати");
            } else {
                setMessage("❌ Не вдалося створити бронювання");
            }
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="booking-wrapper">
            <div className="booking-card">
                <h1>Бронювання номера</h1>

                {message && (
                    <div
                        className="message"
                        style={{
                            color: message.includes("✅") ? "green" : "darkred",
                            fontWeight: "600",
                            marginBottom: "10px",
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Вибір номера */}
                    <div className="field">
                        <label>Виберіть номер:</label>
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Виберіть номер --</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.type} — {room.price}₴ / ніч
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Дати */}
                    <div className="field">
                        <label>Дата заїзду:</label>
                        <input
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => setCheckIn(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label>Дата виїзду:</label>
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || today}
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Кнопка */}
                    <button type="submit" disabled={loading}>
                        {loading ? "Надсилання..." : "Забронювати"}
                    </button>
                </form>
            </div>

            {/* ✅ Модальне вікно оплати */}
            {newBooking && (
                <PaymentModal
                    booking={newBooking}
                    onClose={() => setNewBooking(null)}
                />
            )}
        </div>
    );
}
