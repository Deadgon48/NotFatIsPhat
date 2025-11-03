<template>
  <div class="registro-view">
    <h1 class="page-heading">👋 Regístrate en NoFatIsPhat</h1>

    <div id="form-container" class="card-container soft-background">
      <p class="form-title">Registro de Nuevo Usuario</p>

      <form @submit.prevent="handleSubmit" autocomplete="on">

        <div class="form-group">
          <label for="primerNombre">Ingresa tu/s nombre/s:</label>
          <input type="text" id="primerNombre" v-model="userModel.primerNombre" required placeholder="Nombre(s)"/>
          <p v-if="userModel.errors.primerNombre" class="error-message">{{ userModel.errors.primerNombre }}</p>
        </div>

        <div class="form-group">
          <label for="apellido">Ingresa tus apellidos:</label>
          <input type="text" id="apellido" v-model="userModel.apellido" required placeholder="Apellido(s)"/>
          <p v-if="userModel.errors.apellido" class="error-message">{{ userModel.errors.apellido }}</p>
        </div>

        <div class="form-group">
          <label for="email">Ingresa tu correo electrónico:</label>
          <input type="email" id="email" v-model="userModel.email" required placeholder="nombre@dominio.com"/>
          <p v-if="userModel.errors.email" class="error-message">{{ userModel.errors.email }}</p>
        </div>

        <div class="form-group">
          <label for="password">Ingresa contraseña:</label>
          <input type="password" id="password" v-model="userModel.password" maxlength="12"
                 placeholder="8 a 12 caracteres (Mayús, Número)" required/>
          <p v-if="userModel.errors.password" class="error-message">{{ userModel.errors.password }}</p>
        </div>

        <div class="form-group">
          <label for="rol-select">¿Qué clase de usuario eres?</label>
          <select id="rol-select" v-model="userModel.rol" required>
            <option value="" disabled>Seleccione un rol</option>
            <option value="Nutriologo">Nutriólogo</option>
            <option value="Paciente">Paciente</option>
          </select>
          <p v-if="userModel.errors.rol" class="error-message">{{ userModel.errors.rol }}</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="button-cta">Enviar Registro</button>
          <button type="button" class="button-secondary" @click="resetForm">Borrar Campos</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { defineComponent } from 'vue';

import { User } from '@/models/User';
import { registroService } from '@/services/RegistroService';

export default defineComponent({
  name: 'RegistroView',

  data() {
    return {

      userModel: new User({}),
    };
  },

  methods: {
    async handleSubmit() {

      if (this.userModel.isValid()) {

        try {
          const response = await registroService.registerUser(this.userModel);

          alert('¡Registro exitoso! Redirigiendo...');


        } catch (error) {
          console.error("Error de registro:", error);
          alert('Error de registro. Revisa la consola.');
        }

      } else {
        console.log('Validación fallida. Errores:', this.userModel.errors);
      }
    },

    resetForm() {
      this.userModel = new User({});
      alert('Campos borrados.');
    }
  },
});
</script>

<style scoped>

.registro-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}
.page-heading {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
}
.card-container {
  max-width: 500px;
  width: 100%;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: background-color 0.5s;
  background-color: var(--color-background-soft);
}
.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-heading);
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.3s, background-color 0.3s;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--nfip-c-green-health);
}
.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
.button-cta {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}
.button-cta:hover {
  background-color: var(--nfip-c-orange-soft);
}
.button-secondary {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}
.button-secondary:hover {
  background-color: var(--nfip-c-green-dark);
}
</style>