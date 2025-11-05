<template>
  <div v-if="show" class="modal">
    <div class="dialog">
      <header class="dialog-header">
        <h3>Nuevo Paciente</h3>
        <button class="close" @click="$emit('update:show', false)">×</button>
      </header>

      <form class="form" @submit.prevent="submit">
        <div class="grid">
          <label>
            <span>Nombre</span>
            <input v-model.trim="form.first_name" required class="input" />
          </label>
          <label>
            <span>Apellido</span>
            <input v-model.trim="form.last_name" required class="input" />
          </label>
        </div>

        <div class="grid">
          <label>
            <span>Email</span>
            <input v-model.trim="form.email" type="email" required class="input" />
          </label>
          <label>
            <span>Contraseña</span>
            <input v-model="form.password" type="password" required minlength="8" maxlength="12" class="input" />
          </label>
        </div>

        <div class="grid">
          <label>
            <span>Peso (kg)</span>
            <input v-model.number="form.weight" type="number" min="0" step="0.1" class="input" />
          </label>
          <label>
            <span>Altura (m)</span>
            <input v-model.number="form.height" type="number" min="0" step="0.01" class="input" />
          </label>
        </div>

        <label>
          <span>Objetivo</span>
          <select v-model="form.objetivo" class="input">
            <option value="" disabled>Selecciona…</option>
            <option value="Bajar">Bajar</option>
            <option value="Subir">Subir</option>
            <option value="Mantener">Mantener</option>
          </select>
        </label>

        <!-- Sencillo: lista de IDs de alergias, si ya la tienes puedes reemplazar por tu catálogo -->
        <label>
          <span>Alergias (IDs separados por coma, opcional)</span>
          <input v-model="alergiasTexto" placeholder="1,5,14" class="input" />
        </label>

        <p v-if="error" class="error">⚠️ {{ error }}</p>

        <footer class="dialog-footer">
          <button type="button" class="button-secondary" @click="$emit('update:show', false)">Cancelar</button>
          <button type="submit" class="button-cta" :disabled="busy">
            {{ busy ? 'Creando…' : 'Crear Paciente' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import pacienteService from '@/services/PacienteService'; // default export en tu archivo; si exportaste named, ajusta

const props = defineProps({ show: { type: Boolean, default: false } });
const emit  = defineEmits(['update:show','created']);

const emptyForm = () => ({
  first_name: '', last_name: '', email: '', password: '',
  weight: null, height: null, objetivo: ''
});

const form = ref(emptyForm());
const alergiasTexto = ref(''); // "1,5,14"
const busy = ref(false);
const error = ref('');

watch(() => props.show, (v) => {
  if (v) {
    form.value = emptyForm();
    alergiasTexto.value = '';
    error.value = '';
    busy.value = false;
  }
});

function parseAlergias(texto) {
  if (!texto) return [];
  return texto.split(',')
    .map(s => Number(s.trim()))
    .filter(n => Number.isInteger(n) && n > 0);
}

async function submit() {
  error.value = '';
  busy.value = true;
  try {
    const payload = {
      ...form.value,
      role_name: 'Paciente',
      alergias: parseAlergias(alergiasTexto.value),
    };
    const res = await pacienteService.createPatient(payload);
    if (!res || res.ok === false) {
      throw new Error(res?.error || 'No se pudo crear el paciente.');
    }
    emit('created');            // notifica al padre para refrescar la tabla
    emit('update:show', false); // cierra modal
  } catch (e) {
    error.value = e.message || 'Error inesperado.';
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); display:grid; place-items:center; z-index: 50; }
.dialog { width:min(720px, 95vw); background: var(--color-background); color: var(--color-text);
  border:1px solid var(--border,#334155); border-radius: 14px; box-shadow: var(--shadow,0 10px 25px rgba(0,0,0,.3)); }
.dialog-header, .dialog-footer { padding: .9rem 1rem; display:flex; align-items:center; justify-content:space-between; }
.close { background: transparent; border: none; color: var(--color-text); font-size: 1.3rem; cursor: pointer; }
.form { padding: 0 1rem 1rem; display: grid; gap: .9rem; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; }
@media (max-width: 600px){ .grid { grid-template-columns: 1fr; } }
.input { width: 100%; padding: .65rem .8rem; border-radius: 10px; border: 1px solid var(--border,#334155); background: var(--color-background); color: var(--color-text); }
.button-cta { background: var(--nfip-c-orange-energy,#f59e0b); border:none; color:#0b1220; font-weight:800; padding:.55rem 1rem; border-radius:999px; cursor:pointer; }
.button-secondary { background: transparent; border: 1px solid var(--nfip-c-green-health,#22c55e); color: var(--nfip-c-green-health,#22c55e); border-radius:999px; padding:.5rem 1rem; cursor:pointer; }
.error { color: #f87171; margin: .25rem 0 0; }
</style>
