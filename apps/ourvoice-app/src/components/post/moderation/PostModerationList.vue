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
import EmptyState from '@/components/common/EmptyState.vue'
import type { ModerationPost } from '@/stores/post-moderation'

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
