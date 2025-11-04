export class User {
    // 1. MEJORA: Inicializar valores nulos/vacíos
    primerNombre = '';
    apellido = '';
    email = '';
    password = '';
    rol = '';
    emailContacto = ''; // nutri
    telefono = '';      // nutri
    peso = null;        // paciente (mejor como null para v-model.number)
    altura = null;      // paciente (mejor como null para v-model.number)
    objetivo = '';      // paciente
    alergias = [];      // paciente
    errors = {};

    // 🔨 Constructor (Tu constructor está perfecto)
    constructor(data = {}) {
        Object.assign(this, data);
        this.errors = {};
    }

    /**
     * Valida el modelo COMPLETO basado en el rol seleccionado.
     * @returns {boolean} - True si es válido, False si hay errores.
     */
    isValid() {
        this.errors = {};
        let valid = true;

        // --- CAMPOS GENERALES ---
        if (!this.primerNombre) { this.errors.primerNombre = 'El nombre es obligatorio.'; valid = false; }
        if (!this.apellido) { this.errors.apellido = 'El apellido es obligatorio.'; valid = false; }
        if (!this.rol) { this.errors.rol = 'Debe seleccionar un rol.'; valid = false; }

        // --- VALIDACIÓN DE PASSWORD ---
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

        // --- VALIDACIÓN DE EMAIL ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            this.errors.email = 'El formato del correo electrónico no es válido.';
            valid = false;
        }

        if (this.rol === 'Nutriologo') {
            const emailContRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.emailContacto || !emailContRegex.test(this.emailContacto)) {
                this.errors.emailContacto = 'El correo de contacto no es válido.';
                valid = false;
            }

            const telefonoContRegex = /^\(\+\d{2}\) ?\d{10}$/;
            if (!this.telefono || !telefonoContRegex.test(this.telefono)) {
                this.errors.telefono = 'El formato de teléfono no es válido. Ej: (+52) 1234567890';
                valid = false;
            }
        }

        // --- CAMPOS CONDICIONALES: PACIENTE ---
        if (this.rol === 'Paciente') {
            if (!this.peso || this.peso <= 0) {
                this.errors.peso = 'El peso debe ser un número positivo.';
                valid = false;
            }
            if (!this.altura || this.altura <= 0) {
                this.errors.altura = 'La altura debe ser un número positivo.';
                valid = false;
            }
            if (!this.objetivo) {
                this.errors.objetivo = 'Debe seleccionar un objetivo.';
                valid = false;
            }
        }

        return valid;
    }

    /**
     * Prepara el objeto para ser enviado a la API,
     * mapeando los nombres del frontend (ej. 'primerNombre')
     * a los nombres que espera el backend (ej. 'first_name').
     */
    toJSON() {
        // Objeto base con los datos que espera tu API
        const payload = {
            first_name: this.primerNombre,
            last_name: this.apellido,
            email: this.email,
            password: this.password,
            role_name: this.rol,

            // Datos condicionales
            emailContacto: null,
            telefono: null,
            weight: null, // Tu JSON usa 'weight'
            height: null, // Tu JSON usa 'height'
            objetivo: null,
            alergias: []
        };

        // Rellena los datos según el rol
        if (this.rol === 'Nutriologo') {
            payload.emailContacto = this.emailContacto;
            payload.telefono = this.telefono;
        }

        if (this.rol === 'Paciente') {
            payload.weight = this.peso;
            payload.height = this.altura;
            payload.objetivo = this.objetivo;
            payload.alergias = this.alergias; // <-- 2. CORRECCIÓN: Alergias añadidas
        }

        return payload;
    }
}