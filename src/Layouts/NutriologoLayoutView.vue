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
        <router-link to="/nutriologo/planes" class="nav-item">
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

      <router-view />

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// Asumimos un stores para obtener el nombre del usuario
// import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute(); // Para acceder a la información de la ruta actual

// Simulación de datos (En un proyecto real, vendría del stores)
const userName = ref("Nutriólogo(a)");

const handleLogout = async () => {
  // Lógica para llamar a authService.logout() y redirigir
  alert('Cerrando sesión...');
  router.push('/ingresar');
};
</script>

<style scoped>
/* ESTILOS DE LAYOUT MODERNO Y RESPONSIVO */

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
  /* El color de fondo suave cambia con el tema */
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  position: sticky; /* Fija la barra lateral */
  top: 0;
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

/* Estilo para la ruta activa (proporcionado por Vue Router) */
.router-link-active, .router-link-exact-active {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white) !important;
}

/* 2. Área de Contenido Principal */
.content-area {
  flex-grow: 1;
  padding: 2rem 3rem;
  overflow-y: auto; /* Permite el scroll del contenido */
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

/* 📱 Responsividad: Ocultar o colapsar el sidebar en móviles */
@media (max-width: 992px) {
  /* En móviles, cambia a una navegación superior o de menú hamburguesa */
  .sidebar {
    position: fixed; /* Ocultarlo o hacerlo un menú hamburguesa */
    left: -250px; /* Ocultado por defecto */
    transition: left 0.3s;
    z-index: 1000;
    /* Para simplificar, aquí solo lo ocultamos. En producción, usarías un botón de toggle. */
  }
  .content-area {
    margin-left: 0;
    width: 100%;
  }
}
</style>