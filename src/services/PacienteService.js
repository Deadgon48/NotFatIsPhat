/**
 * ----------------------------------------------------------------
 * 🚚 SERVICIO DE PACIENTES (PacienteService)
 * ----------------------------------------------------------------
 * Este archivo actúa como el "puente" entre tus componentes de Vue
 * (la Vista) y tu API de backend (Node/Express).
 *
 * Su única responsabilidad es manejar las peticiones HTTP (fetch)
 * y devolver los datos (o errores) a la vista.
 * ----------------------------------------------------------------
 */

// Importa la URL base de tu API desde el archivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class PacienteService {

    /**
     * ----------------------------------------------------------------
     * 1. OBTENER LOS PACIENTES DEL NUTRIÓLOGO (La función que tu vista necesita)
     * ----------------------------------------------------------------
     * Llama a la API para obtener la lista de pacientes asignados
     * al nutriólogo que está actualmente logueado.
     */
    async getNutriologoPatients() {
        // La URL final será: http://localhost:3001/api/pacientes/mis-pacientes
        const url = `${API_BASE_URL}/pacientes/mis-pacientes`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // (Otras cabeceras si fueran necesarias, como Tokens)
                },

                // ¡LA PARTE MÁS IMPORTANTE!
                // Esto envía la cookie de sesión (httpOnly) al backend,
                // permitiendo que tu API sepa qué nutriólogo está
                // haciendo la petición.
                credentials: 'include',
            });

            // Manejo de errores de la API
            if (!response.ok) {
                // Intenta leer el error que envía la API
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor.' }));
                throw new Error(errorData.error || `Error ${response.status}: No se pudo obtener la lista de pacientes.`);
            }

            // Si todo salió bien, devuelve los datos
            return response.json();

        } catch (error) {
            console.error('Error en PacienteService.getNutriologoPatients:', error);
            // Vuelve a lanzar el error para que el componente .vue (MisPacientesView)
            // lo pueda atrapar en su propio try...catch y mostrarlo al usuario.
            throw error;
        }
    }

    /**
     * ----------------------------------------------------------------
     * 2. OBTENER DETALLES DE UN PACIENTE (Para la vista de detalle)
     * ----------------------------------------------------------------
     * Tu código tiene: router.push(`/nutriologo/pacientes/${patientId}`);
     * La vista de detalle (ej. PacienteDetalleView.vue) necesitará esta
     * función para obtener los datos de un solo paciente.
     */
    async getPatientById(patientId) {
        const url = `${API_BASE_URL}/pacientes/${patientId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // También necesita saber si estás autenticado
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${response.status}: No se pudo encontrar al paciente.`);
            }

            return response.json();

        } catch (error) {
            console.error('Error en PacienteService.getPatientById:', error);
            throw error;
        }
    }

    /**
     * ----------------------------------------------------------------
     * 3. CREAR UN NUEVO PACIENTE (Para tu botón "Agregar Nuevo Paciente")
     * ----------------------------------------------------------------
     * Tu código tiene: openNewPatientModal()
     * Cuando ese modal se confirme, llamará a esta función.
     *
     * @param {object} patientData - Los datos del nuevo paciente (nombre, email, etc.)
     */
    async createPatient(patientData) {
        const url = `${API_BASE_URL}/pacientes/crear`; // O la ruta que definas

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(patientData), // Envía los datos
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${response.status}: No se pudo crear el paciente.`);
            }

            return response.json(); // Devuelve el paciente recién creado

        } catch (error) {
            console.error('Error en PacienteService.createPatient:', error);
            throw error;
        }
    }
}

// Exportamos una instancia única (Singleton) del servicio
// para que toda la aplicación use la misma conexión.
export const pacienteService = new PacienteService();