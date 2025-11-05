<template>
  <div class="mi-progreso-view">
    <h1 class="page-heading">📈 Mi Progreso</h1>

    <div class="card-container soft-background">
      <p class="form-title">Registrar mi Peso de Hoy</p>

      <form @submit.prevent="handleSubmit">

        <div class="form-group">
          <label for="peso">Peso Actual (kg): *</label>
          <input
              type="number"
              id="peso"
              v-model.number="progressModel.weight"
              placeholder="Ej: 70.5"
              step="0.1"
              required
          />
          <p v-if="progressModel.errors.weight" class="error-message">
            {{ progressModel.errors.weight }}
          </p>
        </div>

        <div class="form-group">
          <label for="notes">Notas (Opcional):</label>
          <textarea
              id="notes"
              v-model="progressModel.notes"
              rows="3"
              placeholder="Ej: Me siento con más energía esta semana."
          ></textarea>
        </div>

        <p v-if="apiError" class="error-message api-error">{{ apiError }}</p>
        <p v-if="apiSuccess" class="success-message api-success">{{ apiSuccess }}</p>

        <div class="form-actions">
          <button type="submit" class="button-cta" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Guardar Progreso' }}
          </button>
        </div>
      </form>
    </div>

    <div class="card-container soft-background">
      <p class="form-title">Historial de Progreso</p>

      <div v-if="isLoading" class="status-message">Cargando historial...</div>
      <div v-if="!isLoading && !progressHistory.length" class="status-message">
        Aún no tienes registros de progreso.
      </div>

      <div v-if="!isLoading && progressHistory.length > 0" class="table-container">
        <table class="progress-table">
          <thead>
          <tr>
            <th>Fecha de Registro</th>
            <th>Peso (kg)</th>
            <th>Notas</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="entry in progressHistory" :key="entry.id">
            <td>{{ formatDate(entry.created_at) }}</td>
            <td>{{ entry.weight }} kg</td>
            <td classs="notes-cell">{{ entry.notes || '---' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// 3. 🧠 Capa JavaScript (El ViewModel)
import { ref, onMounted } from 'vue';
// Asumimos un nuevo Modelo y Servicio
import { ProgressModel } from '@/models/ProgressModel';
import { progressService } from '@/services/ProgressService';

// --- Reactividad (Estado) ---
// Arquitectura MVVM: Instancia del Modelo
const progressModel = ref(new ProgressModel({}));

// Estado de la Vista
const progressHistory = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const apiError = ref(null);
const apiSuccess = ref(null);

// --- Arquitectura MVVM: Carga de datos del Modelo ---
const fetchHistory = async () => {
  try {
    isLoading.value = true;
    // 1. Delega la Comunicación con la API al Servicio
    // (Debes crear este servicio y la ruta en la API)
    const data = await progressService.getMiProgreso();
    progressHistory.value = data;
  } catch (error) {
    apiError.value = 'No se pudo cargar el historial de progreso.';
  } finally {
    isLoading.value = false;
  }
};

// --- Hooks de Ciclo de Vida ---
onMounted(fetchHistory);

// --- Arquitectura MVVM: Comando del ViewModel (Formulario) ---
const handleSubmit = async () => {
  apiError.value = null;
  apiSuccess.value = null;

  // 1. Delega la Validación al Modelo
  if (progressModel.value.isValid()) {
    isSubmitting.value = true;
    try {
      // 2. Delega la Comunicación con la API al Servicio
      await progressService.submitMiProgreso(progressModel.value);

      // 3. Éxito: Limpia el formulario y recarga el historial
      apiSuccess.value = '¡Progreso guardado con éxito!';
      progressModel.value = new ProgressModel({}); // Resetea el modelo
      await fetchHistory(); // Vuelve a cargar la tabla

    } catch (error) {
      apiError.value = error.message || 'Error al guardar el progreso.';
    } finally {
      isSubmitting.value = false;
    }
  }
  // Si isValid() es falso, los v-if del template mostrarán los errores
};

// --- Lógica del ViewModel (Helpers) ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
/* 2. 🎨 Capa CSS (El Tema) */
.mi-progreso-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.page-heading {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 2rem;
}

/* Tarjeta Centralizada (Tu patrón) */
.card-container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  background-color: var(--color-background-soft);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.form-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

/* Estilos de Formulario (Tu patrón) */
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--nfip-c-green-health); /* Verde (Tema) */
}
.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}
.api-error {
  text-align: center;
  margin-bottom: 1rem;
}
.api-success {
  color: var(--nfip-c-green-dark);
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: center; /* Centrado */
}

/* Naranja (Tema) */
.button-cta {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}
.button-cta:hover:not(:disabled) {
  background-color: var(--nfip-c-orange-soft);
}
.button-cta:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Tabla de Historial */
.table-container {
  overflow-x: auto;
}
.progress-table {
  width: 100%;
  border-collapse: collapse;
}
.progress-table th,
.progress-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}
.progress-table th {
  background-color: var(--color-background-mute);
  font-weight: 600;
  color: var(--nfip-c-green-health); /* Verde (Tema) */
  text-transform: uppercase;
  font-size: 0.9rem;
}
.progress-table tbody tr:hover {
  background-color: var(--color-background-mute);
}
.notes-cell {
  font-style: italic;
  color: var(--color-text-mute);
}

/* Responsivo */
@media (max-width: 600px) {
  .card-container {
    padding: 1rem;
  }
}
</style>