<template>
  <div class="text-gray-500 my-1">
    <CommentTextarea
      @submit="
        (comment) => {
          commentsStore.createComment({
            content: comment,
            postId: postId,
            authorId: 3,
            parentId: undefined
          })
        }
      "
    />

    <div class="my-3 flex items-center tracking-wide">
      <div v-if="comments?.length" class="text-xs lg:text-sm text-gray-500 font-semibold">
        {{ noOfComments }} Comments
      </div>
    </div>

    <div class="space-y-10">
      <CommentCard v-for="comment in comments" :key="comment.node.id" :comment="comment.node" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommentCard from './CommentCard.vue'
import CommentTextarea from './CommentTextarea.vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_COMMENTS_BY_POST_ID_QUERY } from '@/graphql/queries/getComments'
import { computed } from 'vue'
import { useCommentsStore } from '@/stores/comments'
const commentsStore = useCommentsStore()
const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  noOfComments: {
    type: Number,
    required: false
  }
})
const { result } = useQuery(GET_COMMENTS_BY_POST_ID_QUERY, {
  pagination: {
    limit: 100,
    cursor: null
  },
  filter: {
    postId: props.postId
  }
})

const comments = computed(() => {
  return result?.value?.comments?.edges ?? []
})
</script>
