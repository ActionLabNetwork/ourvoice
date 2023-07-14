<template>
  <Suspense>
    <div class="overflow-y-auto p-10">
      <BackButton />
      <PostCard :postId="postId">
        <div></div>
      </PostCard>
      <CommentList :postId="postId" />
    </div>
  </Suspense>
</template>

<script lang="ts" setup>
import BackButton from '@/components/common/BackButton.vue'
import PostCard from '@/components/post/PostCard.vue'
import CommentList from '@/components/comment/CommentList.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const postId = computed(() => Number(route.params.id))
await usePostsStore().fetchPostById(postId.value)
</script>
