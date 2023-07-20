<template>
  <div class="flex flex-col w-full">
    <div
      class="sticky top-0 z-30 transition-transform duration-500 ease-in-out"
      :class="{ '-translate-y-full': isNavbarHidden, 'translate-y-0': !isNavbarHidden }"
    >
      <div>
        <Navbar />
      </div>
    </div>
    <div class="z-20">
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/common/Navbar.vue'
import { useScrollHide } from '@/composables/useScrollHide'

const { isElementHidden: isNavbarHidden } = useScrollHide()
</script>
<style>
@import '@/assets/main.css';

#app {
  width: 100vw;
  height: fit-content;
  margin: 0 auto;
  font-weight: normal;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: flex;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
