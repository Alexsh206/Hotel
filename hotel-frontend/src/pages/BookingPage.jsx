import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getRooms, createBooking, getUnavailableDates } from "../api/api";
import PaymentModal from "../components/PaymentModal";

export default function BookingPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [unavailable, setUnavailable] = useState([]); // 🛑 зайняті періоди

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [newBooking, setNewBooking] = useState(null);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location }, replace: true });
        }
    }, [isAuthenticated, location, navigate]);

    useEffect(() => {
        setLoading(true);

        getRooms()
            .then((data) => {
                setRooms(data);

                if (location.state?.roomId) {
                    setSelectedRoom(location.state.roomId);
                }
            })
            .catch((err) => console.error("Помилка при завантаженні кімнат:", err))
            .finally(() => setLoading(false));
    }, [location.state.roomId]);

    useEffect(() => {
        if (!selectedRoom) return;

        getUnavailableDates(selectedRoom)
            .then((res) => {
                setUnavailable(res.data || res);
            })
            .catch((err) => console.error("Помилка отримання зайнятих дат:", err));
    }, [selectedRoom]);

    const isDateBlocked = (d) => {
        const date = new Date(d);

        return unavailable.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            return date >= start && date <= end;
        });
    };

    const handleStartChange = (value) => {
        if (isDateBlocked(value)) {
            alert("❌ Ця дата вже зайнята!");
            return;
        }
        setCheckIn(value);

        if (checkOut && checkOut <= value) {
            setCheckOut("");
        }
    };

    const handleEndChange = (value) => {
        if (isDateBlocked(value)) {
            alert("❌ У ці дати номер зайнятий!");
            return;
        }
        setCheckOut(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        if (!isAuthenticated || !user) {
            setMessage("❌ Ви не авторизовані.");
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
            setMessage(" Бронювання створено!");
            setNewBooking(res);
        } catch (err) {
            setMessage((err.response?.data?.message || "Помилка створення бронювання"));
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // UI
    // -------------------------------------------------------
    return (
        <div className="booking-wrapper">
            <div className="booking-card">
                <h1>Бронювання номера</h1>

                {message && (
                    <div className="message"
                         style={{ color: message.includes("") ? "green" : "darkred" }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Номер:</label>
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            required
                            disabled={location.state?.roomId}
                        >
                            <option value="">-- Виберіть номер --</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.type} — {room.price}₴ / ніч
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Дата заїзду:</label>
                        <input
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => handleStartChange(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Дата виїзду:</label>
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || today}
                            onChange={(e) => handleEndChange(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Надсилання..." : "Забронювати"}
                    </button>
                </form>
            </div>

            {newBooking && (
                <PaymentModal
                    booking={newBooking}
                    onClose={() => setNewBooking(null)}
                />
            )}
        </div>
    );
}
