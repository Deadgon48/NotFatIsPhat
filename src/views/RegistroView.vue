<template>
  <div class="registro-view">
    <h1 class="page-heading">👋 Regístrate en NoFatIsPhat</h1>

    <div id="form-container" class="card-container soft-background">
      <p class="form-title">Registro de Nuevo Usuario</p>

      <form @submit.prevent="handleSubmit" autocomplete="on">

        <div class="form-group">
          <label for="primerNombre">Ingresa tu/s nombre/s: *</label>
          <input type="text" id="primerNombre" v-model="userModel.primerNombre" required placeholder="Nombre(s)"/>
          <p v-if="userModel.errors.primerNombre" class="error-message">{{ userModel.errors.primerNombre }}</p>
        </div>

        <div class="form-group">
          <label for="apellido">Ingresa tus apellidos: *</label>
          <input type="text" id="apellido" v-model="userModel.apellido" required placeholder="Apellido(s)"/>
          <p v-if="userModel.errors.apellido" class="error-message">{{ userModel.errors.apellido }}</p>
        </div>

        <div class="form-group">
          <label for="email">Ingresa tu correo electrónico: *</label>
          <input type="email" id="email" v-model="userModel.email" required placeholder="nombre@dominio.com"/>
          <p v-if="userModel.errors.email" class="error-message">{{ userModel.errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="password">Ingresa contraseña: *</label>
          <input type="password" id="password" v-model="userModel.password" maxlength="12"
                 placeholder="8 a 12 caracteres (Mayús, Número)" required/>
          <p v-if="userModel.errors.password" class="error-message">{{ userModel.errors.password }}</p>
        </div>

        <div class="form-group">
          <label for="rol-select">¿Qué clase de usuario eres?  *</label>
          <select id="rol-select" v-model="userModel.rol" required>
            <option value="" disabled>Seleccione un rol</option>
            <option value="Nutriologo">Nutriólogo</option>
            <option value="Paciente">Paciente</option>
          </select>
          <p v-if="userModel.errors.rol" class="error-message">{{ userModel.errors.rol }}</p>
        </div>


                <div v-if="userModel.rol === 'Nutriologo'">
                  <div class="form-group">
                    <label for="emailContacto">Correo de Contacto (Público):</label>
                    <input type="email" id="emailContacto" v-model="userModel.emailContacto" required placeholder="contacto@consultorio.com"/>
                    <p v-if="userModel.errors.emailContacto" class="error-message">{{ userModel.errors.emailContacto }}</p>
                  </div>
                  <div class="form-group">
                    <label for="telefono">Teléfono de Contacto:</label>
                    <input type="tel" id="telefono" v-model="userModel.telefono" required placeholder="Ej: (+99)1112223344"/>
                    <p v-if="userModel.errors.telefono" class="error-message">{{ userModel.errors.telefono }}</p>
                  </div>
                </div>

                <div v-if="userModel.rol === 'Paciente'">
                  <div class="form-group">
                    <label for="peso">Peso (kg):</label>
                    <input type="number" id="peso" v-model.number="userModel.peso" required placeholder="Ej: 70.5" step="0.1"/>
                    <p v-if="userModel.errors.peso" class="error-message">{{ userModel.errors.peso }}</p>
                  </div>
                  <div class="form-group">
                    <label for="altura">Altura (cm):</label>
                    <input type="number" id="altura" v-model.number="userModel.altura" required placeholder="Ej: 175" step="1"/>
                    <p v-if="userModel.errors.altura" class="error-message">{{ userModel.errors.altura }}</p>
                  </div>
                  <div class="form-group">
                    <label for="objetivo-select">¿Cuál es tu objetivo?</label>
                    <select id="objetivo-select" v-model="userModel.objetivo" required>
                      <option value="" disabled>Seleccione un objetivo</option>
                      <option value="Bajar">Bajar de peso</option>
                      <option value="Subir">Subir de peso</option>
                      <option value="Mantener">Mantener mi peso</option>
                    </select>
                    <p v-if="userModel.errors.objetivo" class="error-message">{{ userModel.errors.objetivo }}</p>
                  </div>
                  <div class="form-group">
                    <label>¿Tienes alergias o intolerancias? (Opcional)</label>

                    <div class="alergias-listbox">

                      <p v-if="alergiasCatalog.length === 0">Cargando catálogo...</p>

                      <div
                          v-for="alergia in alergiasCatalog"
                          :key="alergia.id"
                          class="checkbox-item"
                      >
                        <input
                            type="checkbox"
                            :id="'alergia-' + alergia.id"
                            :value="alergia.id"
                            v-model="userModel.alergias"
                        />
                        <label :for="'alergia-' + alergia.id">
                          {{ alergia.alergia_intolerancia }}
                        </label>
                      </div>
                    </div>

                    <p v-if="userModel.errors.alergias" class="error-message">
                      {{ userModel.errors.alergias }}
                    </p>
                  </div>
                </div>



        <div class="form-actions">
          <button type="submit" class="button-cta">Enviar Registro</button>
          <button type="button" class="button-secondary" @click="resetForm">Borrar Campos</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// 1. Importa 'ref' y 'onMounted'
import { defineComponent, ref, onMounted } from 'vue';
import { User } from '@/models/User';
import { registroService } from '@/services/RegistroService';
import { useRouter } from 'vue-router';
import { alergiasService } from '@/services/AlergiasService';

export default defineComponent({
  name: 'RegistroView',

  setup() {
    // --- Lógica del Router y Catálogo (esto ya lo tenías) ---
    const router = useRouter();
    const alergiasCatalog = ref([]);

    const cargarCatalogo = async () => {
      try {
        const data = await alergiasService.getAlergias();
        alergiasCatalog.value = data;
      } catch (error) {
        console.error("Error al cargar el catálogo de alergias:", error);
      }
    };

    onMounted(cargarCatalogo);

    // --- NUEVA LÓGICA DE DATOS ---
    // 2. Mueve userModel y apiError aquí, usando ref()
    const userModel = ref(new User({}));
    const apiError = ref(null);

    // --- NUEVA LÓGICA DE MÉTODOS ---
    // 3. Convierte tus 'methods' en funciones 'const'
    const handleSubmit = async () => {
      // 4. Usa .value para acceder a los 'ref'
      apiError.value = null;

      // Depuración (puedes borrar esto después)
      console.log("Datos antes de validar (dentro de setup):", userModel.value);

      // 4. Usa .value para llamar a los métodos del modelo
      if (userModel.value.isValid()) {
        try {
          // 4. Envía el .value al servicio
          const response = await registroService.registerUser(userModel.value);
          alert('¡Registro exitoso! Redirigiendo al Login...');
          router.push('/login');

        } catch (error) {
          console.error("Error de registro:", error);
          apiError.value = error.message;
          alert(`Error: ${apiError.value}`);
        }
      } else {
        console.log('Validación fallida. Mostrando errores en el formulario.');
        // Depuración: Muestra los errores
        console.log("Errores de validación:", userModel.value.errors);
      }
    };

    const resetForm = () => {
      // 4. Usa .value para reasignar
      userModel.value = new User({});
      apiError.value = null;
    };

    // 5. Retorna TODO lo que el template necesita
    return {
      router,
      alergiasCatalog,
      userModel,
      apiError,
      handleSubmit, // <-- Retorna el método
      resetForm     // <-- Retorna el método
    };
  },

  // 6. ¡Ya no necesitas data() ni methods:!
  // data() { ... }
  // methods: { ... }

});
</script>

<style scoped>

.registro-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}
.page-heading {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
}
.card-container {
  max-width: 500px;
  width: 100%;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: background-color 0.5s;
  background-color: var(--color-background-soft);
}
.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-heading);
}
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
  transition: border-color 0.3s, background-color 0.3s;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--nfip-c-green-health);
}
.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
.button-cta {
  background-color: var(--nfip-c-orange-energy);
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
  background-color: var(--nfip-c-green-health);
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

.alergias-listbox {
  max-height: 200px; /* Altura máxima antes de mostrar scroll */
  overflow-y: auto;  /* Scroll vertical */
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.75rem;
  background-color: var(--color-background);
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem; /* Espacio entre items */
}

/* Anula el width:100% que tienen los otros inputs */
.checkbox-item input[type="checkbox"] {
  width: auto;
  margin-right: 0.75rem;
  /* Opcional: cambia el color del check */
  accent-color: var(--nfip-c-green-health);
}

/* Anula los estilos de label de .form-group */
.checkbox-item label {
  margin-bottom: 0;
  font-weight: 400; /* Un peso más ligero */
  cursor: pointer;
}


</style>