import React, { useState } from "react";
import { createPayment } from "../api/api";

export default function PaymentModal({ booking, onClose }) {
    const [method, setMethod] = useState("CARD");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!booking) return null;

    const getNights = (checkIn, checkOut) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);

        const diff = outDate.getTime() - inDate.getTime();
        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

        return nights > 0 ? nights : 1;
    };

    const nights = getNights(booking.checkIn, booking.checkOut);
    const totalAmount = nights * (booking.room?.price || 0);

    const handlePayment = async () => {
        setLoading(true);
        setMessage("");

        const paymentData = {
            booking: { id: booking.id },
            amount: totalAmount,
            date: new Date().toISOString(),
            method,
        };

        try {
            await createPayment(paymentData);
            setMessage("Оплату виконано успішно!");
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error("Помилка оплати:", err);
            setMessage("Не вдалося виконати оплату");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Оплата бронювання</h2>

                <p>
                    Номер: <b>{booking.room?.type}</b><br />
                    Кількість ночей: <b>{nights}</b><br />
                    Сума до оплати: <b>{totalAmount}₴</b>
                </p>

                <label>
                    Спосіб оплати:
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        disabled={loading}
                    >
                        <option value="CARD">Картка</option>
                        <option value="CASH">Готівка</option>
                    </select>
                </label>

                {message && <p className="payment-message">{message}</p>}

                <div className="modal-actions">
                    <button onClick={handlePayment} disabled={loading}>
                        {loading ? "Обробка..." : "Оплатити"}
                    </button>
                    <button onClick={onClose} className="cancel">
                        Відмінити
                    </button>
                </div>
            </div>
        </div>
    );
}
