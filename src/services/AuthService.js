// src/services/AuthService.js

// Importamos el modelo necesario para el login (asumimos que está en el directorio correcto)
import { Login } from '@/models/Login';

// 🌐 URL Base: Usa la misma variable de entorno que definiste
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AuthService {
  // LMAOOO ASI SE COMENTA BIEEEN CHIDOOO

  /**
   * Maneja la petición de inicio de sesión.
   * @param {Login|Object} data - Instancia del modelo Login o un objeto { email, password }.
   * @returns {Promise<Object>} - Datos del usuario ({ ok, user }) o error.
   */
  async login(data) {
    const payload =
      data instanceof Login && typeof data.toJSON === 'function'
        ? data.toJSON()
        : data; // fallback si te pasan un objeto plano

    console.log('Intentando iniciar sesión en:', `${API_BASE_URL}/auth/login`);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ← CLAVE: aceptar y enviar cookies entre 5173 ↔ 3001
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Manejo de errores 4xx o 5xx
        throw new Error(json.error || `Fallo el inicio de sesión. Código: ${response.status}`);
      }

      return json; // { ok:true, user:{...} }
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error; // Propagar el error al ViewModel
    }
  }

  /**
   * Verifica si hay sesión activa (útil en montajes).
   * @returns {Promise<Object>} - { ok:true, user:{...} } si hay sesión.
   */
  async session() {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      method: 'GET',
      credentials: 'include', // ← envía cookie
    });
    return res.json();
  }

  /**
   * Cierra sesión y limpia la cookie en el backend.
   */
  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // ← envía cookie para destruir sesión
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Error al cerrar sesión (${res.status})`);
    return json;
  }

  /**
   * Maneja la solicitud de recuperación de contraseña.
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<Object>} - Mensaje de éxito/estado.
   */
  async requestPasswordRecovery(email) {
    const payload = { email };
    console.log('Solicitando recuperación para:', email);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // no es estrictamente necesario, pero consistente
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error || `Error al solicitar recuperación. Código: ${response.status}`);
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
