<template>
  <div class="my-1">
    <div class="my-3 flex items-center tracking-wide">
      <div v-if="totalCount" class="text-xs lg:text-sm text-gray-500 font-semibold">
        {{ totalCount }} Comments
      </div>
    </div>

    <div class="space-y-10">
      <CommentCard v-for="comment in comments" :key="comment.id" :comment-id="comment.id" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import CommentCard from './CommentCard.vue'
import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'

const commentsStore = useCommentsStore()
const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
})

commentsStore.fetchComments(props.postId ?? null)
const { data, totalCount } = storeToRefs(commentsStore)
const comments = computed(() => data.value.filter((comment) => comment.post.id === props.postId))
</script>
