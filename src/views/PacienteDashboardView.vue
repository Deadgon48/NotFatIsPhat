<template>
  <!-- 1. 🖼️ Capa HTML (La Vista) -->
  <div class="dashboard-view">
    <h2 class="page-heading">
      <span class="green-text">¡Bienvenido de nuevo, {{ userName }}!</span>
    </h2>

    <div id="dashboard-container">
      <div class="card-menu">
        <!-- CTA Primario (Naranja) para la acción clave -->
        <router-link to="/paciente/mis-planes" class="card soft-background cta-primary">
          <h3>🍎 Mi Plan de Comida</h3>
          <p>Ver el plan nutricional que te asignó tu nutriólogo.</p>
        </router-link>

        <router-link to="/paciente/progreso" class="card soft-background">
          <h3>📈 Registrar Progreso</h3>
          <p>Registrar tu peso y notas para que tu nutriólogo vea tu avance.</p>
        </router-link>

        <router-link to="/perfil/ajustes" class="card soft-background">
          <h3>⚙️ Ajustes de Perfil</h3>
          <p>Actualizar tus datos personales y contraseña.</p>
        </router-link>
      </div>

      <!-- 🟡 Sección GP-17: Mis notificaciones (solo lectura) -->
      <NotificacionesPaciente />
    </div>

    <div id="logout-area">
      <button @click="handleLogout" class="logout-button accent-orange">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/AuthService';
import NotificacionesPaciente from '@/components/NotificacionesPaciente.vue';

const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.user?.name || 'Paciente');

const handleLogout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Error en API al cerrar sesión:', error);
  } finally {
    authStore.logout();
    // usamos replace para que no quede la página anterior en el historial
    await router.replace('/login');
  }
};
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.page-heading {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
  text-align: center;
}
.green-text {
  color: var(--nfip-c-green-health);
}

/* Grid de tarjetas del menú principal */
.card-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 3rem;
}

.card {
  text-decoration: none;
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.soft-background {
  background-color: var(--color-background-soft);
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}
.card h3 {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--nfip-c-green-health);
}
.card p {
  color: var(--color-text);
  font-size: 0.95rem;
  opacity: 0.85;
}
.cta-primary {
  border: 2px solid var(--nfip-c-orange-energy);
}
.cta-primary h3 {
  color: var(--nfip-c-orange-energy);
}

#logout-area {
  text-align: center;
}
.logout-button {
  background-color: transparent;
  border: 2px solid var(--nfip-c-orange-energy);
  color: var(--nfip-c-orange-energy);
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.logout-button:hover {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
}

/* Responsividad */
@media (max-width: 900px) {
  .page-heading {
    font-size: 2rem;
  }
}
@media (max-width: 600px) {
  .dashboard-view {
    padding: 1rem;
  }
  .card-menu {
    gap: 15px;
  }
}
</style>
