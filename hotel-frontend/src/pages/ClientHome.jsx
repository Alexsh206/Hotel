import React, { useEffect, useState } from "react";
import { getRooms } from "../api/api";
import HotelInfo from "../components/HotelInfo";
import RoomCard from "../components/RoomCard";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const ClientHome = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
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
            .catch((err) => console.error("Помилка при завантаженні кімнат:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="client-home">
            <header className="home-header">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    Hotel Booking
                </div>

                <div className="auth-buttons">
                    {!isAuthenticated ? (
                        <>
                            <button className="btn-login" onClick={() => navigate("/login")}>
                                Увійти
                            </button>
                            <button className="btn-register" onClick={() => navigate("/register")}>
                                Реєстрація
                            </button>
                        </>
                    ) : (
                        <>

                            {(user?.role === "customer") && (
                            <button className="btn-profile" onClick={() => navigate("/customer")}>
                                 Мій профіль
                            </button>)}

                            <button className="btn-logout" onClick={logout}>
                                 Вийти
                            </button>
                        </>
                    )}
                </div>
            </header>

            <HotelInfo />

            <h2 style={{ textAlign: "center", marginTop: "25px" }}>Наші номери</h2>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "20px" }}> Завантаження...</p>
            ) : (
                <div className="room-list">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientHome;
