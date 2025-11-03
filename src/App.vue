<template>
  <header>
    <h1 class="app-logo green">NoFatIsPhat</h1>
    <nav>
      <a href="/inicio">Home</a>
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
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-border);

  width: 100%;
  margin: 0 auto;
  max-width: 1280px;
}

.app-logo {
  font-size: 1.5rem;
  font-weight: 900;
}

nav a {
  margin-left: 1.5rem;
}

main {
  padding: 0;
}
</style>