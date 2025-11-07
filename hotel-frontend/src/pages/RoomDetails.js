import React, { useEffect, useState } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import { getRooms } from "../api/api";
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

            <Link to="/login" className="book-btn">Забронювати</Link>
        </div>
    );
};

export default RoomDetails;
