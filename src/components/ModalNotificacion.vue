<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Enviar notificación</h3>

      <div class="modal-content">
        <label>Asunto</label>
        <input
          type="text"
          v-model="subject"
          placeholder="Ej: Recordatorio de cita"
        />

        <label>Mensaje</label>
        <textarea
          v-model="body"
          rows="4"
          placeholder="Escribe aquí el mensaje para el paciente"
        ></textarea>

        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <div class="modal-actions">
        <button @click="$emit('cerrar')">Cancelar</button>
        <button :disabled="!canSend || loading" @click="handleSend">
          {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { messageService } from '@/services/MessageService';

export default {
  name: 'ModalNotificacion',
  props: {
    patientId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      subject: '',
      body: '',
      loading: false,
      error: null,
    };
  },
  computed: {
    canSend() {
      return this.subject.trim().length > 0 && this.body.trim().length > 0;
    },
  },
  methods: {
    async handleSend() {
      this.error = null;
      this.loading = true;
      try {
        await messageService.sendMessage({
          recipients: [this.patientId],
          subject: this.subject,
          body: this.body,
        });

        this.$emit('enviado');
        this.$emit('cerrar');
      } catch (e) {
        console.error(e);
        this.error = 'No se pudo enviar el mensaje.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-background-soft);
  padding: 20px 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 10px 30px var(--vt-c-black);
}

.modal h3 {
  margin-bottom: 10px;
  color: var(--nfip-c-green-health);
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input,
textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

button {
  border: none;
  border-radius: 20px;
  padding: 7px 14px;
  cursor: pointer;
}

button:last-child {
  background-color: var(--nfip-c-green-health);
  color: white;
}

button:first-child {
  background-color: var(--color-border-hover);
  color: var(--color-text);
}

.error {
  color: #ff4d4f;
  font-size: 0.85rem;
}
</style>
