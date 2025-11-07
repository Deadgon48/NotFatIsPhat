// src/services/PlanService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

class PlanService {

    async _handleFetchResponse(response) {
        const data = await response.json().catch(() => ({ ok: false }));
        if (!response.ok || data.ok === false) {
            throw new Error(data.error || `Error (${response.status})`);
        }
        return data;
    }

    /**
     * Cargar catálogo de alimentos desde MySQL
     * GET /api/foods
     * Devuelve: [{ id, name, kcal }]
     */
    async cargarCatalogoAlimentos() {
        const response = await fetch(`${API_BASE_URL}/foods`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const data = await this._handleFetchResponse(response);
        return data.foods; // ← Lista de alimentos
    }

    /**
     * Guardar un plan (sin enviar plan_id)
     * POST /api/planes
     */
    async guardarPlan(plan) {

        const response = await fetch(`${API_BASE_URL}/planes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                nombre: plan.nombre,
                description: plan.description,
                detalles: plan.detalle // ← SIN plan_id
            })
        });

        const data = await this._handleFetchResponse(response);
        return data; // ← ID autogenerado en MySQL
    }

    /**
     * Cargar planes existentes y mapear alimentos
     * GET /api/planes
     */
    async cargarPlantillas(alimentos) {
        if (!alimentos || alimentos.length === 0) {
            throw new Error("El catálogo de alimentos es requerido para cargar plantillas.");
        }

        const mapaAlimentos = new Map(alimentos.map(a => [a.id, a]));

        const response = await fetch(`${API_BASE_URL}/planes`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const data = await this._handleFetchResponse(response);

        return data.planes.map(plan => ({
            id: plan.id,
            nombre: plan.nombre,
            description: plan.description, // <-- AQUÍ YA SE CORRIGE

            detalle: (plan.detalle || []).map(d => ({
                dia: d.dia,
                comida: d.comida,
                alimento_id: d.alimento_id,
                porcion: d.porcion,

                // ✅ Nombre del alimento
                food_name: d.food_name || mapaAlimentos.get(d.alimento_id)?.name || "Alimento Desconocido",

                // ✅ Kcal del alimento
                food_kcal: d.food_kcal ?? (mapaAlimentos.get(d.alimento_id)?.kcal ?? 0)
            }))

    }));

    }

    // asignar pacientes del nutriologo
    async asignarPlan(patient_id, plan_id) {
        const resp = await fetch(`${API_BASE_URL}/planes/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ patient_id, plan_id })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || 'Error al asignar plan');
        return data;
    }
}

export const planService = new PlanService();
