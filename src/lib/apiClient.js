const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:8080").replace(/\/$/, "");

export function getStoredUser() {
    try {
        const rawLocal = window.localStorage.getItem("user");
        if (rawLocal) return JSON.parse(rawLocal);
        const rawSession = window.sessionStorage.getItem("user");
        if (rawSession) return JSON.parse(rawSession);
        return null;
    } catch {
        return null;
    }
}

export function getAuthToken() {
    const u = getStoredUser();
    return u?.token || null;
}

async function readError(res) {
    const text = await res.text();
    try {
        const j = text ? JSON.parse(text) : null;
        if (j && typeof j === "object") return j.message || j.error || JSON.stringify(j);
        return text || `HTTP ${res.status}`;
    } catch {
        return text || `HTTP ${res.status}`;
    }
}

export async function apiFetch(path, options = {}) {
    const token = getAuthToken();
    const headers = { ...(options.headers || {}) };

    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) throw new Error(await readError(res));
    if (res.status === 204) return null;

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    return res.text();
}

export { API_BASE };
