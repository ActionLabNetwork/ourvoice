<template>
  <div class="min-h-screen w-full bg-gray-100">
    <main class="bg-gray-100">
      <div class="mx-auto py-6 sm:px-6 lg:px-28">
        <Suspense><CommentModeration /></Suspense>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import CommentModeration from '@/components/comment/moderation/CommentModeration.vue'
</script>
