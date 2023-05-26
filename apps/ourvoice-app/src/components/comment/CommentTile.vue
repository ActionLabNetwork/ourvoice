<template>
  <div class="text-gray-500 dark:text-gray-300 my-1">
    <CommentTextarea @submit="(comment) => {
      commentsStore.createComment({
        content: comment,
        postId: postId,
        authorId: 3,
        parentId: undefined
      })
    }" />

    <div class="my-3 flex items-center tracking-wide">
      <div class="flex -space-x-2 mr-2">
        <!-- <img v-for="comment in commentsStore.getCommentsByPostId(postId).slice(-2).reverse()" :key="comment.id"
          class="rounded-full w-6 h-6 border border-white"
          :src="`https://api.multiavatar.com/${comment.author.nickname}.png`" alt="" /> -->
      </div>
      <div class="text-xs md:text-sm text-gray-500 dark:text-gray-300 font-semibold">
        {{ noOfComments }} Comments
      </div>
    </div>

    <div class="space-y-10">
      <CommentCard v-for="comment in comments" :key="comment.node.id" :comment="comment.node" @delete="(commentId)=>deleteComment(commentId)"/>
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
    required: true
  }
})
const { result } = useQuery(GET_COMMENTS_BY_POST_ID_QUERY, {
  "pagination": {
    "limit": 5,
    "cursor": null
  },
  "filter": {
    "postId": props.postId
  }
})

const comments = computed(() => {
  return result?.value?.comments?.edges??[]
})

const deleteComment = (commentId: number) => {
  commentsStore.deleteComment(commentId)
}
</script>
