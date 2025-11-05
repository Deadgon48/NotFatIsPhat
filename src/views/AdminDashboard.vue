<template>
  <div class="admin-dashboard-view">
    <h1 class="page-heading">Panel de Administración de Usuarios</h1>
    <p class="page-subheading">Gestión de nutriólogos y pacientes del sistema (GP-05).</p>

    <div v-if="isLoading" class="feedback-message">Cargando usuarios...</div>
    <div v-if="apiError" class="error-message feedback-message">{{ apiError }}</div>

    <div v-if="!isLoading && !apiError" class="card-container soft-background">

      <div class="table-wrapper">
        <table class="user-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="usersList.length === 0">
            <td colspan="5">No se encontraron usuarios.</td>
          </tr>

          <tr v-for="user in usersList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.first_name }} {{ user.last_name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-tag', user.role.toLowerCase()]">{{ user.role }}</span>
            </td>
            <td class="actions-cell">
              <button @click="openEditModal(user)" class="button-secondary button-small">
                Editar
              </button>
              <button @click="handleDeleteUser(user.id)" class="button-danger button-small">
                Borrar
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-content card-container soft-background" @click.stop>

        <h3 class="form-title">Editando Usuario: {{ editModel.first_name }}</h3>
        <p v-if="editApiError" class="error-message">{{ editApiError }}</p>

        <form @submit.prevent="handleUpdateUser">

          <div class="form-group">
            <label for="edit-firstname">Nombre:</label>
            <input id="edit-firstname" type="text" v-model="editModel.first_name" required />
            <p v-if="editModel.errors.first_name" class="error-message">{{ editModel.errors.first_name }}</p>
          </div>

          <div class="form-group">
            <label for="edit-lastname">Apellido:</label>
            <input id="edit-lastname" type="text" v-model="editModel.last_name" required />
            <p v-if="editModel.errors.last_name" class="error-message">{{ editModel.errors.last_name }}</p>
          </div>

          <div class="form-group">
            <label for="edit-email">Email:</label>
            <input id="edit-email" type="email" v-model="editModel.email" required />
            <p v-if="editModel.errors.email" class="error-message">{{ editModel.errors.email }}</p>
          </div>

          <div class="form-group">
            <label for="edit-role">Rol:</label>
            <select id="edit-role" v-model="editModel.role" required>
              <option value="Paciente">Paciente</option>
              <option value="Nutriologo">Nutriólogo</option>
            </select>
            <p v-if="editModel.errors.role" class="error-message">{{ editModel.errors.role }}</p>
          </div>

          <div class="form-actions">
            <button type="submit" class="button-cta">Guardar Cambios</button>
            <button type="button" @click="closeModal" class="button-secondary">Cancelar</button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
// 3. 🧠 Capa JavaScript (El ViewModel)
import { ref, onMounted } from 'vue';
import { adminService } from '@/services/AdminService'; // Importamos el nuevo servicio
// No necesitamos useRouter ya que nos quedamos en la misma página

// --- Reactividad: Declaración de Estado ---
const usersList = ref([]);
const isLoading = ref(true);
const apiError = ref(null); // Error para la carga de la lista
const editApiError = ref(null); // Error para el formulario del modal

// Estado del Modal
const isModalOpen = ref(false);

// --- Arquitectura MVVM: El Modelo para el formulario de edición ---
// Usamos ref() para el estado, como exige tu estrategia
const editModel = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  role: '',
  errors: {} // Para el manejo de errores del formulario
});


// --- Métodos (Comandos del ViewModel) ---

/**
 * Carga la lista de usuarios desde la API.
 * Delega la comunicación al Servicio (AdminService).
 */
const loadUsers = async () => {
  isLoading.value = true;
  apiError.value = null;
  try {
    usersList.value = await adminService.getAllUsers();
  } catch (error) {
    apiError.value = `Error al cargar usuarios: ${error.message}. ¿Quizás no eres Administrador?`;
  } finally {
    isLoading.value = false;
  }
};

/**
 * Hook de Ciclo de Vida: Se llama cuando el componente se monta.
 */
onMounted(loadUsers);

/**
 * Abre el modal de edición y puebla el 'editModel'
 * con los datos del usuario seleccionado.
 */
const openEditModal = (user) => {
  // Poblamos el Modelo con los datos de la fila
  editModel.value = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    errors: {} // Limpiamos errores anteriores
  };
  editApiError.value = null; // Limpiamos errores de API
  isModalOpen.value = true;
};

/**
 * Cierra el modal de edición y resetea el 'editModel'.
 */
