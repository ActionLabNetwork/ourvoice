<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-1 md:mr-3">
      <img class="rounded-full w-6 h-6 sm:w-8 sm:h-8 hover:cursor-pointer"
        :src="`https://api.multiavatar.com/${comment.author.nickname}.png`" :title="comment.author.nickname" />
    </div>
    <div class="flex-1">
      <div class="bg-slate-200 dark:bg-ourvoice-blue rounded-lg drop-shadow-lg pl-4 pr-2 py-2 leading-relaxed">
        <!-- <strong>{{ comment.author.nickname }}</strong> -->
        <div class="text-sm md:text-md py-2">
          <div v-if="commentEditing">
            <form @submit.prevent="handleUpdate" @reset="abortUpdate">
              <div class="flex">
                <div class="flex-auto">
                  <textarea required ref="editingInput" type="text" v-model="commentContent"
                    class="border-indigo-300 border-2 rounded-lg px-2 py-1 w-full"></textarea>
                </div>
                <div class="flex-none m-auto">
                  <button type="submit"
                    class="bg-green-400 hover:bg-green-500 text-white px-1 md:p-2 m-1 rounded-full md:rounded-lg">
                    <font-awesome-icon icon="fa-solid fa-check" class="md:hidden" />
                    <span class="hidden md:inline-block">update</span>
                  </button>
                </div>
                <div class="flex-none m-auto">
                  <button type="reset"
                    class="bg-red-400 hover:bg-red-500 text-white px-1 md:p-2 m-1 rounded-full md:rounded-lg">
                    <font-awesome-icon icon="fa-solid fa-xmark" class="md:hidden" />
                    <span class="hidden md:inline-block">cancel</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div v-else>
            {{ commentContent }}
          </div>
        </div>

        <div class="flex text-gray-500 dark:text-gray-300">
          <div
            class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
            @click="showReply = !showReply">
            <font-awesome-icon icon="fa-solid fa-comment" />
            <span class="hidden sm:inline-block px-1"> Reply</span>
          </div>
          <div
            class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer">
            <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            <span class="hidden sm:inline-block px-1"> Vote up </span>
          </div>
          <div
            class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer">
            <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            <span class="hidden sm:inline-block px-1"> Vote down </span>
          </div>
          <div class="ml-auto text-right">
            <span class="text-xs md:text-md">{{ timePassed(comment.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-none m-auto">
      <div class="text-xs sm:text-sm text-gray-500 hover:text-indigo-400 p-2" @click="commentEditing = !commentEditing"
        v-if="comment.author.id == 3 && !commentEditing">
        <font-awesome-icon icon="fa-solid fa-edit" size="lg" />
      </div>
    </div>
    <div class="flex-none m-auto">
      <div class="text-xs sm:text-sm text-gray-500 hover:text-red-400 p-2" @click="deleteComment"
        v-if="comment.author.id == 3">
        <font-awesome-icon icon="fa-solid fa-trash" size="lg" />
      </div>
    </div>
  </div>
  <CommentTextarea v-if="showReply" @submit="(payload) => createComment(payload)" />
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

const emits = defineEmits(['delete'])

const commentStore = useCommentsStore()
const showReply = ref(false)
const commentEditing = ref(false)
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

const handleUpdate = async () => {
  commentEditing.value = !commentEditing.value
  await commentStore.updateComment({
    id: props.comment.id,
    data: {
      content: commentContent.value,
      authorId: props.comment.author.id,
      published: false,
      moderated: false
    }
  })
}

const abortUpdate = () => {
  commentEditing.value = false
  commentContent.value = props.comment.content
}

const deleteComment = async () => {
  console.log('delete comment', props.comment.id)
  await commentStore.deleteComment(props.comment.id)
  emits('delete', props.comment.id)
}
</script>
