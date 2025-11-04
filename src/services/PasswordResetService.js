// Servicio para manejar la lógica de la API de reseteo
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class PasswordResetService {

    /**
     * Verifica si un token es válido antes de mostrar el formulario.
     * La API debe responder 200 (OK) si es válido, o 404/400 si no.
     */
    async validateToken(token) {
        const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Token inválido o expirado.');
        }

        return response.json();
    }

    /**
     * Envía el token y la nueva contraseña a la API.
     */
    async resetPassword(model) {
        const payload = model.toJSON();

        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error desconocido al actualizar la contraseña.');
        }

        return data; // Devuelve el mensaje de éxito
    }
}

export const passwordResetService = new PasswordResetService();