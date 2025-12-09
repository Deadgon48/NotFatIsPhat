<template>
  <div class="ajustes-view">
    <header class="view-header">
      <h1>⚙️ Ajustes de Perfil</h1>
    </header>

    <div class="card soft-background">
      <p v-if="mensaje" :class="['status-msg', tipoMensaje]">{{ mensaje }}</p>

      <form @submit.prevent="actualizarPerfil" class="form-grid">

        <div class="group">
          <label>Nombres</label>
          <input type="text" v-model="form.nombres" class="input-nfip" required />
        </div>
        <div class="group">
          <label>Apellidos</label>
          <input type="text" v-model="form.apellidos" class="input-nfip" required />
        </div>
        <div class="group full-width">
          <label>Email</label>
          <input type="email" v-model="form.email" class="input-nfip" required />
        </div>

        <div class="actions full-width">
          <button type="button" @click="$router.push('/nutriologo')" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save" :disabled="cargando">
            {{ cargando ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const authStore = useAuthStore();
const cargando = ref(false);
const mensaje = ref('');
const tipoMensaje = ref('');

const form = reactive({
  nombres: '',
  apellidos: '',
  email: ''
});

// Cargar datos actuales al entrar
onMounted(() => {
  if (authStore.user) {
    // AJUSTE: Mapeamos first_name a nombres si tu DB usa inglés,
    // o nombres si usa español. Esto previene errores si la propiedad cambia.
    form.nombres = authStore.user.first_name || authStore.user.nombres || '';
    form.apellidos = authStore.user.last_name || authStore.user.apellidos || '';
    form.email = authStore.user.email || '';
  }
});

const actualizarPerfil = async () => {
  cargando.value = true;
  mensaje.value = '';

  try {
    const token = localStorage.getItem('auth_token');

    // REVISA EL PUERTO: En tus logs anteriores usabas 3001, aquí tenías 3000.
    // Lo he dejado en 3001 por seguridad, cámbialo si es necesario.
    const res = await axios.put('http://localhost:3001/api/actualizacion/perfil',
        {
          id: authStore.user.id,
          // Enviamos los datos con los nombres que espera el backend
          first_name: form.nombres,
          last_name: form.apellidos,
          email: form.email
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data) { // A veces axios devuelve data directo, a veces data.ok
      mensaje.value = '✅ Perfil actualizado correctamente';
      tipoMensaje.value = 'success';

      // Actualizamos Pinia al instante para reflejar cambios en la UI
      authStore.user.first_name = form.nombres; // O .nombres según tu store
      authStore.user.last_name = form.apellidos; // O .apellidos según tu store
      authStore.user.email = form.email;

      // Si tu store usa 'nombres' en lugar de 'first_name', descomenta esto:
      // authStore.user.nombres = form.nombres;
      // authStore.user.apellidos = form.apellidos;
    }
  } catch (error) {
    console.error(error);
    mensaje.value = '❌ Error: ' + (error.response?.data?.message || error.message);
    tipoMensaje.value = 'error';
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
/* Agrega tus estilos aquí si no los tienes globales */
.input-nfip {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.group {
  margin-bottom: 15px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.btn-save {
  background-color: #4CAF50; /* Ajusta a tu color verde */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-cancel {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.status-msg.success { color: green; }
.status-msg.error { color: red; }
</style>