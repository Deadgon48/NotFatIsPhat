<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Buscar Alimentos</h3>
      <div class="modal-content">

        <!-- 🔥 NUEVO: Selección dinámica de número de comidas -->
        <label>Número de comidas por día:</label>
        <input
            type="number"
            min="1"
            max="30"
            v-model.number="numComidas"
            @input="actualizarComidas"
            placeholder="Ej: 5"
        />

        <input type="text" v-model="filtro" placeholder="Buscar alimento">

        <div class="form-group-inline">
          <select v-model="diaSeleccionado">
            <option value="">Selecciona Día</option>
            <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
          </select>

          <select v-model="comidaSeleccionada">
            <option value="">Selecciona Comida</option>
            <option v-for="comida in comidasFijas" :key="comida" :value="comida">{{ comida }}</option>
          </select>
        </div>

        <div id="resultados_alimentos" class="resultados-list">
          <p v-if="!catalogo.length && !error" class="loading-message">Cargando catálogo de alimentos...</p>
          <p v-if="error" class="error-message">{{ error }}</p>


          <div v-for="alimento in resultadosFiltrados" :key="alimento.id" class="alimento-card">
            <span>{{ alimento.name }} ({{ alimento.kcal }} kcal / 100g)</span>
            <div class="accion-alimento">
              <input type="number" placeholder="g" min="1" step="1" v-model.number="porcionData[alimento.id]">
              <button @click="agregarAlimento(alimento)" :disabled="!isReadyToAdd(alimento.id)">
                Agregar
              </button>
            </div>
          </div>

        </div>
      </div>
      <button @click="$emit('cerrar')" class="close-button">Cerrar</button>
    </div>
  </div>
</template>

<script>
import { planService } from '@/services/PlanService';

export default {
  data() {
    return {
      catalogo: [],
      comidasFijas: [],
      numComidas: 5, // ← cantidad por defecto editable por el nutriólogo
      error: null,

      filtro: '',
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      diaSeleccionado: '',
      comidaSeleccionada: '',
      porcionData: {},
    };
  },

  async created() {
    try {
      const foods = await planService.cargarCatalogoAlimentos();
      if (Array.isArray(foods)) this.catalogo = foods;
      else throw new Error("Formato inesperado");

      this.actualizarComidas(); // ← genera la lista inicial
    } catch (err) {
      this.error = "No se pudo cargar el catálogo de alimentos.";
    }
  },

  computed: {
    resultadosFiltrados() {
      if (!this.filtro) return this.catalogo;
      const f = this.filtro.toLowerCase();
      return this.catalogo.filter(a => a.name.toLowerCase().includes(f));
    }
  },

  methods: {
    actualizarComidas() {
      this.comidasFijas = Array.from({ length: this.numComidas }, (_, i) => `Comida ${i + 1}`);
    },

    isReadyToAdd(id) {
      return this.diaSeleccionado && this.comidaSeleccionada && this.porcionData[id] > 0;
    },

    agregarAlimento(alimento) {
      this.$emit('agregar', {
        alimento,
        dia: this.diaSeleccionado,
        comida: this.comidaSeleccionada,
        porcion: this.porcionData[alimento.id]
      });

      this.diaSeleccionado = '';
      this.comidaSeleccionada = '';
      this.porcionData[alimento.id] = null;
    }
  }
};
</script>

<style scoped>
/* estilos idénticos a los tuyos */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  /* Fondo del modal, se adapta al tema */
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 25px 35px;
  width: 90%;
  max-width: 550px;
  /* Sombra del modal, se adapta al tema */
  box-shadow: 0 10px 30px var(--vt-c-black);
  display: flex;
  flex-direction: column;
}

.modal h3 {
  color: var(--nfip-c-green-health);
  border-bottom: 2px solid var(--color-border-hover); /* Borde que se adapta */
  padding-bottom: 10px;
}

/* --- Elementos de Interfaz (Inputs y Selects) --- */
input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  /* El borde y fondo cambian en modo oscuro */
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 6px;
}
/* Placeholder visible en modo oscuro */
input::placeholder {
  color: var(--color-text-mute);
}

.form-group-inline {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.form-group-inline select {
  flex-grow: 1;
}

.resultados-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

.alimento-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background: var(--color-background-mute);
  border: 1px solid #eee;
  border-radius: 1px solid var(--color-border);
  font-size: 0.95rem;
}

.accion-alimento {
  display: flex;
  gap: 8px;
  align-items: center;
}

.accion-alimento input {
  width: 60px;
  text-align: right;
  padding: 5px;
  margin: 0;
}

.alimento-card span {
  color: var(--color-text);
}

.accion-alimento button {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.accion-alimento button:disabled {
  background-color: var(--color-border-hover); /* Fondo de botón deshabilitado */
  color: var(--color-text-mute);
  cursor: not-allowed;
}

.close-button {
  margin-top: 20px;
  background-color: var(--nfip-c-orange-energy);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}
.close-button:hover {
  background-color: var(--nfip-c-orange-soft);
}

/* 📱 Responsividad - Mantener tus media queries existentes */
@media (max-width: 600px) {
  .modal {
    padding: 15px;
  }
}

</style>
