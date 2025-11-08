import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/customers`, {
                name,
                email,
                phone,
                password,
            });

            if (res.status === 200 || res.status === 201) {
                setMessage("✅ Реєстрація успішна! Тепер увійдіть у свій акаунт.");
                setTimeout(() => nav("/login"), 1500);
            }
        } catch (err) {
            console.error("Помилка реєстрації:", err);
            setMessage("❌ Не вдалося зареєструвати користувача. Можливо, email вже існує.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">
                <h1>Реєстрація</h1>
                {message && (
                    <div
                        className="message"
                        style={{
                            color: message.includes("✅") ? "green" : "darkred",
                            fontWeight: "600",
                            marginBottom: "10px",
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Ім’я та прізвище:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label>Телефон:</label>
                        <input
                            type="tel"
                            placeholder="+380991112233"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Реєстрація..." : "Зареєструватися"}
                    </button>
                </form>

                <p className="small-text">
                    Уже маєте акаунт?{" "}
                    <span
                        onClick={() => nav("/login")}
                        style={{ color: "#006ef8", cursor: "pointer" }}
                    >
                        Увійти
                    </span>
                </p>
            </div>
        </div>
    );
}
