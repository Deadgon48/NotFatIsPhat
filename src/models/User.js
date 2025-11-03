

export class User {

    primerNombre = '';
    apellido = '';
    email = '';
    password = '';
    rol = '';

    errors = {};

    // 🔨 Constructor
    constructor(data = {}) {
        Object.assign(this, data);
        this.errors = {};
    }

     isValid() {
        this.errors = {};
        let valid = true;

        if (!this.primerNombre) { this.errors.primerNombre = 'El nombre es obligatorio.'; valid = false; }
        if (!this.apellido) { this.errors.apellido = 'El apellido es obligatorio.'; valid = false; }
        if (!this.rol) { this.errors.rol = 'Debe seleccionar un rol.'; valid = false; }

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            this.errors.email = 'El formato del correo electrónico no es válido.';
            valid = false;
        }

        return valid;
    }

     toJSON() {
        const { errors, ...payload } = this;
        return payload;
    }
}