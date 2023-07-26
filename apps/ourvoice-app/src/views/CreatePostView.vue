<template>
  <div class="mx-auto w-full h-screen bg-gray-200 overflow-y-auto">
    <div class="mb-5 pt-5 pl-5 md:pt-10 md:pl-10">
      <BackButton />
    </div>
    <Suspense>
      <CreatePost />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import BackButton from '@/components/common/BackButton.vue'
</script>
