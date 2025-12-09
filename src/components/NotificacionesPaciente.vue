<template>
  <section class="notifs-card soft-background">
    <header class="notifs-header">
      <h2>📩 Mis notificaciones</h2>
    </header>

    <p v-if="isLoading" class="status">Cargando notificaciones...</p>

    <p v-else-if="error" class="status error">
      {{ error }}
    </p>

    <p v-else-if="!notifications.length" class="status">
      No tienes notificaciones por el momento.
    </p>

    <ul v-else class="notifs-list">
      <li
        v-for="n in notifications"
        :key="n.id"
        class="notif-item"
      >
        <button class="notif-head" @click="toggleOpen(n.id)">
          <div class="notif-main">
            <h3 class="notif-subject">
              {{ n.subject }}
            </h3>
            <p class="notif-meta">
              De: {{ n.sender_name || 'Nutriólogo' }} ·
              {{ formatDate(n.created_at) }}
            </p>
          </div>

          <span class="notif-tag" v-if="!n.is_read">
            Nuevo
          </span>

          <span class="notif-arrow">
            {{ openedId === n.id ? '▲' : '▼' }}
          </span>
        </button>

        <div
          v-if="openedId === n.id"
          class="notif-body"
        >
          <p>{{ n.body }}</p>
        </div>
      </li>
    </ul>

    <small class="hint">
      Nota: Este espacio es solo para recibir avisos de tu nutriólogo.
      No permite responder mensajes.
    </small>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { messageService } from '@/services/MessageService';

const notifications = ref([]);
const isLoading = ref(false);
const error = ref(null);
const openedId = ref(null);

function formatDate(dateString) {
  if (!dateString) return 'Fecha desconocida';
  const d = new Date(dateString);
  if (isNaN(d)) return 'Fecha desconocida';
  return d.toLocaleString();
}

async function fetchInbox() {
  isLoading.value = true;
  error.value = null;
  try {
    const inbox = await messageService.getInbox();
    notifications.value = inbox;
  } catch (e) {
    console.error('Error cargando inbox:', e);
    error.value = e.message || 'Error al cargar notificaciones.';
  } finally {
    isLoading.value = false;
  }
}

async function toggleOpen(id) {
  // cerrar si ya estaba abierta
  if (openedId.value === id) {
    openedId.value = null;
    return;
  }

  openedId.value = id;

  // marcar como leída si aún no lo está
  const notif = notifications.value.find(n => n.id === id);
  if (notif && !notif.is_read) {
    try {
      await messageService.markAsRead(id);
      notif.is_read = 1;
    } catch (e) {
      console.error('Error marcando como leída:', e);
    }
  }
}

onMounted(fetchInbox);
</script>

<style scoped>
.notifs-card {
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  margin-top: 1.5rem;
}

.notifs-header h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.3rem;
  color: var(--nfip-c-green-health);
}

.status {
  margin: 0.5rem 0;
  color: var(--color-text);
}

.status.error {
  color: #ff4d4f;
}

.notifs-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.notif-item + .notif-item {
  border-top: 1px solid var(--color-border);
}

.notif-head {
  width: 100%;
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: var(--color-text);
}

.notif-main {
  flex: 1;
}

.notif-subject {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.notif-meta {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: var(--color-text-mute);
}

.notif-tag {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  margin-right: 0.5rem;
}

.notif-arrow {
  font-size: 0.75rem;
  opacity: 0.7;
}

.notif-body {
  padding: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: var(--color-text);
}

.hint {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: var(--color-text-mute);
}
</style>
