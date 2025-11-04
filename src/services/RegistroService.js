
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
class RegistroService {

    async registerUser(user) {

        const payload = user.toJSON();
        console.log("Enviando datos de registro a:", `${API_BASE_URL}/auth/register`);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor.' }));
                throw new Error(errorData.error || `Fallo el registro. Código: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error durante el registro:', error);
            throw error;
        }
    }
}

export const registroService = new RegistroService();