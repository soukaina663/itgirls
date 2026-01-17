// src/lib/authService.js
import { apiFetch } from "./apiClient";

function storeUser(data, remember) {
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem("user", JSON.stringify(data));
}

export async function loginWithEmail(email, password, remember = false) {
    const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: {
            email: (email || "").trim().toLowerCase(),
            password: password || "",
        },
    });

    storeUser(data, remember);
    return data;
}

export async function registerWithEmail(payload) {
    const isExpert = payload.role === "expert";

    const body = {
        name: `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
        email: (payload.email || "").trim().toLowerCase(),
        password: payload.password || "",
        role: isExpert ? "EXPERT" : "GIRL",

        // GIRL
        level: !isExpert ? (payload.educationLevel || "lyceenne") : null,

        // EXPERT
        profession: isExpert ? (payload.profession || payload.parcours || "") : null,
        isMentor: isExpert ? !!payload.isMentor : false,
        cvFile: isExpert ? (payload.cvFileName || "") : null,
    };

    const data = await apiFetch("/api/auth/register", { method: "POST", body });

    // register => on garde en localStorage
    window.localStorage.setItem("user", JSON.stringify(data));
    return data;
}

export function logout() {
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("user");
}
