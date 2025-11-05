<template>
  <div v-if="show" class="modal">
    <div class="dialog">
      <header class="dialog-header">
        <h3>Asignar paciente existente</h3>
        <button class="close" @click="$emit('update:show', false)">×</button>
      </header>

      <div class="search">
        <input
          class="input"
          type="search"
          placeholder="Buscar por nombre, apellido o email…"
          v-model.trim="q"
          @input="debouncedFetch"
        />
      </div>

      <div class="results">
        <div v-if="loading" class="empty">Buscando…</div>
        <div v-else-if="items.length === 0" class="empty">Sin resultados.</div>
        <ul v-else class="list">
          <li v-for="p in items" :key="p.id" class="row">
            <div class="col">
              <div class="name">{{ p.last_name }}, {{ p.first_name }}</div>
              <div class="meta">
                {{ p.email }} <span v-if="p.telefono">· {{ p.telefono }}</span>
              </div>
            </div>
            <button class="button-cta" :disabled="busyId===p.id" @click="asignar(p.id)">
              {{ busyId===p.id ? '...' : 'Asignar' }}
            </button>
          </li>
        </ul>
      </div>

      <footer class="dialog-footer">
        <button class="button-secondary" @click="$emit('update:show', false)">Cerrar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import pacienteService from '@/services/PacienteService'; // o '../services/PacienteService'

const props = defineProps({
  show: { type: Boolean, default: false }
});
const emit = defineEmits(['update:show', 'assigned']); // assigned() => refresca el padre

const q = ref('');
const items = ref([]);
const loading = ref(false);
const busyId = ref(null);
let timer = null;

async function fetchList() {
  loading.value = true;
  try {
    const res = await pacienteService.searchPatients(q.value, 20, 0);
    items.value = res.items ?? [];
  } catch (e) {
    items.value = [];
    console.warn(e);
  } finally {
    loading.value = false;
  }
}
function debouncedFetch() {
  clearTimeout(timer);
  timer = setTimeout(fetchList, 300);
}
async function asignar(id) {
  busyId.value = id;
  try {
    await pacienteService.assignPatient(id);
    emit('assigned');           // notifica al padre para refrescar “mis pacientes”
    emit('update:show', false); // cierra modal
  } catch (e) {
    alert('No se pudo asignar: ' + e.message);
  } finally {
    busyId.value = null;
  }
}

// carga inicial
fetchList();
</script>

<style scoped>
.modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: grid; place-items: center; z-index: 50; }
.dialog { width: min(680px, 92vw); background: var(--color-background); color: var(--color-text);
  border:1px solid var(--border,#334155); border-radius: 14px; box-shadow: var(--shadow,0 10px 25px rgba(0,0,0,.3)); }
.dialog-header, .dialog-footer { padding: .9rem 1rem; display:flex; align-items:center; justify-content:space-between; }
.close { background: transparent; border: none; color: var(--color-text); font-size: 1.3rem; cursor: pointer; }
.search { padding: 0 1rem .5rem; }
.input { width: 100%; padding: .65rem .8rem; border-radius: 10px; border: 1px solid var(--border,#334155); background: var(--color-background); color: var(--color-text); }
.results { max-height: 50vh; overflow: auto; padding: 0 1rem 1rem; }
.empty { padding: .75rem; text-align: center; opacity: .8; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
.row { display: flex; justify-content: space-between; align-items: center; padding: .6rem .5rem; border:1px solid var(--border,#334155); border-radius: 10px; }
.name { font-weight: 700; }
.meta { opacity: .85; }
.button-cta { background: var(--nfip-c-orange-energy,#f59e0b); border:none; color:#0b1220; font-weight:800; padding:.45rem .8rem; border-radius:999px; cursor:pointer; }
.button-secondary { background: transparent; border: 1px solid var(--nfip-c-green-health,#22c55e); color: var(--nfip-c-green-health,#22c55e); border-radius:999px; padding:.45rem .8rem; cursor:pointer; }
</style>
