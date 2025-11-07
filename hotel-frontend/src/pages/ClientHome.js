import React, { useEffect, useState } from "react";
import { getRooms } from "../api/api";
import HotelInfo from "../components/HotelInfo";
import RoomCard from "../components/RoomCard";

const ClientHome = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

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
