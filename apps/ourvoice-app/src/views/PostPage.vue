<template>
  <Suspense>
    <div class="w-full overflow-y-scroll max-w-4xl mx-auto px-4">
      <PostCard :postId="postId">
        <div></div>
      </PostCard>
      <CommentList :postId="postId" />
    </div>
  </Suspense>
</template>

<script lang="ts" setup>
import PostCard from '@/components/post/PostCard.vue'
import CommentList from '@/components/comment/CommentList.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const postId = computed(() => Number(route.params.id))
await usePostsStore().fetchPostById(postId.value)
</script>
