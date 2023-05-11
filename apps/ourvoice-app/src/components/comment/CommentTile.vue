<template>
  <div>
    <div class="my-3 flex items-center tracking-wide">
      <div class="flex -space-x-2 mr-2">
        <img
          v-for="comment in commentsStore.getCommentsByPostId(postId).slice(-2).reverse()"
          :key="comment.id"
          class="rounded-full w-6 h-6 border border-white"
          :src="`https://api.multiavatar.com/${comment.author.nickname}.png`"
          alt=""
        />
      </div>
      <!-- TODO: Commment Pagination -->
      <div class="text-xs md:text-sm text-gray-500 font-semibold">
        999 Comments -
        <span
          class="text-indigo-400 hover:cursor-pointer"
          @click="showCommentList = !showCommentList"
        >
          {{ showCommentList ? 'Hide Comments' : 'Show Comments' }}
        </span>
      </div>
    </div>
    <div class="space-y-4" v-show="showCommentList">
      <CommentCard
        v-for="comment in commentsStore.getCommentsByPostId(postId).slice().reverse()"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import CommentCard from './CommentCard.vue'
import { useCommentsStore } from '@/stores/comments'
export default {
  name: 'CommentTile',
  components: {
    CommentCard
  },
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  setup() {
    const showCommentList = ref(true)
    const commentsStore = useCommentsStore()
    commentsStore.fetchComments()
    return {
      showCommentList,
      commentsStore
    }
  }
}
</script>
