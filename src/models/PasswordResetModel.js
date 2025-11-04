// Modelo para los datos de reseteo de contraseña
export class PasswordResetModel {
    token = null;
    password = '';
    passwordConfirmation = '';
    errors = {};

    constructor(data = {}) {
        Object.assign(this, data);
        this.errors = {};
    }

    // Validación del Modelo (exigido por tu patrón)
    isValid() {
        this.errors = {};
        let valid = true;

        // Validación de complejidad (la misma que en User.js)
        if (!this.password || this.password.length < 8 || this.password.length > 12) {
            this.errors.password = 'La contraseña debe tener entre 8 y 12 caracteres.';
            valid = false;
        } else {
            const complejidadRegex = /^(?=.*[0-9])(?=.*[A-Z]).*$/;
            if (!complejidadRegex.test(this.password)) {
                this.errors.password = 'Debe contener al menos una mayúscula y un número.';
                valid = false;
            }
        }

        // Validación de confirmación
        if (this.password !== this.passwordConfirmation) {
            this.errors.passwordConfirmation = 'Las contraseñas no coinciden.';
            valid = false;
        }

        return valid;
    }

    // Preparación para la API (exigido por tu patrón)
    toJSON() {
        return {
            token: this.token,
            password: this.password,
            password_confirmation: this.passwordConfirmation,
        };
    }
}