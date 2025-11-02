import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    return (
        <div
            className="room-card"
            onClick={() => navigate(`/rooms/${room.id}`)}
            style={{ cursor: "pointer" }}
        >
            <img
                src={room.imageUrl || "/placeholder.jpg"}
                alt={room.type}
                className="room-image"
            />
            <div className="room-info">
                <h3>{room.type}</h3>
                <p>{room.description}</p>
                <p><strong>Ціна:</strong> ${room.price} / ніч</p>
            </div>
        </div>
    );
};

export default RoomCard;
