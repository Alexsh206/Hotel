import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    const getRoomImage = (type) => {
        const map = {
            "Budget Double Room": "/assets/rooms/budget.jpg",
            "Double Room with king-size bed": "/assets/rooms/double_king.jpg",
            "Double Room with two beds": "/assets/rooms/double_two_beds.jpg",
            "Triple Room": "/assets/rooms/triple.jpg",
            "Lux Room": "/assets/rooms/lux.jpg",
            "Lux-Plus Room": "/assets/rooms/lux_plus.jpg",
            "President Lux Room": "/assets/rooms/president.jpg",
        };
        return map[type] || "/assets/rooms/default.jpg";
    };

    const imageSrc = room.imageUrl || getRoomImage(room.type);

    return (
        <div
            className="room-card"
            onClick={() => navigate(`/rooms/${room.id}`)}
            style={{ cursor: "pointer" }}
        >
            <img
                src={imageSrc}
                alt={room.type}
                className="room-image"
                loading="lazy"
            />
            <div className="room-info">
                <h3 className="room-title">{room.type}</h3>
                {room.description && (
                    <p className="room-desc">{room.description}</p>
                )}
                <p className="room-price">
                    <strong>Ціна:</strong> {room.price}₴ / ніч
                </p>
            </div>
        </div>
    );
};

export default RoomCard;
