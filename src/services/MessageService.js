// src/services/MessageService.js

// Reutilizamos el mismo patrón que en PlanService, PacienteService, etc.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

async function handleFetchResponse(response) {
  const data = await response.json().catch(() => ({ ok: false }));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || `Error (${response.status})`);
  }
  return data;
}

export const messageService = {
  // Enviar mensaje a uno o varios pacientes
  async sendMessage({ recipients, subject, body }) {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipients, subject, body }),
    });

    const data = await handleFetchResponse(response);
    // la API retorna { ok: true, message_id: ... }
    return data;
  },

  // Mensajes enviados por el nutriólogo
  async getSent() {
    const response = await fetch(`${API_BASE_URL}/messages/sent`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await handleFetchResponse(response);
    return data.messages || [];
  },

  // Bandeja de entrada del usuario actual
  async getInbox() {
    const response = await fetch(`${API_BASE_URL}/messages/inbox`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await handleFetchResponse(response);
    return data.messages || [];
  },

  // Marcar mensaje como leído
  async markAsRead(recipientMessageId) {
    const response = await fetch(
      `${API_BASE_URL}/messages/${recipientMessageId}/read`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    await handleFetchResponse(response);
  },
};
