<template>
    <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
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

