<template>
  <div class="detalle-container">
    <h1>Detalle del Alimento</h1>

    <div v-if="!alimento">
      Cargando...
    </div>

    <table v-else>
      <tr><th>Nombre</th><td>{{ alimento.food_name }}</td></tr>
      <tr><th>Calorías</th><td>{{ alimento.food_kcal }} cal</td></tr>
      <tr><th>Proteína</th><td>{{ alimento.food_protein }} g</td></tr>
      <tr><th>Grasas</th><td>{{ alimento.food_fat }} g</td></tr>
      <tr><th>Carbohidratos</th><td>{{ alimento.food_carbs }} g</td></tr>
      <tr><th>Fibra</th><td>{{ alimento.food_fiber }} g</td></tr>
      <tr><th>Porción asignada</th><td>{{ alimento.porcion }} g</td></tr>
    </table>

    <button @click="volver()">Volver</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { planService } from '@/services/PlanService'

const route = useRoute()
const router = useRouter()

// Usar refs para que no se pierda el value
const idPlan = ref(route.params.idPlan)
const idAlimento = ref(route.params.idAlimento)

const alimento = ref(null)

onMounted(async () => {
  try {
    alimento.value = await planService.getAlimento(idAlimento.value)
  } catch (error) {
    console.error("Error al obtener detalle:", error)
  }
})

function volver() {
  router.push({
    name: "MiPlan",
    params: { idPlan: idPlan.value }
  })
}
</script>




<style scoped>

.detalle-container {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-background);
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  font-size: 1rem;
}

th {
  text-align: left;
  color: var(--nfip-c-orange-energy);
  font-weight: 600;
}

td {
  color: var(--color-text);
}

tr:last-child td {
  border-bottom: none;
}

/* Botón volver */
button {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  background: var(--nfip-c-green-health);
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #1e8e4c;
}

/* Modo móvil */
@media(max-width: 600px) {
  .detalle-container {
    padding: 1rem;
  }
  table {
    font-size: 0.9rem;
  }
}
</style>

