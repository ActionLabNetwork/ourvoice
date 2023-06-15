<template>
  <div class="flex mt-2 md:mt-4 text-sm md:text-md">
    <div class="flex-shrink-0 mr-3">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8"
        :src="`https://ui-avatars.com/api/?size=48?&name=${userStore.nickname}`"
        title="usr999"
      />
    </div>
    <div class="flex-1">
      <form action="">
        <textarea
          v-model="content"
          class="w-full max-h-20 rounded-lg p-2 border border-black"
          maxlength="255"
          name=""
          id=""
          cols="30"
          rows="10"
          required
          placeholder="Write a comment..."
          @keydown.enter.exact.prevent="submit"
        ></textarea>
      </form>
      <p class="text-gray-500">press enter to post</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const emits = defineEmits(['submit'])
const content = ref('')
const submit = () => {
  emits('submit', content.value)
  content.value = ''
}
</script>
