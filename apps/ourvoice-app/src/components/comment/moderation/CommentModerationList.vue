<template>
  <div class="moderation-page p-5">
    <div v-for="(comment) in props.comments" :key="comment.id" class="p-5">
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
import { onMounted, type PropType } from 'vue';
import ModerationCommentCard from './ModerationCommentCard.vue';
import type { ModerationComment } from '@/stores/moderation-comments';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  comments: { type: Array as PropType<ModerationComment[]>, required: true }
})

onMounted(() => {
  useUserStore().verifyUserSession()
})
</script>

<style scoped>
.moderation-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
