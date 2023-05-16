<template>
  <div class="flex-shrink-0 mr-0">
    <img
      class="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:cursor-pointer"
      :src="`https://api.multiavatar.com/${post.author.nickname}.png`"
      :title="post.author.nickname"
    />
  </div>
  <div class="flex-1 rounded-lg p-2 leading-relaxed">
    <div class="bg-white dark:bg-ourvoice-blue px-4 py-2 rounded-lg">
      <!-- <strong>{{ post.author.nickname }}</strong> -->

      <h1 class="text-lg md:text-xl font-bold">Title: {{ post.title }}</h1>
      <p class="text-sm md:text-md py-2">
        {{ post.content }}
      </p>

      <div class="flex text-gray-500 dark:text-gray-300">
        <div
          class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
          @click="showCommentTextarea = !showCommentTextarea"
        >
          <font-awesome-icon icon="fa-solid fa-comment" />
          <span class="hidden sm:inline-block px-1"> Comment </span>
        </div>
        <div
          class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-thumbs-up" />
          <span class="hidden sm:inline-block px-1"> Vote up </span>
        </div>
        <div
          class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-thumbs-down" />
          <span class="hidden sm:inline-block px-1"> Vote down </span>
        </div>
        <div class="text-right ml-auto">
          <span class="text-xs md:text-md">{{ timePassed(post.createdAt) }}</span>
        </div>
      </div>
    </div>

    <CommentTextarea v-if="showCommentTextarea" @submit="(payload) => createComment(payload)" />

    <CommentTile :postId="post.id" />
  </div>
</template>

<script lang="ts">
import { timePassed } from '@/utils'
import { ref } from 'vue'
import CommentTile from '../comment/CommentTile.vue'
import CommentTextarea from '../comment/CommentTextarea.vue'
import { useCommentsStore } from '@/stores/comments'

export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentTile,
    CommentTextarea
  },
  setup(props) {
    const commentsStore = useCommentsStore()

    const showCommentTextarea = ref(false)
    const createComment = (payload: string) => {
      console.log('createPost')
      commentsStore.createComment({
        //TODO: get authorId from auth
        authorId: 3,
        content: payload,
        postId: props.post.id,
        parentId: undefined
      })
      showCommentTextarea.value = false
    }
    return {
      showCommentTextarea,
      createComment,
      timePassed
    }
  }
}
</script>
