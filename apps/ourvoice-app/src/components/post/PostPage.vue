<template>
  <Suspense>
    <div>
      <PostCard :postId="postId">
        <div></div>
      </PostCard>
      <CommentList class="max-w-4xl mx-auto" :postId="postId" />
    </div>
  </Suspense>
</template>

<script lang="ts" setup>
import PostCard from './PostCard.vue'
import CommentList from '../comment/CommentList.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const postId = computed(() => Number(route.params.id))
await usePostsStore().fetchPostById(postId.value)
</script>
