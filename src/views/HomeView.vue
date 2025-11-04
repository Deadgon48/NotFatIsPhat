<template>
  <div class="home-view-landing">

    <h1 class="page-heading">👋 ¡Bienvenido a NoFatIsPhat!</h1>

    <div class="card-menu-auth">

      <div class="auth-card soft-background">
        <h3>👥 Regístrate Hoy</h3>
        <p>
          Comienza tu camino hacia una vida más saludable. Ingresa tus datos para crear una cuenta.
        </p>
        <router-link to="/registro" class="button-cta register-link">
          Crear Cuenta
        </router-link>
      </div>

      <div class="auth-card mute-background">
        <h3>📝 ¿Ya tienes una cuenta?</h3>
        <p>
          Inicia sesión con tu correo electrónico y contraseña para acceder a tu panel de control.
        </p>
        <router-link to="/ingresar" class="button-secondary login-link">
          Iniciar Sesión
        </router-link>
      </div>

    </div>

    <div class="motivation-section">
      <h2>No Fat Is Phat (NFIP)</h2>
      <p>Tu plataforma inteligente para el seguimiento nutricional y el logro de metas de fitness. ¡La salud es el verdadero lujo!</p>
    </div>

  </div>
</template>

<style scoped>
/* Las variables se acceden a través de la herencia del :root y el CSS de tu app */

.home-view-landing {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  padding: 1rem;
}

.page-heading {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: var(--color-heading);
}

.card-menu-auth {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 3rem;
}

.auth-card {
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.auth-card h3 {
  color: var(--color-heading);
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.auth-card p {
  color: var(--color-text);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.button-cta {
  background-color: var(--nfip-c-orange-energy);
  color: var(--vt-c-white);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  display: inline-block;
  transition: background-color 0.3s;
}

.button-cta:hover {
  background-color: var(--nfip-c-orange-soft);
}

.button-secondary {
  background-color: var(--nfip-c-green-health);
  color: var(--vt-c-white);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  display: inline-block;
  transition: background-color 0.3s;
}

.button-secondary:hover {
  background-color: var(--nfip-c-green-dark);
}

.motivation-section {
  padding: 2rem;
  border-radius: 12px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

@media (max-width: 600px) {
  .card-menu-auth {
    grid-template-columns: 1fr;
  }
}


.soft-background {
  background-color: var(--color-background-soft);
}

.mute-background {
  background-color: var(--color-background-mute);
}

</style>