<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <Suspense><PostModeration  /></Suspense>
  </div>
</template>

<script setup lang="ts">
import PostModeration from '../components/post/PostModeration.vue'

defineProps({
  deployment: String
})
</script>
