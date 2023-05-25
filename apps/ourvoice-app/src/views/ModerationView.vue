<template>
  <div class="min-h-full w-full bg-gray-100">
    <Header title="Post Moderation" />
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Suspense><PostModeration  /></Suspense>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import PostModeration from '@/components/post/PostModeration.vue'

defineProps({
  deployment: String
})
</script>
