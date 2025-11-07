<template>
  <div class="dashboard-view">
    <h2 class="page-heading">
      <span class="green-text">¡Bienvenido, Nutriólogo(a) {{ userName }}!</span>
    </h2>

    <div id="dashboard-container">

      <div class="card-menu">

        <router-link to="/nutriologo/pacientes" class="card soft-background cta-primary">
          <h3>👥 Mis Pacientes</h3>
          <p>Agregar Pacientes, ver listado, historial, progreso y notas.</p>
        </router-link>

        <router-link to="/nutriologo/Creadorplanes" class="card soft-background">
          <h3>📝 Crear/Editar Planes</h3>
          <p>Diseñar, asignar y modificar dietas, objetivos calóricos y rutinas.</p>
        </router-link>



        <router-link to="/nutriologo/recetas" class="card soft-background">
          <h3>📚 Biblioteca de Recetas</h3>
          <p>Gestionar y agregar nuevas recetas, ingredientes y recursos educativos.</p>
        </router-link>

        <router-link to="/nutriologo/mensajeria" class="card soft-background">
          <h3>📧 Mensajería</h3>
          <p>Comunicación directa con los pacientes para resolver dudas rápidas.</p>
        </router-link>

        <router-link to="/perfil/ajustes" class="card soft-background">
          <h3>⚙️ Ajustes de Perfil</h3>
          <p>Actualizar datos personales, tarifas y horario de disponibilidad.</p>
        </router-link>

      </div>
    </div>

    <div id="logout-area">
      <button @click="handleLogout" class="logout-button accent-orange">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
// Usamos Composition API para la lógica (ViewModel)
import { computed } from 'vue'; // 1. Importa 'computed'
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { authService } from '@/services/AuthService';
import { useAuthStore } from '@/stores/authStore'; // 1. Importa Pinia

const router = useRouter();
const authStore = useAuthStore(); // 2. Obtiene la instancia del store

// 2. REEMPLAZO: 'userName' ahora es una propiedad reactiva
//    que lee el nombre guardado en Pinia.
//    (Tu API de login devuelve 'name' como 'first_name + last_name')
const userName = computed(() => authStore.user?.name || 'Nutriólogo');

// --- Lógica del Ciclo de Vida ---
onMounted(() => {
  console.log('Dashboard de Nutriólogo cargado.');
  // Aquí puedes cargar datos iniciales como el conteo de pacientes
});

// --- Métodos de Acción ---
const handleLogout = async () => {
  // Lógica para llamar a authService.logout() y redirigir
  alert('Cerrando sesión...');
  router.push('/ingresar');
};
</script>

<style scoped>
/* APLICACIÓN DEL TEMA NFIP: Limpieza, Responsividad y Colores */

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
  color: var(--nfip-c-green-health); /* Destaca el nombre del nutriólogo */
}

/* 🧱 Contenedor de Menú GRID para Responsividad */
.card-menu {
  display: grid;
  /* Muestra 3 columnas en escritorio, 2 en tablets, 1 en móvil */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 3rem;
}

/* 🖼️ Estilos de Tarjeta (Card) */
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

/* Tarjeta de Fondo Suave (Modo Oscuro/Claro) */
.soft-background {
  background-color: var(--color-background-soft);
}

.card:hover {
  transform: translateY(-5px); /* Efecto de elevación moderno */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card h3 {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--nfip-c-green-health); /* Títulos de tarjeta en verde salud */
}

.card p {
  color: var(--color-text);
  font-size: 0.95rem;
  opacity: 0.85;
}

/* 🟠 CTA Principal: Destacar la tarjeta clave (Mis Pacientes) */
.cta-primary {
  /* Usamos un borde naranja sutil o un color de fondo ligeramente diferente */
  border: 2px solid var(--nfip-c-orange-energy);
}

.cta-primary h3 {
  color: var(--nfip-c-orange-energy);
}


/* 🚪 Botón de Logout */
#logout-area {
  text-align: center; /* Centrar el botón en la vista */
}

.logout-button {
  /* Estilo CTA Naranja, pero lo hacemos discreto para no competir con el menú */
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

/* 📱 Responsividad */
@media (max-width: 900px) {
  /* En pantallas medianas (tablets), el grid se ajustará automáticamente gracias a auto-fit */
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