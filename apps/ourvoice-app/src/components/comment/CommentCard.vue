<template>
  <div class="flex">
    <div class="flex-shrink-0 mr-3">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8"
        src="https://api.multiavatar.com/BinxBond.png"
        alt=""
      />
    </div>
    <div class="flex-1">
      <div class="bg-white rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
        <strong>user999</strong> <span class="text-xs text-gray-400">3:34 PM</span>
        <p class="text-xs sm:text-sm">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        </p>
      </div>
      <a class="text-sm text-gray-500 hover:text-blue-400" href="#" @click="showReply = !showReply">
        Comment
      </a>
      <CommentTextarea v-if="showReply" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import CommentTextarea from './CommentTextarea.vue'
export default {
  name: 'CommentCard',
  components: {
    CommentTextarea
  },

  setup() {
    const showReply = ref(false)
    return {
      showReply
    }
  }
}
</script>
