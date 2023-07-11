<template>
  <div class="my-1">
    <CommentTextarea @submit="(commentContent) => createComment(commentContent)" />
    <Toast
      :type="toastType"
      :message="toastMessage"
      class="fixed bottom-0 right-0"
      v-if="showToast"
      @click="showToast = false"
    />
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
import { computed, ref, watch } from 'vue'
import CommentCard from './CommentCard.vue'
import CommentTextarea from './CommentTextarea.vue'
import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import Toast from '../common/Toast.vue'
const userStore = useUserStore()

const commentsStore = useCommentsStore()

const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
})
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('warning')
const createComment = async (commentContent: string) => {
  {
    const res = await commentsStore.createComment({
      content: commentContent,
      postId: props.postId,
      authorHash: userStore.sessionHash,
      authorNickname: userStore.nickname,
      parentId: undefined
    })
    showToast.value = true
    if (res) {
      toastMessage.value = 'Comment created successfully, waitng for moderation'
      toastType.value = 'success'
    } else {
      toastMessage.value = 'Error creating comment'
      toastType.value = 'danger'
    }
  }
}
watch(showToast, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
})
commentsStore.fetchComments(props.postId ?? null)
const { data, totalCount } = storeToRefs(commentsStore)
const comments = computed(() => data.value.filter((comment) => comment.post.id === props.postId))
</script>
