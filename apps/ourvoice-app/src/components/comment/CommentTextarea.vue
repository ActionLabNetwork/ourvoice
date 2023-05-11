<template>
  <div class="flex mt-2 md:mt-4 text-sm md:text-md">
    <div class="flex-shrink-0 mr-3">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8"
        src="https://api.multiavatar.com/user3.png"
        title="usr999"
      />
    </div>
    <div class="flex-1">
      <form action="">
        <textarea
          v-model="content"
          class="w-full max-h-20 rounded-lg p-2 drop-shadow-md bg-gray-200"
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
      <!-- <div class="text-right">
        <button class="bg-indigo-400 text-white px-4 rounded-lg hover:bg-indigo-500">Submit</button>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  name: 'CommentTextarea',
  emits: ['submit'],
  setup(props, ctx) {
    const content = ref('')
    const submit = () => {
      ctx.emit('submit', content.value)
      content.value = ''
    }
    return {
      submit,
      content
    }
  }
}
</script>
