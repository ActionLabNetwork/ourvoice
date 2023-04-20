<template lang="">
  <div class="mx-auto p-5 bg-gray-200 min-w-full">
    <CreatePost />
  </div>
</template>

<script lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { CreatePost },
})
</script>

