import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    // 🖼️ Відображення зображення залежно від типу номера
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

    // 📝 Індивідуальні описи номерів
    const getRoomDescription = (type) => {
        const descriptions = {
            "Budget Double Room": "Затишний економ-номер для двох із базовими зручностями та приємним інтер’єром.",
            "Double Room with king-size bed": "Просторий номер із великим ліжком king-size, телевізором і видом на місто.",
            "Double Room with two beds": "Зручний варіант для двох гостей — дві окремі комфортні постелі та простора ванна.",
            "Triple Room": "Комфортний номер на трьох із кондиціонером, телевізором і безкоштовним Wi-Fi.",
            "Lux Room": "Покращений номер із панорамними вікнами, великим телевізором і міні-баром.",
            "Lux-Plus Room": "Великий сучасний номер із балконом, зоною відпочинку та джакузі.",
            "President Lux Room": "Розкішний президентський люкс із вітальнею, кабінетом і панорамним видом на місто.",
        };
        return descriptions[type] || "Сучасний номер із комфортними умовами, кондиціонером, Wi-Fi та сніданком.";
    };

    const handleBook = (e) => {
        e.stopPropagation();
        navigate(`/booking?roomId=${room.id}`);
    };

    return (
        <div className="room-card">
            <img
                src={getRoomImage(room.type)}
                alt={room.type}
                className="room-image"
            />

            <div className="room-info">
                <h3>{room.type}</h3>
                <p className="room-description">
                    {getRoomDescription(room.type)}
                </p>
                <p className="room-price">
                    <strong>Ціна:</strong> {room.price}₴ / ніч
                </p>

                <button className="book-btn" onClick={handleBook}>
                    Забронювати
                </button>
            </div>
        </div>
    );
};

export default RoomCard;
