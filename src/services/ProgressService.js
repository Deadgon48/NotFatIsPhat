// src/services/ProgressService.js
import { ApiService } from "./ApiService.js";

export const progressService = {
  /**
   * Obtiene el historial de progreso del paciente autenticado.
   * GET /api/progreso
   */
  async getMiProgreso() {
    const response = await ApiService.get("/progreso");

    // El backend responde: { ok: true, progreso: [...] }
    // Hacemos fallback por si después cambian el nombre.
    return response.progreso || response.registros || [];
  },

  /**
   * Registra un nuevo progreso del paciente autenticado.
   * POST /api/progreso
   * body: { weight, notes }
   */
  async submitMiProgreso(model) {
    const payload = {
      weight: model.weight,
      notes: model.notes,
    };

    const response = await ApiService.post("/progreso", payload);

    if (!response.ok) {
      throw new Error(response.error || "Error al guardar el progreso.");
    }

    return response;
  },
};
