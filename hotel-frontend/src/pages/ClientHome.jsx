import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../api/api";
import HotelInfo from "../components/HotelInfo";
import RoomCard from "../components/RoomCard";
import "../styles/main.css";

const ClientHome = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

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
            {/* 🔹 Верхня панель */}
            <header className="home-header">
                <div className="logo">
                    🏨 <span>HotelBooking</span>
                </div>
                <div className="auth-buttons">
                    <button
                        className="btn-login"
                        onClick={() => nav("/login")}
                    >
                        Увійти в акаунт
                    </button>
                    <button
                        className="btn-register"
                        onClick={() => nav("/register")}
                    >
                        Зареєструватися
                    </button>
                </div>
            </header>

            {/* 🔹 Інформація про готель */}
            <HotelInfo />

            <h2>Наші номери</h2>
            {loading ? (
                <p>Завантаження...</p>
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
