<template>
  <div class="min-h-screen w-full bg-gray-100">
    <Header title="Comment Moderation" />
    <main class="bg-gray-100">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Suspense><CommentModeration /></Suspense>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import CommentModeration from '@/components/comment/moderation/CommentModeration.vue'
</script>
