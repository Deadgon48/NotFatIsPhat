// En: src/stores/authStore.js

import { defineStore } from 'pinia'

// Define el store
export const useAuthStore = defineStore('auth', {

  // 1. STATE (Los datos en la mochila)
  state: () => ({
    isLoggedIn: false,
    // Aquí guardaremos algo como:
    // { id: 1, name: 'Eruvey', role: 'Nutriologo' }
    user: null,
  }),

  // 2. GETTERS (Datos calculados)
  //    Estos son como 'computed properties' para tu store
  getters: {
    userRole: (state) => state.user?.role || null,
  },

  // 3. ACTIONS (Las funciones que modifican el state)
  actions: {

    /**
     * Se llama desde LoginView.vue al tener éxito
     * @param {object} userData - Los datos del usuario desde la API
     */
    login(userData) {
      this.isLoggedIn = true;
      this.user = userData;

      // Opcional: persistir info básica en localStorage
      // (no truena si nunca se lee, pero ayuda a evitar estados raros)
      try {
        localStorage.setItem('authUser', JSON.stringify(userData));
      } catch (_) {
        // ignorar errores de almacenamiento
      }
    },

    /**
     * Se llama desde el botón de "Cerrar Sesión"
     */
    logout() {
      // Limpia el estado de Pinia
      this.isLoggedIn = false;
      this.user = null;

      // Limpia también cualquier rastro en almacenamiento local
      try {
        localStorage.removeItem('authUser');
      } catch (_) {
        // ignorar errores de almacenamiento
      }
    }
  }
})
