import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getReviews, createReview } from "../api/api";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    // 🧩 Отримання всіх відгуків
    useEffect(() => {
        getReviews()
            .then((res) => {
                const filtered = res.data.filter(r => r.room?.id === room.id);
                setReviews(filtered);
            })
            .catch((err) => console.error("Помилка завантаження відгуків:", err));
    }, [room.id]);

    // 🧮 Середня оцінка
    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : "—";

    // 🖼️ Зображення номеру
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

    // 📝 Опис номеру
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

    // 🪙 Перехід до бронювання
    const handleBook = (e) => {
        e.stopPropagation();
        navigate(`/booking?roomId=${room.id}`);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("Спочатку увійдіть у систему, щоб залишити відгук.");
            return;
        }

        try {
            const newReview = {
                rating: parseInt(rating),
                comment,
                room: { id: room.id },
                customer: { id: user.id },
            };
            await createReview(newReview);
            setRating("");
            setComment("");
            const updated = await getReviews();
            setReviews(updated.data.filter(r => r.room?.id === room.id));
            alert("✅ Відгук успішно додано!");
        } catch (err) {
            console.error("Помилка створення відгуку:", err);
        }
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
                <p className="room-description">{getRoomDescription(room.type)}</p>
                <p className="room-price">
                    <strong>Ціна:</strong> {room.price}₴ / ніч
                </p>
                <p>⭐ <b>Рейтинг:</b> {avgRating} / 5</p>

                <button className="book-btn" onClick={handleBook}>
                    Забронювати
                </button>

                {/* ✨ Форма для відгуку */}
                {isAuthenticated && (
                    <form className="review-form" onSubmit={handleSubmitReview}>
                        <h4>Залишити відгук</h4>
                        <label>
                            Оцінка:
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                required
                            >
                                <option value="">—</option>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <textarea
                            placeholder="Ваш коментар..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit">Надіслати</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RoomCard;
