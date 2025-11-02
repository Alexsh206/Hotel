import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRooms } from "../api";
import RoomGallery from "../components/RoomGallery";

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        getRooms()
            .then((rooms) => {
                const found = rooms.find((r) => r.id === Number(id));
                setRoom(found);
            })
            .catch(console.error);
    }, [id]);

    if (!room) return <p>Завантаження...</p>;

    return (
        <div className="room-details">
            <button className="back-btn" onClick={() => navigate("/")}>
                ← Назад
            </button>

            <h1>{room.type}</h1>
            <RoomGallery images={room.images || [room.imageUrl]} />
            <p className="description">{room.description}</p>
            <p><strong>Ціна:</strong> ${room.price} / ніч</p>

            <button className="book-btn">Забронювати</button>
        </div>
    );
};

export default RoomDetails;
