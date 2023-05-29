<template>
  <div class="min-h-screen w-full bg-gray-100">
    <Header title="Post Moderation" />
    <main class="bg-gray-100">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Suspense><PostModeration /></Suspense>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import PostModeration from '@/components/post/moderation/PostModeration.vue'
</script>
