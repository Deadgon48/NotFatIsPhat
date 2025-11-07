<template>
  <div class="dashboard-view">
    <h1 class="page-heading">
      <span class="green-text">Creador de planes</span>
    </h1>

    <div class="card-container">
      <input type="text" id="nombre_plan" v-model="plan.nombre" placeholder="Nombre del Plan">
      <textarea id="descripcion_plan" v-model="plan.description" placeholder="Descripción"></textarea>

      <p v-if="plan.id" class="plan-id-info">Plan ID: {{ plan.id }} ({{ plan.nombre }})</p>

      <div class="plan-actions">
        <button @click="cargarPlantillas" class="button-secondary">Cargar Plantillas</button>
        <button @click="abrirModal('alimentos')" class="button-cta">Agregar Alimento</button>
        <button @click="guardarPlan" class="button-cta">Guardar Plan</button>
        <button @click="abrirModal('paciente')" class="button-secondary" :disabled="!plan.id">Asignar a Paciente</button>
      </div>

      <div id="plantillas_listado" class="listado-plantillas">
        <div v-for="plantilla in plantillas" :key="plantilla.id" class="alimento-card">
          <strong>{{ plantilla.nombre }}</strong> - {{ plantilla.description }}
          <button @click="usarPlantilla(plantilla)" class="button-cta-mini">Usar Plan</button>
        </div>
        <p v-if="!plantillas.length && !cargandoPlantillas">No hay plantillas disponibles.</p>
      </div>

      <div id="calendario-lista">
        <div v-for="dia in diasSemana" :key="dia" class="dia-lista">
          <h4>{{ dia }}</h4>
          <ul>
            <li v-for="(item, index) in plan.detalle.filter(d => d.dia === dia)" :key="index" class="alimento-item">
              <strong>{{ item.comida }}:</strong> Alimento: {{ item.nombre }} Calorias: {{ item.kcal }}cal Porción: {{ item.porcion }}g
              <button class="delete-item" @click="eliminarDetalle(dia, index)">❌</button>
            </li>
            <li v-if="plan.detalle.filter(d => d.dia === dia).length === 0" style="font-size:0.85rem; color:#777;">
              Vacío
            </li>
          </ul>
        </div>
      </div>


      <div id="mensaje_plan" :class="messageClass">{{ planMessage }}</div>
    </div>

    <ModalAlimentos v-if="modal.alimentos" @cerrar="cerrarModal" @agregar="handleAgregarAlimento" />
    <ModalPaciente v-if="modal.paciente" :planId="plan.id" @cerrar="cerrarModal" @asignado="handlePlanAsignado" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { planService } from '@/services/PlanService';
import ModalAlimentos from '@/components/modales/ModalAlimentos.vue';
import ModalPaciente from '@/components/modales/ModalPaciente.vue';

const planBase = {
  id: null,
  nombre: '',
  description: '',
  detalle: []
};

