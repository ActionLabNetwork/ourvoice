<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <BackButton />
    <Suspense>
      <CreatePost />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import BackButton from '@/components/common/BackButton.vue'
</script>
