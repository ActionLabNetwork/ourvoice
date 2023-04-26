<template>
    <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
      <CreatePost />
    <CreateComment />
    </div>
</template>

<script lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import CreateComment from '../components/comment/CreateComment.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    CreatePost,
    CreateComment
  }
})
</script>
