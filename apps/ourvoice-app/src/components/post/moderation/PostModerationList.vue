<template>
  <div class="moderation-page py-5">
    <div v-for="post in props.posts" :key="post.id" class="py-3">
      <div v-if="props.posts.length === 0">
        <p class="text-lg text-gray-600">No posts to display...</p>
      </div>

      <div v-else>
        <ModerationPostCard :post="post" :version="post.versions[0]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import ModerationPostCard from './ModerationPostCard.vue'
import type { ModerationPost } from '@/stores/moderation-posts'

const props = defineProps({
  posts: { type: Array as PropType<ModerationPost[]>, required: true }
})
</script>

<style scoped>
.moderation-page {
  max-width: 70rem;
  margin: 0 auto;
}
</style>
