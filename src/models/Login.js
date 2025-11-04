// src/models/Login.js

export class Login {
    // 1. MEJORA: Propiedades necesarias para el login
    email = '';
    password = '';

    // Almacén de errores (ViewModel)
    errors = {};

    // 🔨 Constructor
    constructor(data = {}) {
        // Inicializa la clase con datos parciales recibidos, si los hay
        Object.assign(this, data);
        this.errors = {};
    }

    /**
     * Valida el modelo para el inicio de sesión.
     * @returns {boolean} - True si es válido, False si hay errores.
     */
    isValid() {
        this.errors = {};
        let valid = true;

        // --- VALIDACIÓN DE EMAIL ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || this.email.trim() === '') {
            this.errors.email = 'El correo electrónico es obligatorio.';
            valid = false;
        } else if (!emailRegex.test(this.email)) {
            this.errors.email = 'El formato del correo electrónico no es válido.';
            valid = false;
        }

        // --- VALIDACIÓN DE PASSWORD ---
        if (!this.password || this.password.trim() === '') {
            this.errors.password = 'La contraseña es obligatoria.';
            valid = false;
        }

        // NOTA: La validación de complejidad/longitud de la contraseña
        // no se hace en el login por razones de UX. Solo se verifica que no esté vacía.

        return valid;
    }

    /**
     * Prepara el objeto para ser enviado a la API.
     * Mapea los nombres del frontend a los que espera el backend.
     */
    toJSON() {
        // Objeto base con los datos que espera tu API para el LOGIN
        const payload = {
            email: this.email,
            password: this.password,
            // Nota: Aquí no se incluyen campos como first_name o role_name.
        };

        return payload;
    }
}