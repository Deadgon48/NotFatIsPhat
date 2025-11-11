<template>
  <div class="mi-plan-view">
    <h1 class="page-heading">🍎 Mi Plan Nutricional</h1>
    <p class="page-subheading">
      Estos es tu plan asignado. Sigue las porciones y comidas para alcanzar tu objetivo.
    </p>

    <div v-if="isLoading" class="status-message">
      Cargando tu plan...
    </div>
    <div v-if="apiError" class="status-message error">
      ⚠️ {{ apiError }}
    </div>

    <div v-if="!isLoading && !apiError">

      <div v-if="!planData || !planData.plan_name" class="card-container soft-background">
        <h2 class="form-title">Aún sin Plan</h2>
        <p class="no-plan-message">
          Tu nutriólogo aún no te ha asignado un plan de comidas.
          Por favor, espera a tu próxima consulta.
        </p>
      </div>

      <div v-if="planes.length > 1" class="card-container soft-background" style="margin-bottom: 1rem;">
        <label>Selecciona un plan:</label>
        <select v-model="planSeleccionado" class="plan-selector">
          <option
              v-for="plan in planes"
              :key="plan.plan_id"
              :value="plan"
          >
            {{ plan.plan_name }}
          </option>
        </select>
      </div>


      <div v-if="planData && planData.plan_name">
        <div class="tabs-container">
          <button
              v-for="day in 7"
              :key="day"
              @click="activeDay = day"
              :class="['tab-button', { 'active': activeDay === day }]"
          >
            {{ getDayName(day) }}
          </button>
        </div>

        <div class="card-container soft-background plan-card">

          <h2 class="form-title">
            {{ getDayName(activeDay) }}
            <span class="plan-name-badge">{{ planData.plan_name }}</span>
          </h2>

          <div class="meal-grid">
            <div
                class="meal-card soft-background"
                v-for="(mealItems, mealName) in groupedPlan[activeDay]"
                :key="mealName"
            >
              <h3>{{ mealName }}</h3>

              <ul v-if="mealItems.length">
                <li v-for="item in mealItems" :key="item.id">
                  <span class="portion">Alimento: {{ item.food_name }}</span>
                  <span class="portion"> Porcion: {{ item.porcion }}g</span>
                  <span class="portion"> Calorías: {{ item.food_kcal }} cal</span>
                  <span class="portion"> Proteína: {{ item.food_protein }}g prot</span>
                  <span class="portion"> Grasas: {{ item.food_fat }}g grasa</span>
                  <span class="portion"> Carbohidratos: {{ item.food_carbs }}g carb</span>
                  <span class="portion"> Fibra: {{ item.food_fiber }}g fibra</span>

                    <button @click="verDetalle(item)">
                      Ver detalle
                    </button>

                </li>
              </ul>

              <p v-else class="no-meal">Sin items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 3. 🧠 Capa JavaScript (El ViewModel)
import {ref, onMounted, computed, watch} from 'vue';
// Asumimos un nuevo servicio para los planes
import { planService } from '@/services/PlanService';

import {useRoute, useRouter} from 'vue-router';

const route = useRoute()
const router = useRouter();



// --- Reactividad (Estado) ---
const isLoading = ref(true);
const apiError = ref(null);
const activeDay = ref(1); // Para las pestañas (1 = Lunes)

const planes = ref([]);
const planSeleccionado = ref(null);




