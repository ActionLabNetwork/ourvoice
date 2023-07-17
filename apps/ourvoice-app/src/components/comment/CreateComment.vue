<template>
  <div class="flex mt-2 md:mt-4 text-sm md:text-md gap-3" ref="commentWrapper">
    <div class="flex-none" v-if="props.showAvatar">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8"
        :src="`https://ui-avatars.com/api/?size=48?&name=${userStore.nickname}`"
      />
    </div>
    <div class="flex-1">
      <textarea
        v-model="input"
        class="rounded-3xl px-4 py-3 bg-stone-300/25 resize-none w-full focus:outline-none max-h-40 hover:cursor-pointer focus:cursor-auto"
        :class="[{ 'placeholder:opacity-50': focused }]"
        @focus="handleFocus"
        maxlength="255"
        placeholder="Add a comment..."
        ref="textarea"
      />
      <div class="flex">
        <span v-if="showErrorMessage" class="text-xs text-red-500"> Content cannot be empty </span>
        <span class="flex-1"></span>
        <!-- <span v-if="focused || input" class="text-xs text-blue-500"
          >{{ input?.length ?? 0 }}/255</span
        > -->
      </div>
    </div>

    <div v-if="focused || input" class="flex-none">
      <button
        class="bg-yellow-400 hover:bg-yellow-500 py-3 px-4 rounded-full text-sm"
        @click="handleSubmit"
      >
        Send
      </button>
    </div>
    <Toast
      :type="toastType"
      :message="toastMessage"
      class="fixed bottom-0 right-0"
      v-if="showToast"
      @click="showToast = false"
    />
  </div>
</template>
<script setup lang="ts">
import Toast from '@/components/common/Toast.vue'
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCommentsStore } from '@/stores/comments'
import { useTextareaAutosize } from '@vueuse/core'

const { textarea, input } = useTextareaAutosize()
import { useFocusWithin } from '@vueuse/core'

const commentsStore = useCommentsStore()
const userStore = useUserStore()

const props = defineProps({
  postId: {
    type: Number || undefined
  },
  commentId: {
    type: Number || undefined
  },
  showAvatar: {
    type: Boolean,
    required: false,
    default: false
  }
})
const commentWrapper = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(commentWrapper)
const contentValid = computed(() => input.value?.trim().length > 0 && input.value != undefined)

const showErrorMessage = ref(false)
const toastType = ref('warning')
const showToast = ref(false)
const toastMessage = ref('')

const handleFocus = () => {
  showErrorMessage.value = false
}
watch(focused, (val) => {
  if (!val) {
    showErrorMessage.value = false
  }
})
const handleSubmit = async () => {
  if (!contentValid.value) {
    showErrorMessage.value = true
    return
  }

  const res = await commentsStore.createComment({
    authorHash: userStore.sessionHash,
    authorNickname: userStore.nickname,
    postId: props.postId,
    parentId: props.commentId,
    content: input.value
  })
  showToast.value = true
  if (res) {
    toastMessage.value = 'Comment created successfully, waitng for moderation'
    toastType.value = 'success'
  } else {
    toastMessage.value = 'Error creating comment'
    toastType.value = 'danger'
  }
  watch(showToast, (newValue) => {
    if (newValue) {
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }
  })
  // TODO remove this
  console.log({
    postId: props.postId,
    parentId: props.commentId,
    content: input.value
  })
  input.value = ''
}
</script>
