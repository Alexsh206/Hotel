import React, { useState } from "react";
import { createPayment } from "../api/api";

export default function PaymentModal({ booking, onClose }) {
    const [method, setMethod] = useState("CARD");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!booking) return null;

    const handlePayment = async () => {
        setLoading(true);
        setMessage("");

        const paymentData = {
            booking: { id: booking.id }, // важливо: лише id, бо @ManyToOne
            amount: booking.room?.price || 0,
            date: new Date().toISOString(),
            method,
        };

        try {
            await createPayment(paymentData);
            setMessage("✅ Оплату виконано успішно!");
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error("Помилка оплати:", err);
            setMessage("❌ Не вдалося виконати оплату");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>💳 Оплата бронювання</h2>
                <p>
                    Номер: <b>{booking.room?.type}</b>
                    <br />
                    Сума: <b>{booking.room?.price}₴</b>
                </p>

                <label>
                    Оберіть спосіб оплати:
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
