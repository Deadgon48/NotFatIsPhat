// src/services/AuthService.js

import { Login } from '@/models/Login';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AuthService {
  /**
   * Inicia sesión y persiste la cookie de sesión.
   * @param {Login|Object} data
   */
  async login(data) {
    const payload =
      data instanceof Login && typeof data.toJSON === 'function'
        ? data.toJSON()
        : data;

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // importante para cookies de sesión
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || `Fallo el inicio de sesión. Código: ${res.status}`);
    }
    return json; // { ok:true, user:{...} }
  }

  /** Verifica si hay sesión activa. */
  async session() {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });
    return res.json();
  }

  /** Cierra sesión en el backend. */
  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Error al cerrar sesión (${res.status})`);
    return json;
  }

  /**
   * Solicita recuperación de contraseña.
   * @param {string} email
   */
  async requestPasswordRecovery(email) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || `Error al solicitar recuperación. Código: ${res.status}`);
    }
    return { message: 'Enlace de recuperación enviado.' };
  }
}

export const authService = new AuthService();
