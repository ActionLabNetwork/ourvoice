<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <Suspense>
      <PostModerationList />
      <template #fallback>
        <p>Loading...</p>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import PostModerationList from '../components/post/PostModerationList.vue'

defineProps({
  deployment: String
})
</script>
