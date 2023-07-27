<template>
  <div class="flex flex-col w-full h-screen">
    <div
      class="sticky top-0 z-30 transition-transform duration-500 ease-in-out"
      :class="{ '-translate-y-full': isNavbarHidden, 'translate-y-0': !isNavbarHidden }"
    >
      <div>
        <Navbar />
      </div>
    </div>
    <ConsentModal />
    <div class="z-20 flex-grow">
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/common/Navbar.vue'
import ConsentModal from './components/common/ConsentModal.vue'
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

/* Fade Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
