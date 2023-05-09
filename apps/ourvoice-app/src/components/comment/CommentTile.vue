<template>
  <div>
    <h4 class="mb-3 uppercase tracking-wide text-gray-500 font-bold text-md">comments</h4>
    <div class="space-y-4">
      <CommentCard v-for="a in [1, 2]" :key="a" />
    </div>
    <CommentTextarea />
  </div>
</template>

<script lang="ts">
import CommentCard from './CommentCard.vue'
import CommentTextarea from './CommentTextarea.vue'
export default {
  name: 'CommentTile',
  components: {
    CommentCard,
    CommentTextarea
  },
  setup() {
    return {}
  }
}
</script>
