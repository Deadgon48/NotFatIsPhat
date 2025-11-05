// En: src/stores/authStore.js

import { defineStore } from 'pinia'

// Define el store
export const useAuthStore = defineStore('auth', {

    // 1. STATE (Los datos en la mochila)
    state: () => ({
        isLoggedIn: false,
        user: null, // Aquí guardaremos { id: 1, name: 'Eruvey', role: 'Nutriologo' }
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
            // Pinia guardará esto
        },

        /**
         * Se llama desde el botón de "Cerrar Sesión"
         */
        logout() {
            this.isLoggedIn = false;
            this.user = null;
            // Limpia la mochila
        }
    }
})