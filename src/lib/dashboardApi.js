import { apiFetch } from "./apiClient";

export async function fetchGirlDashboard() {
    return apiFetch("/api/girl/dashboard");
}

export async function postGeneralFeedback(payload) {
    return apiFetch("/api/public/feedback/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function postMentoratFeedback(payload) {
    return apiFetch("/api/public/feedback/mentorat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function fetchConversationMessages(conversationId) {
    return apiFetch(`/api/messaging/conversations/${encodeURIComponent(conversationId)}/messages`);
}

export async function sendConversationMessage(conversationId, content, senderId, senderName) {
    return apiFetch(`/api/messaging/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, senderId, senderName }),
    });
}
