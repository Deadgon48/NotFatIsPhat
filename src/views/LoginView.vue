<template>
  <div class="login-view">

    <h1 class="page-heading">¡Bienvenido de Nuevo!</h1>

    <div id="form-container" class="card-container soft-background">
      <h2 id="form-title">Iniciar Sesión</h2>

      <p v-if="urlMessage" class="status-message">{{ urlMessage }}</p>
      <p v-if="apiError" class="error-message">{{ apiError }}</p>

      <form @submit.prevent="handleLogin">

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="loginModel.email" required placeholder="nombre@dominio.com" />
          <p v-if="loginModel.errors.email" class="error-message">{{ loginModel.errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="loginModel.password" required placeholder="Contraseña" />
          <p v-if="loginModel.errors.password" class="error-message">{{ loginModel.errors.password }}</p>
        </div>

        <div class="form-actions-center">
          <button type="submit" class="button-cta">Acceder</button>
        </div>
      </form>

      <a href="#" id="recover-toggle" @click.prevent="toggleRecoveryForm">
        {{ isRecovering ? 'Cancelar solicitud' : '¿Olvidaste tu contraseña?' }}
      </a>

      <form v-if="isRecovering" class="recover-card mute-background" @submit.prevent="handleRecovery">
        <h3>Recuperar Contraseña</h3>
        <p class="recover-text">Ingrese su email para recibir el enlace de restablecimiento.</p>

        <div class="form-group">
          <label for="recovery-email">Email de Cuenta:</label>
          <input type="email" id="recovery-email" v-model="recoveryEmail" required placeholder="nombre@dominio.com" />
          <p v-if="recoveryError" class="error-message">{{ recoveryError }}</p>
          <p v-if="recoverySuccess" class="success-message">{{ recoverySuccess }}</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="button-secondary">Solicitar Enlace</button>
        </div>
      </form>

    </div>
  </div>
</template>


<style scoped>
/* Estilos necesarios para la estructura del formulario */

.login-view {
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

/* 🧱 Estilos Generales de Formulario */
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
  /* Asegura que el color de fondo y el borde cambien con el modo oscuro */
}

.form-group input::placeholder {
  color: var(--vt-c-text-light-2); /* Placeholder más suave */
  opacity: 0.6;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--nfip-c-green-health);
}

/* ❌ Mensajes de Error */
.error-message {
  color: #f44336; /* Rojo para errores */
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* 🚀 Botones de Acción (Naranja y Verde) */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 2rem;
  gap: 15px; /* Espacio entre botones */
}

/* Botón de Enviar (CTA Principal) */
.button-cta {
  flex-grow: 1; /* Permite que el botón ocupe espacio */
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  margin-bottom: 1rem;
}

.button-cta:hover {
  background-color: var(--nfip-c-green-dark);
}

/* Botón de Borrar (Secundario) */
.button-secondary {
  flex-grow: 1;
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

.button-secondary:hover {
  background-color: var(--nfip-c-orange-soft);
}

/* 📱 Responsividad */
@media (max-width: 600px) {
  .card-container {
    padding: 1.5rem;
  }
  .form-actions {
    flex-direction: column; /* Apila los botones en pantallas pequeñas */
    gap: 10px;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'; // Importamos ref y onMounted de Vue 3
import { Login } from '@/models/Login';
import { authService } from '@/services/AuthService';
import { useRouter } from 'vue-router'; // Necesario para la navegación programática
import { useAuthStore } from '@/stores/authStore';
// 1. Hook para la navegación
const router = useRouter();
const authStore = useAuthStore();
// 2. Estado Reactivo (Reemplazo de data())
// Creamos una instancia reactiva del modelo LoginData
const loginModel = ref(new Login());
const isRecovering = ref(false);
const recoveryEmail = ref('');
const apiError = ref('');
const recoveryError = ref('');
const recoverySuccess = ref('');
const urlMessage = ref('');

// 3. Ciclo de Vida (Reemplazo de mounted())
onMounted(() => {
  // Lógica para leer mensajes de la URL (simulación)
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');
  if (msg) {
    urlMessage.value = decodeURIComponent(msg);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
});

// 4. Métodos (Reemplazo de methods)
const toggleRecoveryForm = () => {
  isRecovering.value = !isRecovering.value;
  recoveryError.value = '';
  recoverySuccess.value = '';
};

// Dentro de <script setup> en LoginView.vue

const handleLogin = async () => {
  apiError.value = '';

  if (loginModel.value.isValid()) {
    try {
      // El 'response' de tu API ya incluye los datos del usuario, incluido el rol
      // Ej: { ok: true, user: { id: 1, name: 'Admin', role: 'Administrador' } }
      const response = await authService.login(loginModel.value);
      authStore.login(response.user);

      if (authStore.userRole === 'Nutriologo') {
        router.push('/nutriologo/dashboard');
      } else if (authStore.userRole === 'Paciente') {
        router.push('/paciente/dashboard');
      } else if (response.user.role === 'Administrador') {
        router.push('/admin'); // 1. Redirige al admin al nuevo panel
      } else {
        router.push('/'); // 2. Redirige a Nutriólogos y Pacientes al dashboard normal

      }



    } catch (error) {
      apiError.value = error.message || 'Error al conectar con el servidor.';
    }
  } else {
    console.log('Validación local fallida.');
  }
};

const handleRecovery = async () => {
  recoveryError.value = '';
  recoverySuccess.value = '';

  if (!recoveryEmail.value || !recoveryEmail.value.includes('@')) {
    recoveryError.value = 'Ingrese un correo válido.';
    return;
  }

  try {
    await authService.requestPasswordRecovery(recoveryEmail.value);
    recoverySuccess.value = '✅ Solicitud enviada. Revise su bandeja de entrada.';
    recoveryEmail.value = '';
  } catch (error) {
    recoveryError.value = error.message || 'Error al procesar la solicitud.';
  }
};
</script>