<template>
  <div class="mis-pacientes-view">
    <header class="view-header">
      <h1>👥 Mis Pacientes</h1>
      <div class="actions">
        <!-- ÚNICO BOTÓN: verde y renombrado -->
        <button @click="showAsignar = true" class="button-cta alt">
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
      <button
        v-if="searchTerm"
        @click="clearSearch"
        class="clear-button"
        aria-label="Borrar búsqueda"
      >
        ✖️
      </button>
    </div>

    <p v-if="isLoading" class="status-message green-text">
      Cargando listado de pacientes...
    </p>
    <p v-if="loadError" class="error-message">
      ⚠️ Error al cargar los pacientes: {{ loadError }}
    </p>

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
          <tr v-for="p in filteredPatients" :key="p.id">
            <td>{{ fullName(p) }}</td>
            <td>{{ p.email || '—' }}</td>
            <td>{{ p.objetivo || '—' }}</td>
            <td>{{ formatDate(p.last_progress_date) }}</td>
            <td>
              <button @click="viewPatientDetails(p.id)" class="action-link green-text">
                Ver Ficha
              </button>
              |
              <button @click="openNotificar(p.id)" class="action-link">
                Notificar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para asignar paciente existente -->
    <AsignarPacienteModal v-model:show="showAsignar" @assigned="onAssigned" />

    <!-- Modal para enviar notificación al paciente -->
    <ModalNotificacion
      v-if="showNotificar"
      :patient-id="selectedPatientId"
      @cerrar="showNotificar = false"
      @enviado="onMensajeEnviado"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import pacienteService from '@/services/PacienteService';
import AsignarPacienteModal from '@/components/AsignarPacienteModal.vue';
import ModalNotificacion from '@/components/ModalNotificacion.vue';

const router = useRouter();

// Estado
const patients           = ref([]);   // lista de mis pacientes
const searchTerm         = ref('');
const isLoading          = ref(false);
const loadError          = ref(null);
const showAsignar        = ref(false);
const showNotificar      = ref(false);      // modal de notificación
const selectedPatientId  = ref(null);       // paciente al que se notificará

// Carga inicial
async function fetchPatients() {
  isLoading.value = true;
  loadError.value = null;
  try {
    // El servicio puede devolver { items: [...] } o directamente un array (compat).
    const data = await pacienteService.getNutriologoPatients('', 50, 0);
    patients.value = data.items ?? data.pacientes ?? data ?? [];
  } catch (error) {
    console.error('Error al cargar pacientes:', error);
    loadError.value = error.message || 'Error desconocido.';
    patients.value = [];
  } finally {
    isLoading.value = false;
  }
}
onMounted(fetchPatients);

// Filtro local por nombre/apellido/email
const filteredPatients = computed(() => {
  const term = (searchTerm.value || '').toLowerCase();
  if (!term) return patients.value;
  return patients.value.filter(p => {
    const first = (p.first_name || '').toLowerCase();
    const last  = (p.last_name  || '').toLowerCase();
    const email = (p.email      || '').toLowerCase();
    return first.includes(term) || last.includes(term) || email.includes(term);
  });
});

// Helpers UI
function clearSearch() {
  searchTerm.value = '';
}
function viewPatientDetails(patientId) {
  router.push(`/nutriologo/pacientes/${patientId}`);
}
function fullName(p) {
  const fn = p.first_name ?? '';
  const ln = p.last_name  ?? '';
  return `${fn} ${ln}`.trim() || '—';
}
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d)) return 'N/A';
  return d.toLocaleDateString();
}

// Abrir modal de notificación
function openNotificar(patientId) {
  selectedPatientId.value = patientId;
  showNotificar.value = true;
}

function onMensajeEnviado() {
  // Aquí podrías usar un toast; por ahora algo sencillo
  alert('Mensaje enviado correctamente');
}

// Evento tras asignar desde el modal
function onAssigned() {
  fetchPatients();          // refresca tabla
  showAsignar.value = false;
}
</script>

<style scoped>
.mis-pacientes-view { padding: 0; }

.view-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.5rem;
}
.view-header h1 { font-size: 1.8rem; color: var(--color-heading); }
.actions { display: flex; gap: .5rem; }

.button-cta {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  border: none; padding: 0.75rem 1.5rem; border-radius: 30px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s;
}
.button-cta:hover { background-color: var(--nfip-c-orange-soft); }
/* Verde */
.button-cta.alt { background-color: var(--nfip-c-green-health); }
.button-cta.alt:hover { filter: brightness(1.1); }

.search-bar {
  display: flex; align-items: center;
  padding: 1rem; border-radius: 8px; margin-bottom: 2rem;
  background-color: var(--color-background-soft); border: 1px solid var(--color-border);
}
.search-input {
  flex-grow: 1; border: none; background: transparent; padding: 0.5rem;
  font-size: 1rem; color: var(--color-text);
}
.search-input:focus { outline: none; }
.clear-button {
  background: transparent; border: none; color: var(--color-text);
  cursor: pointer; opacity: 0.6; transition: opacity 0.2s;
}
.clear-button:hover { opacity: 1; }

.table-container {
  padding: 1.5rem; border-radius: 8px; overflow-x: auto;
  background-color: var(--color-background-soft);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
.patients-table { width: 100%; border-collapse: collapse; }
.patients-table th, .patients-table td {
  padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}
.patients-table th {
  background-color: var(--color-background-mute);
  font-weight: 600; color: var(--nfip-c-green-health);
  text-transform: uppercase; font-size: 0.9rem;
}
.patients-table tbody tr:hover { background-color: var(--color-background-mute); }

.action-link {
  background: none; border: none; text-decoration: underline; cursor: pointer;
  font-weight: 600; font-size: 0.9rem; color: var(--nfip-c-green-dark);
  transition: color 0.2s;
}
.action-link:hover { color: var(--nfip-c-orange-energy); }

.status-message, .no-results { text-align: center; padding: 1rem; color: var(--color-text); }
.green-text { color: var(--nfip-c-green-health); }
</style>
