const API_BASE = "http://localhost:8080/api";

export async function getRooms() {
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error("Failed to load rooms");
    return res.json();
}

export async function getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error("Failed to load bookings");
    return res.json();
}

export async function createBooking(booking) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
}
