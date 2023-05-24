<template>
  <div class="min-h-full w-full bg-gray-100">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900"> Post Moderation</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <!-- Your content -->
        <Suspense><PostModeration  /></Suspense>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import PostModeration from '../components/post/PostModeration.vue'

defineProps({
  deployment: String
})
</script>
