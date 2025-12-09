<template>
  <div class="page">
    <h2>Mis notificaciones</h2>

    <p v-if="loading">Cargando...</p>
    <p v-if="!loading && messages.length === 0">No tienes notificaciones.</p>

    <ul v-if="messages.length">
      <li
        v-for="m in messages"
        :key="m.id"
        :class="{ unread: !m.is_read }"
        @click="abrirMensaje(m)"
      >
        <strong>{{ m.subject }}</strong>
        <span> — de {{ m.sender_name }}</span>
        <br />
        <small>{{ new Date(m.created_at).toLocaleString() }}</small>
      </li>
    </ul>

    <div v-if="mensajeSeleccionado" class="mensaje-detalle">
      <h3>{{ mensajeSeleccionado.subject }}</h3>
      <p><em>de {{ mensajeSeleccionado.sender_name }}</em></p>
      <p>{{ mensajeSeleccionado.body }}</p>
    </div>
  </div>
</template>

<script>
import { messageService } from '@/services/MessageService';

export default {
  name: 'MisNotificaciones',
  data() {
    return {
      loading: false,
      messages: [],
      mensajeSeleccionado: null,
    };
  },
  async created() {
    this.loading = true;
    try {
      this.messages = await messageService.getInbox();
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async abrirMensaje(m) {
      this.mensajeSeleccionado = m;
      if (!m.is_read) {
        await messageService.markAsRead(m.id);
        m.is_read = 1;
      }
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 8px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}
li.unread {
  font-weight: 600;
}
.mensaje-detalle {
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  background: var(--color-background-mute);
}
</style>
