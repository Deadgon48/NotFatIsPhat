<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Asignar Plan (ID: {{ planId }})</h3>
      <input type="text" v-model="filtro" @input="buscarPacientes" placeholder="Buscar paciente">

      <div v-if="loading">Cargando pacientes...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div v-else>
        <div v-for="paciente in resultados" :key="paciente.id" class="paciente-card">
          <span>{{ paciente.first_name }} {{ paciente.last_name }}</span>
          <button @click="asignarPlan(paciente.id)" :disabled="asignando">
            {{ asignando ? 'Asignando...' : 'Asignar Plan' }}
          </button>
        </div>
        <p v-if="!resultados.length">No se encontraron pacientes</p>
      </div>

      <button @click="$emit('cerrar')">Cerrar</button>
    </div>
  </div>
</template>

<script>
import { planService } from '@/services/PlanService';
import { pacienteService } from '@/services/PacienteService';

export default {
  props: { planId: { type: Number, required: true } },
  data() {
    return {
      filtro: '',
      pacientes: [],
      loading: false,
      asignando: false,
      error: null,
    };
  },
  computed: {
    resultados() {
      const list = Array.isArray(this.pacientes) ? this.pacientes : [];
      const f = this.filtro.toLowerCase();
      return list.filter(p => (`${p.first_name} ${p.last_name}`).toLowerCase().includes(f));
    }
  },
  mounted() {
    this.buscarPacientes();
  },

  methods: {
    async buscarPacientes() {
      this.loading = true;
      this.error = null;
      try {
        const resp = await pacienteService.getNutriologoPatients(this.filtro);
        this.pacientes = Array.isArray(resp.items) ? resp.items : [];
      } catch (err) {
        this.error = 'Error al cargar pacientes.';
        this.pacientes = [];
        console.error(err);
      } finally { this.loading = false; }
    },

    async asignarPlan(patient_id) {
      this.asignando = true;
      this.error = null;
      try {
        await planService.asignarPlan(patient_id, this.planId);
        alert(`Plan asignado al paciente ${patient_id}`);
        this.$emit('asignado');
      } catch (err) {
        alert(`Fallo la asignación: ${err.message}`);
        this.error = err.message;
        console.error(err);
      } finally { this.asignando = false; }
    }
  }
};
</script>


<style scoped>

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
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid var(--color-border-hover);
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
  background-color: var(--color-background-mute);
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

.paciente-card {
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

.paciente-card:hover {
  background-color: var(--color-background-soft);
}

/* 🔹 Botón de asignar */
.paciente-card button {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.25s, transform 0.15s;
}

.paciente-card button:hover:not(:disabled) {
  background-color: var(--nfip-c-green-dark);
  color: var(--vt-c-white);
}

.paciente-card button:disabled {
  background-color: var(--vt-c-divider-light-2);
  color: var(--color-text-mute);
}

/* 📱 Responsividad */
@media (max-width: 900px) {
  /* En pantallas medianas (tablets), el grid se ajustará automáticamente gracias a auto-fit */
  .modal{
    font-size: 2rem;
  }
  .paciente-card{
    gap: 15px;
  }
}

@media (max-width: 600px) {
  .modal {
    padding: 1rem;
  }
  .paciente-card{
    gap: 15px;
  }
}

</style>