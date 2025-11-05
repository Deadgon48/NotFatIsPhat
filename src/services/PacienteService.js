/**
 * ---------------------------------------------------------------
 * 🚚 SERVICIO DE PACIENTES (PacienteService)
 * ---------------------------------------------------------------
 * Puente entre tus componentes Vue y la API (Node/Express).
 * Maneja llamadas HTTP y devuelve datos/errores.
 * ---------------------------------------------------------------
 */

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Pequeño helper para construir URLs con query params
function buildUrl(path, params = {}) {
    const url = new URL(`${API_BASE_URL}${path}`);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
    return url.toString();
}

class PacienteService {
    // ===== Helpers internos =====
    async _request(input, init = {}) {
        const resp = await fetch(input, {
            credentials: 'include', // CLAVE: cookie de sesión
            headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
            ...init,
        });

        // Intenta parsear JSON incluso en error
        let data = null;
        try {
            data = await resp.json();
        } catch {
            /* noop */
        }

        if (!resp.ok) {
            const msg =
                (data && (data.error || data.message)) ||
                (resp.status === 401
                    ? 'UNAUTHORIZED'
                    : `HTTP ${resp.status}: ${resp.statusText}`);
            throw new Error(msg);
        }
        return data;
    }

    /**
     * ---------------------------------------------------------------
     * 1) Mis Pacientes (asignados al nutriólogo actual)
     * GET /api/pacientes/mis-pacientes?q=&limit=&offset=
     * ---------------------------------------------------------------
     */
    async getNutriologoPatients(q = '', limit = 20, offset = 0) {
        const url = buildUrl('/pacientes/mis-pacientes', { q, limit, offset });
        return this._request(url, { method: 'GET' });
    }

    /**
     * ---------------------------------------------------------------
     * 2) Buscar pacientes en TODO el sistema (para asignar)
     * GET /api/pacientes/buscar?q=&limit=&offset=
     * ---------------------------------------------------------------
     */
    async searchPatients(q = '', limit = 20, offset = 0) {
        const url = buildUrl('/pacientes/buscar', { q, limit, offset });
        return this._request(url, { method: 'GET' });
    }

    /**
     * ---------------------------------------------------------------
     * 3) Asignar paciente existente a “Mis Pacientes”
     * POST /api/pacientes/asignar  { patient_id }
     * ---------------------------------------------------------------
     */
    async assignPatient(patientId) {
        return this._request(`${API_BASE_URL}/pacientes/asignar`, {
            method: 'POST',
            body: JSON.stringify({ patient_id: patientId }),
        });
    }

    /**
     * ---------------------------------------------------------------
     * 4) Detalle de un paciente (solo si te pertenece)
     * GET /api/pacientes/:id
     * ---------------------------------------------------------------
     */
    async getPatientById(patientId) {
        return this._request(`${API_BASE_URL}/pacientes/${patientId}`, {
            method: 'GET',
        });
    }

    /**
     * ---------------------------------------------------------------
     * 5) Crear paciente nuevo y asignarlo al nutriólogo actual
     * POST /api/pacientes/crear  {...patientData}
     * ---------------------------------------------------------------
     */
    async createPatient(patientData) {
        return this._request(`${API_BASE_URL}/pacientes/crear`, {
            method: 'POST',
            body: JSON.stringify(patientData),
        });
    }

    // =========================================================
    // 👇 MÉTODO QUE SE HABÍA PERDIDO Y FUE AÑADIDO (6) 👇
    // =========================================================

    /**
     * ---------------------------------------------------------------
     * 6) Obtener datos del dashboard del PACIENTE actual
     * GET /api/paciente/mi-dashboard
     * ---------------------------------------------------------------
     */
    async getMiDashboard() {
        // Usamos la ruta 'singular' (/paciente) que creamos para el paciente,
        // a diferencia de las rutas 'plural' (/pacientes) del nutriólogo.
        return this._request(`${API_BASE_URL}/paciente/mi-dashboard`, {
            method: 'GET',
        });
    }
} // Cierre de la clase PacienteService

// Exporta como singleton (y default por conveniencia)
export const pacienteService = new PacienteService();
export default pacienteService;