export default defineComponent({
  name: 'CreadorPlanesView',
  components: { ModalAlimentos, ModalPaciente },
  data() {
    return {
      alimentos: [],
      plan: { ...planBase },
      diasSemana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      plantillas: [],
      cargandoPlantillas: false,
      planMessage: '',
      messageClass: '',
      modal: { alimentos: false, paciente: false }
    };
  },
  methods: {
    abrirModal(type) { this.modal[type] = true; },
    cerrarModal() { this.modal = { alimentos: false, paciente: false }; },

    handleAgregarAlimento({ alimento, dia, comida, porcion }) {
      this.plan.detalle.push({
        dia,
        comida,
        alimento_id: alimento.id,
        porcion,
        nombre: alimento.food_name,
        kcal: alimento.food_kcal
      });
      this.cerrarModal();
    },

    eliminarDetalle(dia, index) {
      const itemsDelDia = this.plan.detalle.filter(d => d.dia === dia);
      const itemToRemove = itemsDelDia[index];
      if(itemToRemove) {
        this.plan.detalle = this.plan.detalle.filter(item => item !== itemToRemove);
      }
    },

    async guardarPlan() {
      if (!this.plan.nombre) { alert("Ingrese un nombre de plan"); return; }
      if (!this.plan.detalle.length) { alert("El plan no tiene alimentos agregados"); return; }

      try {
        const result = await planService.guardarPlan(this.plan);
        this.plan.id = result.plan_id;
        this.planMessage = "Plan guardado con éxito!";
        this.messageClass = "success";
        await this.cargarPlantillas();
      } catch (error) {
        this.planMessage = `Error al guardar: ${error.message}`;
        this.messageClass = "error";
      }
    },

    async cargarPlantillas() {
      this.cargandoPlantillas = true;
      try {
        this.alimentos = await planService.cargarCatalogoAlimentos();
        this.plantillas = await planService.cargarPlantillas(this.alimentos);
      } catch (error) {
        this.planMessage = `Error al cargar plantillas: ${error.message}`;
        this.messageClass = "error";
        this.plantillas = [];
      } finally {
        this.cargandoPlantillas = false;
      }
    },

    usarPlantilla(plantilla) {
      this.plan = {
        id: plantilla.id,
        nombre: plantilla.nombre,
        description: plantilla.description,

        detalle: plantilla.detalle.map(d => ({
          dia: d.dia,
          comida: d.comida,
          alimento_id: d.alimento_id,
          porcion: d.porcion,

          // ✅ Toma correctamente el nombre desde backend
          nombre: d.food_name || "Alimento Desconocido",

          // ✅ Kcal real
          kcal: d.food_kcal ?? 0
        }))
      };
      alert(`Plan "${plantilla.nombre}" cargado. ¡Recuerda GUARDAR para actualizar!`);
    },

    handlePlanAsignado() {
      this.planMessage = "Plan asignado al paciente con éxito!";
      this.messageClass = "success";
      this.cerrarModal();
    }
  },

  async created() {
    this.alimentos = await planService.cargarCatalogoAlimentos();
    await this.cargarPlantillas();
  }
});
</script>

<style scoped>
/*
 * Adaptación de los estilos del archivo CSS/HTML original
 */

.dashboard-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  color: var(--color-text);
}

.page-heading {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
  border-bottom: 2px solid var(--color-border-hover);
  text-align: center;
}

.green-text {
  color: var(--nfip-c-green-health); /* Destaca el nombre del nutriólogo */
}

.card-container {
  max-width: 1200px;
  width: 95%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--vt-c-black);
  background-color: var(--color-background-soft);
}
.plan-id-info {
  font-style: italic;
  color: var(--nfip-c-green-health);
  margin-bottom: 10px;
}

input[type="text"], textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid var(--color-border, #ccc);
  background-color: var(--color-background-mute); /* Fondo ligeramente más oscuro que el soft */
  color: var(--color-text);
  border-radius: 6px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

/* --- Botones --- */
.button-cta, .button-secondary {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  margin: 5px;
}
.button-cta {
  background-color: var(--nfip-c-orange-energy, #e67e22);
  color: var(--vt-c-white, white);
}
.button-cta:hover {
  background-color: var(--nfip-c-orange-soft, #f39c12);
}
.button-secondary {
  background-color: var(--nfip-c-green-health, #2ecc71);
  color: var(--vt-c-white, white);
}
.button-secondary:hover {
  background-color: var(--nfip-c-green-dark, #004d40);
}
.plan-actions {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* --- Calendario --- */
#calendario-lista {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
  text-align: center;
  background: var(--color-background-soft);
  padding: 10px;
  border-radius: 8px var(--color-border);
  border: 1px solid var(--color-border);
}
.dia {
  border: 1px dashed #ddd;
  padding: 10px 5px;
  min-height: 150px;
  background: #fdfdfd;
  border-radius: 4px;
  overflow-y: auto;
}
.dia h4 {
  color: var(--color-heading);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

/* --- Alimentos/Plantillas --- */
.alimento-card, .paciente-card {
  background: var(--color-background-mute);
  border: 1px solid var(--nfip-c-green-health);
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.listado-plantillas {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--nfip-c-green-health);
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 6px;
}
.delete-item {
  cursor: pointer;
  margin-left: 10px;
  font-weight: bold;
  color: #f44336;
}

/* --- Mensajes --- */
#mensaje_plan {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}
.success {
  background-color: #d4edda;
  color: #155724;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
}

/* 📱 Responsividad */
@media (max-width: 900px) {
  /* En pantallas medianas (tablets), el grid se ajustará automáticamente gracias a auto-fit */
  .dashboard-view {
    font-size: 2rem;
  }
  .card-container {
    gap: 15px;
  }
}

@media (max-width: 600px) {
  .dashboard-view {
    padding: 1rem;
  }
  .card-container {
    gap: 15px;
  }
}
</style>