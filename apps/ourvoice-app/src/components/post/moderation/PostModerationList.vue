<template>
  <div class="moderation-page py-5">
    <div v-if="props.posts.length <= 0">
      <EmptyState>No posts to display...</EmptyState>
    </div>
    <div v-else>
      <div v-for="post in props.posts" :key="post.id" class="py-3">
        <ModerationPostCard :post="post" :version="post.versions[0]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import ModerationPostCard from './ModerationPostCard.vue'
import type { ModerationPost } from '@/stores/moderation-posts'
import EmptyState from '@/components/comment/EmptyState.vue'

const props = defineProps({
  posts: { type: Array as PropType<ModerationPost[]>, required: true }
})

console.log('hello')
console.log(props.posts.length)
</script>

<style scoped>
.moderation-page {
  max-width: 70rem;
  margin: 0 auto;
}
</style>
