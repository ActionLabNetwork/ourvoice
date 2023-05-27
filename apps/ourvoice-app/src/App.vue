<template>
  <div class="flex flex-col w-full">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/common/Navbar.vue'
</script>
<style>
@import '@/assets/main.css';

#app {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  font-weight: normal;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 5fr;
  }
}
</style>
