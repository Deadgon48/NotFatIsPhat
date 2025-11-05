<template>
  <header>
    <div class="div-logo">

      <img class="logo" src="./assets/LogoNoFatIsPhat.png" alt="Logo de NoFatIsPhat"/>

      <h1 class="app-logo green">NoFatIsPhat</h1>
    </div>

    <nav>
      <a href="/">Home</a>
      <a href="/profile">Perfil</a>
      <a href="/settings">Ajustes</a>
    </nav>
  </header>

  <main>
    <router-view />
  </main>



</template>

<style scoped>

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);

  width: 100%;
  margin: 0 auto;
  max-width: 1280px;
}

.app-logo {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 1rem;
}

nav a {
  margin-left: 0.5rem;
}

main {
  padding: 0;
}

.logo {
  max-width:4rem;
  margin-bottom: 1rem;
}
.div-logo{
  display: flex;

}

</style>
<script setup lang="ts">
</script>