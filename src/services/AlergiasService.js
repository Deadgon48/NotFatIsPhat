const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
class AlergiasService{

    async getAlergias() {

        console.log("Enviando datos de registro a:", `${API_BASE_URL}/alergias/get-alergias`);

        try {
            const response = await fetch(`${API_BASE_URL}/alergias/get-alergias`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor.' }));
                throw new Error(errorData.message || `Fallo el registro. Código: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error durante el registro:', error);
            throw error;
        }
    }
}

export const alergiasService = new AlergiasService();