const closeModal = () => {
  isModalOpen.value = false;
  editModel.value = { id: null, first_name: '', last_name: '', email: '', role: '', errors: {} };
};

/**
 * Valida el 'editModel' localmente antes de enviarlo.
 * Este es el "Modelo" validando, como lo define tu prompt.
 */
const validateEditModel = () => {
  const model = editModel.value;
  model.errors = {};

  if (!model.first_name) model.errors.first_name = 'El nombre es obligatorio.';
  if (!model.last_name) model.errors.last_name = 'El apellido es obligatorio.';
  if (!model.email) model.errors.email = 'El email es obligatorio.';
  if (!model.role) model.errors.role = 'El rol es obligatorio.';

  // Devuelve true si no hay claves en el objeto de errores
  return Object.keys(model.errors).length === 0;
};

/**
 * Comando para manejar el envío del formulario de edición.
 * Delega la validación al Modelo y la comunicación al Servicio.
 */
const handleUpdateUser = async () => {
  editApiError.value = null;

  // 1. Delega la Validación al Modelo (MVVM)
  if (validateEditModel()) {
    try {
      const payload = {
        first_name: editModel.value.first_name,
        last_name: editModel.value.last_name,
        email: editModel.value.email,
        role: editModel.value.role,
      };

      // 2. Delega la Comunicación con la API al Servicio (MVVM)
      await adminService.updateUser(editModel.value.id, payload);

      closeModal();
      loadUsers(); // Recarga la lista de usuarios

    } catch (error) {
      // Muestra errores de la API (ej. "Email duplicado")
      editApiError.value = `Error al actualizar: ${error.message}`;
    }
  }
};

/**
 * Comando para manejar la eliminación de un usuario.
 */
const handleDeleteUser = async (userId) => {
  // Usamos un 'confirm' simple para la validación de borrado
  if (!confirm(`¿Estás seguro de que quieres eliminar al usuario ID: ${userId}? Esta acción no se puede deshacer.`)) {
    return;
  }

  apiError.value = null; // Limpia errores antiguos
  try {
    // 2. Delega la Comunicación con la API al Servicio (MVVM)
    await adminService.deleteUser(userId);
    loadUsers(); // Recarga la lista de usuarios

  } catch (error) {
    apiError.value = `Error al eliminar: ${error.message}`;
  }
};
</script>

<style scoped>
/* 2. 🎨 Capa CSS (El Tema) */

.admin-dashboard-view {
  max-width: 900px; /* Un poco más ancho para la tabla */
  margin: 2rem auto;
  padding: 1rem;
}

.page-heading {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  text-align: center;
}

.page-subheading {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.feedback-message {
  text-align: center;
  font-size: 1.1rem;
  padding: 2rem;
  color: var(--color-text);
}

.card-container {
  /* Estilos de tu prompt: ancho, centrado, fondo */
  max-width: 100%; /* El 'admin-dashboard-view' ya limita el ancho */
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  background-color: var(--color-background-soft);
}

/* --- Estilos de la Tabla --- */

.table-wrapper {
  /* Diseño Responsivo: permite scroll horizontal en la tabla */
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.user-table th,
.user-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  vertical-align: middle;
}

.user-table th {
  font-weight: 600;
  color: var(--color-heading);
}

.role-tag {
  padding: 0.25rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-tag.paciente {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
}

.role-tag.nutriologo {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
}

.actions-cell {
  display: flex;
  gap: 10px;
}

.button-small {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  border-radius: 20px;
}

/* Paleta Temática: Botón de Borrar (Naranja/Rojo) */
.button-danger {
  background-color: #E53935; /* Un rojo claro */
  color: var(--vt-c-white);
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}
.button-danger:hover {
  background-color: #C62828; /* Rojo más oscuro */
}

/* --- Estilos del Modal (copiados de tu prompt) --- */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

/* --- Estilos de Formulario (copiados de tu prompt) --- */
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
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--nfip-c-green-health); /* Verde (Tema) */
}

.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Diseño Responsivo: Apila los botones en móvil */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 2rem;
}
@media (max-width: 600px) {
  .form-actions {
    flex-direction: column;
  }
}

/* Paleta Temática: Botones de Acción (Naranja y Verde) */
.button-cta {
  flex-grow: 1;
  background-color: var(--nfip-c-orange-energy); /* Naranja (Tema) */
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}
.button-cta:hover {
  background-color: var(--nfip-c-orange-soft);
}

.button-secondary {
  flex-grow: 1;
  background-color: var(--nfip-c-green-health); /* Verde (Tema) */
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}
.button-secondary:hover {
  background-color: var(--nfip-c-green-dark);
}

</style>