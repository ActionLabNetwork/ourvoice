<template>
  <div class="mx-auto w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <div class="pt-10 pl-10">
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
