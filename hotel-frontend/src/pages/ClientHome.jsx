import React, { useEffect, useState } from "react";
import { getRooms } from "../api/api";
import HotelInfo from "../components/HotelInfo";
import RoomCard from "../components/RoomCard";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const ClientHome = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getRooms()
            .then((data) => {
                const uniqueByType = data.reduce((acc, room) => {
                    if (!acc.some((r) => r.type === room.type)) {
                        acc.push(room);
                    }
                    return acc;
                }, []);
                setRooms(uniqueByType);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="client-home">
            {/* 🌟 Верхній хедер */}
            <header className="home-header">
                <div className="logo" onClick={() => navigate("/")}>
                    🏨 Hotel Booking
                </div>

                <div className="auth-buttons">
                    {isAuthenticated ? (
                        <>
                            <button
                                className="btn-profile"
                                onClick={() => navigate("/customer")}
                            >
                                Мій профіль
                            </button>
                            <button className="btn-logout" onClick={logout}>
                                Вийти
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn-login"
                                onClick={() => navigate("/login")}
                            >
                                Увійти
                            </button>
                            <button
                                className="btn-register"
                                onClick={() => navigate("/register")}
                            >
                                Реєстрація
                            </button>
                        </>
                    )}
                </div>
            </header>

            <HotelInfo />

            <h2 style={{ textAlign: "center", marginTop: "20px" }}>Наші номери</h2>

            {loading ? (
                <p style={{ textAlign: "center" }}>Завантаження...</p>
            ) : (
                <div className="room-list">
                    {rooms.map((r) => (
                        <RoomCard key={r.id} room={r} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientHome;
