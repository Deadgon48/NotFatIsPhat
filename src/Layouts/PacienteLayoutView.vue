<template>
  <div class="paciente-layout">

    <nav class="sidebar-nav soft-background">
      <div class="sidebar-header">
        <span class="logo-text">NoFatIsPhat</span>
        <span class="role-badge">Paciente</span>
      </div>

      <ul class="nav-links">
        <li>
          <RouterLink to="/paciente/dashboard" class="nav-link">
            <span>🏠</span> Mi Panel
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/paciente/mi-plan" class="nav-link">
            <span>🍎</span> Mi Plan
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/paciente/progreso" class="nav-link">
            <span>📈</span> Mi Progreso
          </RouterLink>
        </li>
      </ul>

      <!-- CAMBIOS EN EL TEMPLATE (Paso 2) -->
      <div class="sidebar-footer">
        <!-- 1. Nombre de usuario añadido -->
        <span class="username">{{ userName }}</span>
        <!-- 2. Botón de logout (ya estaba) -->
        <button @click="handleLogout" class="button-secondary logout-button">
          Cerrar Sesión
        </button>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>

  </div>
</template>

<!-- ============================================== -->

<script setup>
// CAMBIOS EN EL SCRIPT (Paso 1)
// 3. 🧠 Capa JavaScript (El ViewModel)
import { computed } from 'vue'; // 1. Importa 'computed'
import { useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/AuthService';

const router = useRouter();
const authStore = useAuthStore(); // 2. Obtiene la instancia del store

// 3. 'userName' ahora es una propiedad reactiva de Pinia
const userName = computed(() => authStore.user?.name || 'Paciente');

// Comando del ViewModel para cerrar sesión (tu código ya era correcto)
const handleLogout = async () => {
  try {
    await authService.logout(); // Llama a la API
  } catch (error) {
    console.error("Error en API al cerrar sesión:", error);
  } finally {
    authStore.logout(); // Limpia el store de Pinia
    router.push('/login');
  }
};
</script>

<!-- ============================================== -->

<style scoped>
/* 2. 🎨 Capa CSS (El Tema) */

.paciente-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar-nav {
  width: 250px;
  flex-shrink: 0;
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}
.role-badge {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--nfip-c-green-health); /* Verde (Tema) */
  margin-top: 0.25rem;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1; /* Empuja el footer hacia abajo */
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}
.nav-link:hover {
  background-color: var(--color-background-mute);
}
/* Estilo para el enlace activo */
.nav-link.router-link-exact-active {
  background-color: var(--nfip-c-green-health); /* Verde (Tema) */
  color: var(--vt-c-white);
}

/* CAMBIOS EN EL CSS (Paso 3) */
.sidebar-footer {
  margin-top: 2rem;
  padding-top: 1rem; /* Añadido para consistencia */
  border-top: 1px solid var(--color-border); /* Añadido para consistencia */
  text-align: center; /* <-- 1. CENTRADO SOLICITADO */
}

/* 2. Estilo para el nombre de usuario (añadido) */
.username {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  word-break: break-word;
}

.logout-button {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: var(--nfip-c-orange-soft);
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: var(--color-background); /* Fondo principal */
  overflow-y: auto;
}

/* Diseño Responsivo (mobile-first) */
@media (max-width: 768px) {
  .paciente-layout {
    flex-direction: column;
  }
  .sidebar-nav {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .nav-links {
    display: flex;
    flex-grow: 0;
  }
  .nav-link {
    margin: 0 0.25rem;
    padding: 0.5rem;
  }
  .nav-link span {
    display: none; /* Oculta íconos en móvil */
  }
  /* Oculta el footer en móvil (es complejo de re-posicionar) */
  .sidebar-footer {
    display: none;
  }
}
</style>