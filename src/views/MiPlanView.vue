<template>
  <div class="mi-plan-view">
    <h1 class="page-heading">🍎 Mi Plan Nutricional</h1>
    <p class="page-subheading">
      Este es tu plan asignado. Sigue las porciones y comidas para alcanzar tu objetivo.
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
            <div class="meal-card soft-background">
              <h3>Desayuno</h3>
              <ul v-if="groupedPlan[activeDay]?.Desayuno?.length">
                <li v-for="item in groupedPlan[activeDay].Desayuno" :key="item.id">
                  <span>{{ item.food_name }}</span>
                  <span class="portion">{{ item.portion }}</span>
                </li>
              </ul>
              <p v-else class="no-meal">Sin items</p>
            </div>

            <div class="meal-card soft-background">
              <h3>Comida</h3>
              <ul v-if="groupedPlan[activeDay]?.Comida?.length">
                <li v-for="item in groupedPlan[activeDay].Comida" :key="item.id">
                  <span>{{ item.food_name }}</span>
                  <span class="portion">{{ item.portion }}</span>
                </li>
              </ul>
              <p v-else class="no-meal">Sin items</p>
            </div>

            <div class="meal-card soft-background">
              <h3>Cena</h3>
              <ul v-if="groupedPlan[activeDay]?.Cena?.length">
                <li v-for="item in groupedPlan[activeDay].Cena" :key="item.id">
                  <span>{{ item.food_name }}</span>
                  <span class="portion">{{ item.portion }}</span>
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
import { ref, onMounted, computed } from 'vue';
// Asumimos un nuevo servicio para los planes
import { planService } from '@/services/PlanService';

// --- Reactividad (Estado) ---
const planData = ref(null); // El "Modelo" que viene de la API
const isLoading = ref(true);
const apiError = ref(null);
const activeDay = ref(1); // Para las pestañas (1 = Lunes)

// --- Arquitectura MVVM: Carga de datos del Modelo ---
const fetchMiPlan = async () => {
  try {
    // 1. Delega la Comunicación con la API al Servicio
    // (Debes crear este servicio y la ruta en la API)
    const data = await planService.getMiPlan();
    planData.value = data;
  } catch (error) {
    if (error.message !== 'UNAUTHORIZED') { // No mostrar error si solo es "no logueado"
      apiError.value = error.message || 'No se pudo cargar tu plan.';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- Hooks de Ciclo de Vida ---
onMounted(fetchMiPlan);

// --- Lógica del ViewModel (Propiedades Calculadas) ---
// Transforma la lista plana de items en un objeto agrupado
// para que la Vista (<template>) sea simple.
const groupedPlan = computed(() => {
  if (!planData.value || !planData.value.details) {
    return {};
  }

  // Agrupa por día y luego por tipo de comida
  // Resultado: { 1: { Desayuno: [...], Comida: [...] }, 2: { ... } }
  return planData.value.details.reduce((acc, item) => {
    // Estructura del acumulador
    if (!acc[item.dia_numero]) acc[item.dia_numero] = {};
    if (!acc[item.dia_numero][item.meal]) acc[item.dia_numero][item.meal] = [];

    acc[item.dia_numero][item.meal].push(item);
    return acc;
  }, {});
});

// --- Lógica del ViewModel (Helpers) ---
const getDayName = (dayNumber) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return days[dayNumber - 1] || 'Día';
};
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.meal-card {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--color-background); /* Destaca del fondo de la tarjeta */
  border: 1px solid var(--color-border);
}
.meal-card h3 {
  font-size: 1.1rem;
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
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
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