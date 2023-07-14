<template>
  <Suspense>
    <div class="overflow-y-auto">
      <div class="sticky top-0 pt-5 pl-5">
        <BackButton />
      </div>
      <div class="max-w-5xl w-full mx-auto px-5">
        <PostCard :postId="postId">
          <div></div>
        </PostCard>
        <CommentList :postId="postId" />
      </div>
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
