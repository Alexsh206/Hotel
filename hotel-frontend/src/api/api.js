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


// 🔹 отримати всі бронювання
export async function getBookings() {
    const res = await http.get("/bookings");
    return res.data;
}

// 🔹 створити нове бронювання
export async function createBooking(booking) {
    const res = await http.post("/bookings", booking);
    return res.data;
}

export const createPayment = async (payment) => {
    const res = await axios.post(`${API_BASE}/payments`, payment);
    return res.data;
};
