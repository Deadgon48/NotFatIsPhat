// src/services/AdminService.js

// 🌐 URL Base: Usa la misma variable de entorno que definiste
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Servicio para manejar las operaciones del panel de administración (GP-05).
 * Todas estas rutas requieren autenticación de administrador y envían credenciales (cookies).
 */
class AdminService {

    /**
     * (GP-05) Obtiene la lista completa de usuarios (Pacientes y Nutriólogos)
     * Llama a: GET /api/admin/users
     * @returns {Promise<Array>} - Una lista de usuarios
     */
    async getAllUsers() {
        console.log("AdminService: Obteniendo todos los usuarios...");

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // <- ¡MUY IMPORTANTE! Envía la cookie de sesión
            });

            const data = await response.json();

            if (!response.ok) {
                // Error 401 (No autenticado) o 403 (No admin)
                throw new Error(data.error || `Error ${response.status}`);
            }

            return data.users; // Devuelve el array de usuarios

        } catch (error) {
            console.error('Error en getAllUsers:', error);
            throw error; // Propagar el error a la vista
        }
    }

    /**
     * (GP-05) Actualiza la información de un usuario específico.
     * Llama a: PUT /api/admin/users/:id
     * @param {number} id - El ID del usuario a modificar
     * @param {object} userData - Objeto con { first_name, last_name, email, role }
     * @returns {Promise<Object>} - Mensaje de éxito
     */
    async updateUser(id, userData) {
        console.log(`AdminService: Actualizando usuario ${id}...`);

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // <- Envía la cookie de sesión
                body: JSON.stringify(userData) // Envía los datos del formulario
            });

            const data = await response.json();

            if (!response.ok) {
                // Error 400 (Validación), 409 (Email duplicado), etc.
                throw new Error(data.error || `Error ${response.status}`);
            }

            return data; // Devuelve el mensaje de éxito

        } catch (error) {
            console.error(`Error en updateUser ${id}:`, error);
            throw error;
        }
    }

    /**
     * (GP-05) Elimina un usuario específico.
     * Llama a: DELETE /api/admin/users/:id
     * @param {number} id - El ID del usuario a eliminar
     * @returns {Promise<Object>} - Mensaje de éxito
     */
    async deleteUser(id) {
        console.log(`AdminService: Eliminando usuario ${id}...`);

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // <- Envía la cookie de sesión
            });

            const data = await response.json();

            if (!response.ok) {
                // Error 404 (No encontrado), 409 (Conflicto FK)
                throw new Error(data.error || `Error ${response.status}`);
            }

            return data; // Devuelve el mensaje de éxito

        } catch (error) {
            console.error(`Error en deleteUser ${id}:`, error);
            throw error;
        }
    }
}

// 📦 Exportamos una instancia única (Singleton) para usar en toda la app
export const adminService = new AdminService();