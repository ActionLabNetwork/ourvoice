<template>
  <div>
    <Suspense>
      <PostCard v-for="post in data" :key="post.id" :postId="post.id" />
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import PostCard from '@/components/post/PostCard.vue'
const postStore = usePostsStore()
const { data } = storeToRefs(postStore)
postStore.fetchPosts()
</script>
