<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-1 md:mr-3">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8 hover:cursor-pointer"
        :src="`https://ui-avatars.com/api/?size=48?&name=${comment.author.nickname}`"
      />
    </div>
    <div class="flex-1">
      <b class="text-sm">
        {{ comment.author.nickname }} reply to
        <span class="text-blue-500 hover:underline hover:cursor-pointer">
          @{{ comment?.parent?.author?.nickname ?? 'original post' }}
        </span>
      </b>
      <div
        class="bg-white dark:bg-ourvoice-blue rounded-lg border drop-shadow-md pl-4 pr-2 py-2 leading-relaxed"
      >
        <div class="text-sm md:text-md py-2">
          <p class="break-all">
            <font-awesome-icon icon="fa-solid fa-quote-left" />
            {{ commentContent }}
            <font-awesome-icon icon="fa-solid fa-quote-right" />
          </p>
        </div>

        <div class="flex text-gray-500 dark:text-gray-300">
          <div
            class="hover:text-blue-500 dark:hover:hover:text-blue-500 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
            @click="showReply = !showReply"
          >
            <font-awesome-icon icon="fa-solid fa-comment" />
            <span class="hidden sm:inline-block px-1"> Reply</span>
          </div>
          <div
            class="hover:text-blue-500 dark:hover:hover:text-blue-500 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            <span class="hidden sm:inline-block px-1"> Vote up </span>
          </div>
          <div
            class="hover:text-blue-500 dark:hover:hover:text-blue-500 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            <span class="hidden sm:inline-block px-1"> Vote down </span>
          </div>
          <div class="ml-auto text-right">
            <span class="text-xs md:text-md">{{ timePassed(comment.createdAt) }}</span>
          </div>
        </div>
      </div>
      <CommentTextarea v-if="showReply" @submit="(payload) => createComment(payload)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { timePassed } from '@/utils'
import { ref } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import CommentTextarea from './CommentTextarea.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const commentStore = useCommentsStore()
const showReply = ref(false)
const commentContent = ref(props.comment.content)

const createComment = (payload: string) => {
  commentStore.createComment({
    authorId: 3,
    postId: props.comment.post.id,
    parentId: props.comment.id,
    content: payload
  })
  showReply.value = false
}
</script>
