<template>
  <button
    @click="handleBackBtnClicked"
    class="inline-flex font-semibold items-center gap-2 transform duration-200 hover:gap-[13px]"
  >
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 7H2M7 1L1.70711 6.29289C1.31658 6.68342 1.31658 7.31658 1.70711 7.70711L7 13"
        stroke="#111111"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    Go Back
  </button>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const handleBackBtnClicked = () => {
  router.back()
}
</script>
