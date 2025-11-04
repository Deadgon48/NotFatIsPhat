// src/services/AuthService.js

// Importamos el modelo necesario para el login (asumimos que está en el directorio correcto)
import { Login } from '@/models/Login';

// 🌐 URL Base: Usa la misma variable de entorno que definiste
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AuthService {
//LMAOOO ASI SE COMENTA BIEEEN CHIDOOO
    /**
     * Maneja la petición de inicio de sesión.
     * @param {Login} data - Instancia del modelo LoginData.
     * @returns {Promise<Object>} - Datos del usuario o token.
     */
    async login(data) {
        const payload = data.toJSON();
        console.log("Intentando iniciar sesión en:", `${API_BASE_URL}/auth/login`);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Manejo de errores 4xx o 5xx
                const errorData = await response.json().catch(() => ({ error: 'Credenciales inválidas o error de red.' }));
                throw new Error(errorData.error || `Fallo el inicio de sesión. Código: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error durante el login:', error);
            throw error; // Propagar el error al ViewModel
        }
    }

    /**
     * Maneja la solicitud de recuperación de contraseña.
     * @param {string} email - El correo electrónico del usuario.
     * @returns {Promise<Object>} - Mensaje de éxito/estado.
     */
    async requestPasswordRecovery(email) {
        const payload = { email }; // Objeto JSON simple
        console.log("Solicitando recuperación para:", email);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, { // Ajusta el endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'El email no fue encontrado o hubo un error del servidor.' }));
                throw new Error(errorData.error || `Error al solicitar recuperación. Código: ${response.status}`);
            }

            return { message: 'Enlace de recuperación enviado.' };
        } catch (error) {
            console.error('Error en la solicitud de recuperación:', error);
            throw error;
        }
    }
}

// 📦 Exportamos una instancia única (Singleton) para usar en toda la app
export const authService = new AuthService();