<template>
  <div class="flex bg-slate-100 p-2 rounded-lg drop-shadow-lg" v-for="post in posts" :key="post.id">
    <PostCard :post="post" />
  </div>
</template>
<script lang="ts">
import PostCard from '@/components/post/PostCard.vue'
export default {
  name: 'PostTile',
  props: {
    posts: {
      type: Object,
      required: true
    }
  },
  components: {
    PostCard
  },
  setup() {
    return {}
  }
}
</script>
