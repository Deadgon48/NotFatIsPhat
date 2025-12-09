<template>
  <div class="mi-progreso-view">

    <!-- FORM SECTION -->
    <div class="card-container form-section">
      <h2 class="section-title">Registrar mi Peso de Hoy</h2>

      <form @submit.prevent="handleSubmit">

        <div class="form-group">
          <label>Peso Actual (kg): *</label>
          <input
            type="number"
            step="0.1"
            v-model.number="progressModel.weight"
            placeholder="Ej: 70.5"
            required
          />
        </div>

        <div class="form-group">
          <label>Notas (Opcional):</label>
          <textarea
            v-model="progressModel.notes"
            placeholder="Ej: me sentí con mayor energía"
          ></textarea>
        </div>

        <p v-if="apiError" class="api-error">{{ apiError }}</p>
        <p v-if="apiSuccess" class="api-success">{{ apiSuccess }}</p>

        <button :disabled="isSubmitting" class="cta">
          {{ isSubmitting ? 'Guardando...' : 'Guardar Progreso' }}
        </button>
      </form>
    </div>

    <!-- HISTORY SECTION -->
    <div class="card-container history-section">
      <h2 class="section-title">Historial de Progreso</h2>

      <div v-if="isLoading" class="status-message">Cargando historial...</div>

      <div v-if="!isLoading && !progressHistory.length" class="status-message">
        Aún no tienes registros de progreso.
      </div>

      <!-- TABLE -->
      <table v-if="!isLoading && progressHistory.length" class="progress-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Peso</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in progressHistory" :key="item.id">
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ Number(item.weight).toFixed(2) }} kg</td>
            <td>{{ item.notes || '---' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ProgressModel } from '@/models/ProgressModel';
import { progressService } from '@/services/ProgressService';

const progressModel = ref(new ProgressModel({}));
const progressHistory = ref([]);
const apiError = ref(null);
const apiSuccess = ref(null);
const isSubmitting = ref(false);
const isLoading = ref(true);

const fetchHistory = async () => {
  apiError.value = null;
  try {
    isLoading.value = true;
    const data = await progressService.getMiProgreso();
    progressHistory.value = data;
  } catch (error) {
    apiError.value = 'No se pudo cargar el historial.';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  apiError.value = null;
  apiSuccess.value = null;
  isSubmitting.value = true;

  try {
    await progressService.submitMiProgreso(progressModel.value);
    apiSuccess.value = '¡Progreso registrado correctamente!';
    progressModel.value = new ProgressModel({});

    await fetchHistory();
  } catch (error) {
    apiError.value = 'Hubo un error al guardar el progreso.';
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return '---';
  return new Date(date).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(fetchHistory);
</script>

<style scoped>
.mi-progreso-view {
  width: 100%;
  padding-bottom: 3rem;
}

/* Container general */
.card-container {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--nfip-c-green-health);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.7rem;
  background: var(--color-background);
  color: var(--color-text);
}

.cta {
  background-color: var(--nfip-c-orange-energy);
  border: none;
  padding: 0.8rem 1.7rem;
  border-radius: 30px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.cta:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.progress-table {
  width: 100%;
  border-collapse: collapse;
}

.progress-table th {
  background-color: #111;
  padding: 10px;
  text-align: left;
  color: var(--nfip-c-green-health);
}

.progress-table td {
  padding: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.status-message {
  text-align: center;
  color: var(--color-text);
  margin: 2rem 0;
}

.api-error {
  color: red;
  text-align: center;
  margin-bottom: 1rem;
}

.api-success {
  color: #41d37e;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