// --- Arquitectura MVVM: Carga de datos del Modelo ---
const fetchMiPlan = async () => {
  try {
    const data = await planService.getMisPlanes(); // Nueva ruta
    planes.value = data;

    if (planes.value.length === 1) {
      planSeleccionado.value = planes.value[0];
    }
  } catch (error) {
    if (error.message !== 'UNAUTHORIZED') {
      apiError.value = error.message || 'No se pudo cargar tus planes.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Ahora `planData` depende de la selección
const planData = computed(() => planSeleccionado.value);


// --- Hooks de Ciclo de Vida ---
onMounted(async () => {
  await fetchMiPlan();
  console.log("➡️ planData:", JSON.parse(JSON.stringify(planData.value)));

  // ✅ Si la URL trae /mis-planes/:idPlan
  const idPlanFromRoute = route.params.idPlan;

  if (idPlanFromRoute) {
    const match = planes.value.find(p => p.plan_id == idPlanFromRoute);
    if (match) {
      planSeleccionado.value = match;
    }
  }
});
// --- Lógica del ViewModel (Propiedades Calculadas) ---
// Transforma la lista plana de items en un objeto agrupado
// para que la Vista (<template>) sea simple.

const dayToNumber = {
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
  "Domingo": 7
};


const groupedPlan = computed(() => {
  if (!planData.value || !planData.value.details) return {};

  const dias = planData.value.details.reduce((acc, item) => {
    const dayNum = dayToNumber[item.dia_numero] || 1;
    if (!acc[dayNum]) acc[dayNum] = {};

    if (!acc[dayNum][item.comida]) acc[dayNum][item.comida] = [];
    acc[dayNum][item.comida].push(item);

    return acc;
  }, {});

  // ✅ Ordenar comidas por número (Comida 1, Comida 2, ...)
  for (const day in dias) {
    dias[day] = Object.fromEntries(
        Object.entries(dias[day]).sort((a, b) => {
          const numA = parseInt(a[0].split(" ")[1]);
          const numB = parseInt(b[0].split(" ")[1]);
          return numA - numB;
        })
    );
  }

  return dias;
});

watch(planSeleccionado, (newVal) => {
  if (newVal) {
    router.replace({
      name: "MiPlan",
      params: { idPlan: newVal.plan_id }
    });
  }
});



// --- Lógica del ViewModel (Helpers) ---
const getDayName = (dayNumber) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return days[dayNumber - 1] || 'Día';
};


function verDetalle(item) {
  if (!planSeleccionado.value) return;

  router.push({
    name: "DetalleAlimento",
    params: {
      idPlan: planSeleccionado.value.plan_id,
      idAlimento: item.alimento_id
    }
  });

  console.log("➡️ planSeleccionado.value:", planSeleccionado.value);

}



</script>

<style scoped>
/* 2. 🎨 Capa CSS (El Tema) */
.page-heading {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
}
.page-subheading {
  font-size: 1.1rem;
  color: var(--color-text-mute);
  margin-bottom: 2rem;
}
.status-message {
  text-align: center;
  padding: 2rem;
  font-weight: 500;
}
.status-message.error {
  color: #f44336;
}
.no-plan-message {
  text-align: center;
  padding: 1rem;
  font-size: 1.1rem;
  color: var(--color-text-mute);
}

/* Pestañas de días */
.tabs-container {
  display: flex;
  margin-bottom: -1px; /* Truco para unir con la tarjeta */
  overflow-x: auto;
}
.tab-button {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  color: var(--color-text-mute);
  cursor: pointer;
  font-weight: 500;
  border-bottom: 1px solid var(--color-border);
  margin-right: -1px;
}
.tab-button.active {
  background-color: var(--color-background-soft);
  color: var(--nfip-c-green-health); /* Verde (Tema) */
  border-bottom: 2px solid var(--nfip-c-green-health);
  z-index: 1;
}

/* Tarjeta del Plan (Tu patrón) */
.card-container {
  max-width: 900px;
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}
.tab-button.active {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.plan-card {
  border-top-left-radius: 0; /* Unir con la pestaña */
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plan-name-badge {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  background-color: var(--color-background-mute);
  color: var(--nfip-c-green-health);
  font-weight: 500;
}

/* Grilla de Comidas */
.meal-grid {
  display: flex;
  flex-direction: column; /* ✅ De arriba hacia abajo */
  gap: 1.5rem;
}
.meal-card {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--color-background); /* Destaca del fondo de la tarjeta */
  border: 1px solid var(--color-border);
}
.meal-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--nfip-c-orange-energy); /* Naranja (Tema) */
  margin-top: 0;
  margin-bottom: 1rem;
}
.meal-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.meal-card li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 1rem;
  color: var(--color-text);
}
.meal-card .portion {
  font-weight: 500;
  color: var(--color-text-mute);
}
.no-meal {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  font-style: italic;
}

/* Responsivo */
@media (max-width: 600px) {
  .card-container {
    padding: 1rem;
  }
  .form-title {
    font-size: 1.2rem;
  }
  .meal-grid {
    grid-template-columns: 1fr; /* Apila comidas */
  }
}
</style>