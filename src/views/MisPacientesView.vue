<template>
  <div class="mis-pacientes-view">

    <header class="view-header">
      <h1>👥 Mis Pacientes</h1>
      <div class="actions">
        <button @click="openNewPatientModal" class="button-cta">
          + Agregar Nuevo Paciente
        </button>
      </div>
    </header>

    <div class="search-bar soft-background">
      <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por nombre, apellido o email..."
          class="search-input"
      />
      <button @click="clearSearch" v-if="searchTerm" class="clear-button">
        ✖️
      </button>
    </div>

    <p v-if="isLoading" class="status-message green-text">Cargando listado de pacientes...</p>
    <p v-if="loadError" class="error-message">⚠️ Error al cargar los pacientes: {{ loadError }}</p>

    <div class="table-container soft-background">

      <p v-if="!isLoading && filteredPatients.length === 0" class="no-results">
        {{ searchTerm ? 'No se encontraron pacientes.' : 'Aún no tiene pacientes asignados.' }}
      </p>

      <table v-else-if="filteredPatients.length > 0" class="patients-table">
        <thead>
        <tr>
          <th>Nombre Completo</th>
          <th>Email</th>
          <th>Objetivo</th>
          <th>Última Consulta</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id">
          <td>{{ patient.primerNombre }} {{ patient.apellido }}</td>
          <td>{{ patient.email }}</td>
          <td>{{ patient.objetivo }}</td>
          <td>{{ formatDate(patient.ultimaConsulta) }}</td>
          <td>
            <button @click="viewPatientDetails(patient.id)" class="action-link green-text">
              Ver Ficha
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
// Componente diseñado para Vue 3 Composition API (JavaScript)
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// Asumimos un servicio para obtener y gestionar pacientes
import { pacienteService } from '@/services/PacienteService';

const router = useRouter();

// --- Estado Reactivo (ViewModel) ---
const patients = ref([]); // Lista completa de pacientes
const searchTerm = ref('');
const isLoading = ref(false);
const loadError = ref(null);

// --- Lógica del Ciclo de Vida y Carga de Datos ---
const fetchPatients = async () => {
  isLoading.value = true;
  loadError.value = null;
  try {
    // ⚠️ Esta función debe ser implementada en src/services/PacienteService.js
    const data = await pacienteService.getNutriologoPatients();
    patients.value = data;
  } catch (error) {
    console.error('Error al cargar pacientes:', error);
    loadError.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPatients);

// --- Propiedades Calculadas (Filtro) ---
const filteredPatients = computed(() => {
  const term = searchTerm.value.toLowerCase();
  if (!term) return patients.value;

  return patients.value.filter(p =>
      p.primerNombre.toLowerCase().includes(term) ||
      p.apellido.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
  );
});

// --- Métodos de Interacción ---
const clearSearch = () => {
  searchTerm.value = '';
};

const viewPatientDetails = (patientId) => {
  // Navega a la vista de detalle del paciente (usando el ID)
  router.push(`/nutriologo/pacientes/${patientId}`);
};

const openNewPatientModal = () => {
  alert('Simulación: Abrir modal para agregar nuevo paciente.');
  // Aquí se abriría un modal para capturar los datos y llamar a pacienteService.createPatient()
};

const formatDate = (dateString) => {
  // Formato simple de fecha para la tabla
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
/* ESTILOS TEMÁTICOS Y RESPONSIVOS */

.mis-pacientes-view {
  padding: 0; /* Ya contenido en el layout */
}

/* Encabezado y Botón CTA */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-header h1 {
  font-size: 1.8rem;
  color: var(--color-heading);
}

/* 🟠 Botón CTA (Naranja) */
.button-cta {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-cta:hover {
  background-color: var(--nfip-c-orange-soft);
}

/* Barra de Búsqueda */
.search-bar {
  display: flex;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.search-input {
  flex-grow: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  font-size: 1rem;
  color: var(--color-text);
}

.search-input:focus {
  outline: none;
}

.clear-button {
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.clear-button:hover {
  opacity: 1;
}


/* 📊 Estilos de la Tabla */
.table-container {
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto; /* Scroll horizontal en móviles para la tabla */
  background-color: var(--color-background-soft);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
}

.patients-table th,
.patients-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.patients-table th {
  background-color: var(--color-background-mute); /* Fondo ligeramente más oscuro */
  font-weight: 600;
  color: var(--nfip-c-green-health);
  text-transform: uppercase;
  font-size: 0.9rem;
}

.patients-table tbody tr:hover {
  background-color: var(--color-background-mute); /* Resaltar la fila al pasar el ratón */
}

/* Estilo del enlace de acción */
.action-link {
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--nfip-c-green-dark);
  transition: color 0.2s;
}

.action-link:hover {
  color: var(--nfip-c-orange-energy);
}

/* Mensajes de estado */
.status-message, .no-results {
  text-align: center;
  padding: 1rem;
  color: var(--color-text);
}

.green-text {
  color: var(--nfip-c-green-health);
}
</style>