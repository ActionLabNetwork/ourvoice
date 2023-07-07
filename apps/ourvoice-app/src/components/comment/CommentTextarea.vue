<template>
  <div class="flex mt-2 md:mt-4 text-sm md:text-md gap-3" ref="commentWrapper">
    <div class="flex-none">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8"
        :src="`https://ui-avatars.com/api/?size=48?&name=${userStore.nickname}`"
      />
    </div>
    <div class="flex-1">
      <textarea
        v-model="input"
        class="rounded-xl p-5 bg-gray-100 resize-none w-full focus:outline-none max-h-40"
        :class="[{ 'placeholder:opacity-50': focused }]"
        @focus="handleFocus"
        maxlength="255"
        placeholder="Add a comment..."
        ref="textarea"
      />
      <div class="flex">
        <span v-if="showErrorMessage" class="text-xs text-red-500"> Content cannot be empty </span>
        <span class="flex-1"></span>
        <span v-if="focused || input" class="text-xs text-blue-500"
          >{{ input?.length ?? 0 }}/255</span
        >
      </div>
    </div>

    <div v-if="focused || input" class="flex-none mt-2">
      <button
        class="bg-yellow-400 hover:bg-yellow-500 py-3 px-4 rounded-full text-sm"
        @click="submit"
      >
        Send
      </button>
    </div>
  </div>
  <!-- {{ typeof input }} -->
  <!-- {{ focused }} -->
  <!-- {{ contentValid }} -->
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTextareaAutosize } from '@vueuse/core'
import { useFocusWithin } from '@vueuse/core'
const userStore = useUserStore()
const emits = defineEmits(['submit'])
const commentWrapper = ref<HTMLElement | null>(null)
const { textarea, input } = useTextareaAutosize()
const { focused } = useFocusWithin(commentWrapper)

const contentValid = computed(() => input.value?.trim().length > 0 && input.value != undefined)
const showErrorMessage = ref(false)

const handleFocus = () => {
  showErrorMessage.value = false
}
watch(focused, (val) => {
  if (!val) {
    showErrorMessage.value = false
  }
})

const submit = () => {
  if (!contentValid.value) {
    showErrorMessage.value = true
    return
  }
  emits('submit', input.value)
  input.value = ''
}
</script>
