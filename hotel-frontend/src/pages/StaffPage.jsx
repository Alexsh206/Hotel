import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

export default function StaffPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login");
            return;
        }

        loadBookings();
    }, [user]);

    const loadBookings = async () => {
        try {
            const res = await axios.get(`${API_BASE}/bookings`);
            setBookings(res.data);
        } catch (err) {
            console.error("Помилка при завантаженні бронювань:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateBooking = async (id, field, value) => {
        try {
            const updated = bookings.map((b) =>
                b.id === id ? { ...b, [field]: value } : b
            );
            setBookings(updated);

            await axios.put(`${API_BASE}/bookings/${id}`, {
                ...bookings.find((b) => b.id === id),
                [field]: value,
            });

            setMessage("✅ Бронювання оновлено успішно!");
            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            console.error("Помилка при оновленні:", err);
            setMessage("❌ Не вдалося оновити бронювання");
        }
    };

    const handleStatusChange = (id, newStatus) => {
        updateBooking(id, "status", newStatus);
    };

    const handleDateChange = (id, field, value) => {
        updateBooking(id, field, value);
    };

    if (loading) return <p>Завантаження...</p>;

    return (
        <div className="staff-page">
            <header className="customer-header">
                <h1>🧑‍💼 Панель персоналу</h1>
                <button className="logout-btn" onClick={logout}>Вийти</button>
            </header>

            {message && (
                <div
                    style={{
                        textAlign: "center",
                        color: message.includes("✅") ? "green" : "red",
                        fontWeight: "600",
                        marginBottom: "15px",
                    }}
                >
                    {message}
                </div>
            )}

            <table className="bookings-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Клієнт</th>
                    <th>Номер</th>
                    <th>Дата заїзду</th>
                    <th>Дата виїзду</th>
                    <th>Статус</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((b) => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.customer?.name}</td>
                        <td>{b.room?.type}</td>
                        <td>
                            <input
                                type="date"
                                value={b.checkIn}
                                onChange={(e) =>
                                    handleDateChange(b.id, "checkIn", e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="date"
                                value={b.checkOut}
                                onChange={(e) =>
                                    handleDateChange(b.id, "checkOut", e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <select
                                value={b.status}
                                onChange={(e) =>
                                    handleStatusChange(b.id, e.target.value)
                                }
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELED">CANCELED</option>
                            </select>
                        </td>
                        <td>
                            <button
                                className="save-btn"
                                onClick={() => updateBooking(b.id, "status", b.status)}
                            >
                                💾 Зберегти
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
