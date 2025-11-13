import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/api";

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Завантаження...</div>;

    const login = async ({ email, password }) => {
        try {
            const resp = await api.login({ email, password });
            if (resp?.status === 200) {
                const { token, role, id, name, position } = resp.data;
                const profile = { id, role, name, position, email };
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(profile));

                setUser(profile);

                if (role === "customer") {
                    nav("/", { replace: true });
                } else if (role === "admin") {
                    nav(`/dashboard/admin/${id}`, { replace: true });
                } else if (role === "staff") {
                    nav(`/staff`, { replace: true });
                }
                return true;
            }
        } catch (err) {
            console.error("Login failed:", err);
        }
        return false;
    };

    // 🔹 3. Вихід
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        nav("/login", { replace: true });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
