import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const http = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function login({ email, password }) {
    return axios.post(`${API_BASE}/auth/login`, { email, password });
}

export async function getProfile(){
    const res = await http.get("/profile");
    return res.data;
}

export async function getRooms() {
    const res = await http.get("/rooms");
    return res.data;
}


export async function getBookings() {
    const res = await http.get("/bookings");
    return res.data;
}

export async function createBooking(booking) {
    const res = await http.post("/bookings", booking);
    return res.data;
}

export async function updateBooking(id, updatedData) {
    try {
        const res = await axios.put(`${API_BASE}/bookings/${id}`, updatedData);
        return res.data;
    } catch (err) {
        console.error("Помилка при оновленні бронювання:", err);
        throw err;
    }
}

export const createPayment = async (payment) => {
    const res = await axios.post(`${API_BASE}/payments`, payment);
    return res.data;
};

export const getReviews = () => axios.get(`${API_BASE}/reviews`);
export const getReviewsByRoom = (roomId) => axios.get(`${API_BASE}/reviews?roomId=${roomId}`);
export const createReview = (review) => axios.post(`${API_BASE}/reviews`, review);
export const deleteReview = (id) => axios.delete(`${API_BASE}/reviews/${id}`);

export async function getStatisticsOverview() {
    const res = await axios.get(`${API_BASE}/statistics/overview`);
    return res.data;
}

// 🔹 Доходи по місяцях
export async function getMonthlyRevenue() {
    const res = await axios.get(`${API_BASE}/statistics/revenue/monthly`);
    return res.data;
}

// 🔹 Популярні типи кімнат
export async function getPopularRooms() {
    const res = await axios.get(`${API_BASE}/statistics/rooms/popular`);
    return res.data;
}

// 🔹 Топ кімнати за рейтингом
export async function getTopRatedRooms() {
    const res = await axios.get(`${API_BASE}/statistics/rooms/top-rated`);
    return res.data;
}

// 🔹 Доходи за типом оплати
export async function getRevenueByPaymentMethod() {
    const res = await axios.get(`${API_BASE}/statistics/revenue/methods`);
    return res.data;
}

export async function getOverview() {
    const res = await fetch("http://localhost:8080/api/statistics/overview");
    if (!res.ok) throw new Error("Не вдалося завантажити аналітику");
    return res.json();
}
