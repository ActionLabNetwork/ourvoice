<template>
  <button
    @click="handleBackBtnClicked"
    class="inline-flex font-semibold items-center gap-2 transform duration-200 hover:gap-[13px]"
  >
    <IconArrowLeft />
    Go Back
  </button>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import IconArrowLeft from '../icons/IconArrowLeft.vue'
const router = useRouter()
const handleBackBtnClicked = () => {
  router.back()
}
</script>
