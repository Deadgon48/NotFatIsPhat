<template>
  <div class="reset-password-view">
    <div id="form-container" class="card-container soft-background">
      <p class="form-title">Restablecer Contraseña</p>

      <div v-if="isLoading" class="feedback-message">
        <p>Verificando enlace...</p>
      </div>

      <div v-if="apiError" class="api-error-message">
        {{ apiError }}
      </div>

      <div v-if="successMessage" class="api-success-message">
        {{ successMessage }}
      </div>

      <form
          v-if="isTokenValid && !isLoading && !apiError && !successMessage"
          @submit.prevent="handleSubmit"
      >
        <p class="form-instructions">
          Ingresa tu nueva contraseña. Debe ser segura y fácil de recordar.
        </p>

        <div class="form-group">
          <label for="password">Nueva Contraseña: *</label>
          <input
              type="password"
              id="password"
              v-model="resetModel.password"
              required
              placeholder="8 a 12 caracteres (Mayús, Número)"
          />
          <p v-if="resetModel.errors.password" class="error-message">
            {{ resetModel.errors.password }}
          </p>
        </div>

        <div class="form-group">
          <label for="passwordConfirmation">Confirmar Contraseña: *</label>
          <input
              type="password"
              id="passwordConfirmation"
              v-model="resetModel.passwordConfirmation"
              required
              placeholder="Repite la contraseña"
          />
          <p v-if="resetModel.errors.passwordConfirmation" class="error-message">
            {{ resetModel.errors.passwordConfirmation }}
          </p>
        </div>

        <div class="form-actions">
          <button type="submit" class="button-cta">Actualizar Contraseña</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// 🧠 Capa JavaScript (El ViewModel)
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Arquitectura MVVM: Importa el Modelo y el Servicio
import { PasswordResetModel } from '@/models/PasswordResetModel';
import { passwordResetService } from '@/services/PasswordResetService';

// --- Reactividad: Declaración de Estado ---
const router = useRouter();
const route = useRoute(); // Para leer el token de la URL

// Estado del Modelo (MVVM)
const resetModel = ref(new PasswordResetModel());

// Estado de la UI
const isLoading = ref(true);    // Inicia cargando para validar el token
const isTokenValid = ref(false); // Asume que el token es inválido al inicio
const apiError = ref(null);      // Errores del servidor
const successMessage = ref(null); // Mensaje de éxito

// --- Hooks de Ciclo de Vida ---
onMounted(async () => {
  const token = route.query.token;

  if (!token) {
    apiError.value = 'Token no proporcionado. El enlace es inválido.';
    isLoading.value = false;
    return;
  }

  // Guarda el token en el modelo (aunque el servicio lo volverá a recibir)
  resetModel.value.token = token;

  // Arquitectura MVVM: Delega la validación inicial del token al Servicio
  try {
    // Este servicio debe verificar si el token existe y no ha expirado
    await passwordResetService.validateToken(token);
    isTokenValid.value = true; // El token es bueno, muestra el formulario
  } catch (error) {
    apiError.value = error.message || 'El token es inválido o ha expirado.';
    isTokenValid.value = false;
  } finally {
    isLoading.value = false;
  }
});

// --- Métodos (Comandos del ViewModel) ---
const handleSubmit = async () => {
  apiError.value = null;
  successMessage.value = null;

  // 1. Delega la Validación al Modelo (MVVM)
  if (resetModel.value.isValid()) {
    isLoading.value = true;
    try {
      // 2. Delega la Comunicación con la API al Servicio (MVVM)
      const response = await passwordResetService.resetPassword(resetModel.value);

      successMessage.value = response.message || 'Contraseña actualizada con éxito. Serás redirigido al login.';

      // 3. Navegación (asíncrona)
      setTimeout(() => {
        router.push('/ingresar');
      }, 3000); // Da tiempo al usuario de leer el mensaje

    } catch (error) {
      apiError.value = error.message || 'No se pudo actualizar la contraseña.';
    } finally {
      isLoading.value = false;
    }
  }
  // Si isValid() es falso, los v-if del template mostrarán los errores del modelo
};
</script>

<style scoped>
/* 🎨 Capa CSS (El Tema) */
.reset-password-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}
.card-container {
  max-width: 500px;
  width: 100%;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background-soft);
}
.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

/* Nuevos estilos para los mensajes */
.form-instructions {
  color: var(--color-text);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
}
.feedback-message {
  text-align: center;
  padding: 1rem;
  color: var(--color-text);
}
.api-error-message {
  text-align: center;
  padding: 1rem;
  background-color: var(--nfip-c-orange-soft-bg, #fff5f0);
  color: var(--nfip-c-orange-energy, #f57c00);
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-weight: 600;
}
.api-success-message {
  text-align: center;
  padding: 1rem;
  background-color: var(--nfip-c-green-soft-bg, #f1f9f1);
  color: var(--nfip-c-green-dark, #388e3c);
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-weight: 600;
}


/* Estilos de formulario (basados en tu diseño) */
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
}
.form-group input:focus {
  outline: none;
  border-color: var(--nfip-c-green-health); /* Verde (Tema) */
}
.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Botones de acción (Tema y Responsivo) */
.form-actions {
  display: flex;
  justify-content: center; /* Centrado, ya que solo hay un botón */
  margin-top: 2rem;
}
.button-cta {
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

/* Diseño Responsivo (mobile-first) */
@media (max-width: 600px) {
  .card-container {
    padding: 2rem;
  }
  .form-actions {
    flex-direction: column; /* Apila botones en móvil */
  }
  .button-cta {
    width: 100%; /* Botón de ancho completo */
  }
}
</style>