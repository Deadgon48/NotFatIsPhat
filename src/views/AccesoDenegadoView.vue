<template>
  <div class="acceso-denegado-view">
    <div class="error-card soft-background">
      <h1 class="icon-heading">🛑</h1>
      <h2 class="main-message">Acceso Denegado</h2>
      <p class="detail-message">
        No tienes los permisos necesarios (rol de usuario) para acceder a esta página.
        Asegúrate de haber iniciado sesión con la cuenta de **Nutriólogo** o **Paciente** adecuada.
      </p>
      <div class="action-buttons">
        <button @click="goToMyDashboard" class="button-secondary">
          Ir a mi Panel
        </button>
        <button @click="handleLogout" class="button-cta">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// 1. Importamos el store de Pinia (en lugar de 'auth/utils')
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/AuthService'; // Este se mantiene

const router = useRouter();
// 2. Obtenemos una instancia de nuestro store
const authStore = useAuthStore();

// 🧠 Lógica para redirigir al dashboard correcto
const goToMyDashboard = () => {
  // 3. Leemos el rol directamente desde el store de Pinia
  const userRole = authStore.userRole;

  if (userRole === 'Nutriologo') {
    router.push('/nutriologo/dashboard');
  } else if (userRole === 'Paciente') {
    router.push('/paciente/dashboard');
  } else {
    // Si no hay rol (raro, pero seguro), mandamos al login
    router.push('/login'); // Usamos /login para ser consistentes
  }
};

// 🚪 Lógica para cerrar sesión
const handleLogout = async () => {
  try {
    // Paso 1: Informar a la API que cierre la sesión (¡esto estaba bien!)
    await authService.logout();
  } catch (error) {
    console.error("Error en la API al cerrar sesión:", error);
    // Ignoramos el error de la API y continuamos
  } finally {
    // Paso 2 (CRÍTICO): Informar a Pinia (la "mochila") que limpie los datos
    authStore.logout();

    // Paso 3: Redirigir al usuario
    alert('Sesión cerrada.');
    router.push('/login'); // Usamos /login para ser consistentes
  }
};
</script>

<style scoped>
/* Tus estilos no cambian, ¡están perfectos! */
.acceso-denegado-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
}
.error-card {
  max-width: 450px;
  width: 100%;
  padding: 3rem 2rem;
  border-radius: 12px;
  background-color: var(--color-background-soft);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
.icon-heading {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}
.main-message {
  font-size: 1.8rem;
  color: #dc3545;
  margin-bottom: 1rem;
}
.detail-message {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 2rem;
}
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}
.button-secondary {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}
.button-secondary:hover {
  background-color: var(--nfip-c-green-dark);
}
.button-cta {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}
.button-cta:hover {
  background-color: var(--nfip-c-orange-soft);
}
@media (max-width: 480px) {
  .error-card {
    padding: 2rem 1rem;
  }
  .action-buttons {
    flex-direction: column;
  }
  .button-secondary, .button-cta {
    width: 100%;
  }
}
</style>