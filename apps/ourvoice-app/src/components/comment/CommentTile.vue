<template>
  <div class="text-gray-500 dark:text-gray-300 my-10">
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
        <img v-for="comment in commentsStore.getCommentsByPostId(postId).slice(-2).reverse()" :key="comment.id"
          class="rounded-full w-6 h-6 border border-white"
          :src="`https://api.multiavatar.com/${comment.author.nickname}.png`" alt="" />
      </div>
      <div class="text-xs md:text-sm text-gray-500 dark:text-gray-300 font-semibold">
        999 Comments -
        <span class="text-indigo-400 hover:cursor-pointer">
          {{ showCommentList ? 'Hide Comments' : 'Show Comments' }}
        </span>
      </div>
    </div>

    <div class="space-y-10" v-show="showCommentList">
      <CommentCard v-for="comment in commentsStoreRef.data.value
        .filter((comment) => comment.post.id === postId)
        .reverse()" :key="comment.id" :comment="comment" @delete="(commentId) => deleteComment(commentId)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CommentCard from './CommentCard.vue'
import CommentTextarea from './CommentTextarea.vue'
import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'

defineProps({
  postId: {
    type: Number,
    required: true
  }
})

const commentsStore = useCommentsStore()
commentsStore.fetchComments()
const commentsStoreRef = storeToRefs(commentsStore)
const showCommentList = ref(true)
const deleteComment = (commentId: number) => {
  console.log(commentId)
}


</script>
