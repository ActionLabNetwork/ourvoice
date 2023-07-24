<template>
  <div class="moderation-page py-5">
    <div v-for="comment in props.comments" :key="comment.id" class="py-3">
      <div v-if="props.comments.length === 0">
        <p class="text-lg text-gray-600">No comments to display...</p>
      </div>

      <div v-else>
        <ModerationCommentCard :comment="comment" :version="comment.versions[0]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import ModerationCommentCard from './ModerationCommentCard.vue'
import type { ModerationComment } from '@/stores/moderation-comments'

const props = defineProps({
  comments: { type: Array as PropType<ModerationComment[]>, required: true }
})
</script>

<style scoped>
.moderation-page {
  max-width: 70rem;
  margin: 0 auto;
}
</style>
