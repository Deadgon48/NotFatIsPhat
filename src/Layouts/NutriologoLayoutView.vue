<template>
  <div class="nutriologo-layout">

    <aside class="sidebar soft-background">
      <div class="logo-area">
        <router-link to="/nutriologo/dashboard" class="app-logo green-text">
          🏠 Dashboard
        </router-link>
      </div>

      <nav class="nav-menu">

        <router-link to="/nutriologo/pacientes" class="nav-item">
          👥 Mis Pacientes
        </router-link>
        <router-link to="/nutriologo/CreadorPlanes" class="nav-item">
          📝 Planes
        </router-link>
        <router-link to="/nutriologo/agenda" class="nav-item">
          📅 Agenda
        </router-link>
        <router-link to="/nutriologo/recetas" class="nav-item">
          📚 Recetas
        </router-link>
        <router-link to="/nutriologo/ajustes" class="nav-item">
          ⚙️ Ajustes
        </router-link>
      </nav>

      <div class="user-footer">
        <!-- El template usa 'userName' (que ahora es reactivo) -->
        <span class="username">{{ userName }}</span>
        <button @click="handleLogout" class="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="content-area">
      <header class="content-header">
        <h1>{{ $route.meta.title || "Panel de Control" }}</h1>
      </header>

      <!-- Aquí se renderizan las vistas hijas (Dashboard, MisPacientes, etc.) -->
      <router-view />

    </main>
  </div>
</template>

<!-- ============================================== -->

<script setup>
// 3. 🧠 Capa JavaScript (El ViewModel)
import { computed } from 'vue'; // 1. Importa 'computed'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // 1. Importa Pinia
import { authService } from '@/services/AuthService'; // 1. Importa el servicio

const router = useRouter();
const route = useRoute(); // Para acceder a la información de la ruta actual
const authStore = useAuthStore(); // 2. Obtiene la instancia del store

// 2. REEMPLAZO: 'userName' ahora es una propiedad reactiva
//    que lee el nombre guardado en Pinia.
const userName = computed(() => authStore.user?.name || 'Nutriólogo');

// 3. REEMPLAZO: Lógica de Logout completa
const handleLogout = async () => {
  try {
    // Llama a la API (servicio)
    await authService.logout();
  } catch (error)
  {
    console.error("Error en API al cerrar sesión:", error);
    // Continuamos de todos modos
  } finally {
    // Limpia el store de Pinia (la "mochila")
    authStore.logout();
    // Redirige al login
    router.push('/login'); // O '/ingresar' si esa es tu ruta
  }
};
</script>

<!-- ============================================== -->

<style scoped>
/* 2. 🎨 Capa CSS (El Tema) */
/* (Tus estilos de layout no cambian) */

.nutriologo-layout {
  display: flex;
  min-height: 100vh;
}

/* 1. Estilos del Sidebar */
.sidebar {
  width: 250px;
  min-width: 250px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  height: 100vh; /* Asegura que ocupe toda la altura */
}

.app-logo {
  font-size: 1.8rem;
  font-weight: 900;
  text-decoration: none;
  margin-bottom: 2rem;
  display: block;
  color: var(--nfip-c-green-health);
}

.nav-menu {
  flex-grow: 1; /* Ocupa el espacio restante */
}

.nav-item {
  display: block;
  padding: 0.75rem 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text);
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
}

/* Estilos de Hover y Ruta Activa */
.nav-item:hover {
  background-color: var(--color-background-mute);
}

.router-link-active, .router-link-exact-active {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white) !important;
}

/* 2. Área de Contenido Principal */
.content-area {
  flex-grow: 1;
  padding: 2rem 3rem;
  overflow-y: auto; /* Permite el scroll del contenido */
  background-color: var(--color-background); /* Fondo principal */
  height: 100vh;
}

.content-header h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

/* 3. Footer del Usuario/Logout */
.user-footer {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.username {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  word-break: break-word; /* Evita que nombres largos rompan el layout */
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

/* 📱 Responsividad */
@media (max-width: 992px) {
  .sidebar {
    /* En producción, usarías un botón de toggle para 'left' */
    left: -250px;
  }
  .content-area {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem;
  }
}
</style>