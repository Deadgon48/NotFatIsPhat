export class ProgressModel {
  constructor(data = {}) {
    this.weight = data.weight || null;
    this.notes = data.notes || '';
    this.date = data.date || new Date().toISOString().split('T')[0]; // Fecha automática
    this.errors = {};
  }

  /**
   * Valida que el modelo sea válido para guardar
   */
  isValid() {
    this.errors = {};

    if (!this.weight || isNaN(this.weight) || this.weight <= 0) {
      this.errors.weight = 'El peso ingresado no es válido.';
    }

    return Object.keys(this.errors).length === 0;
  }
}
