<template>
  <Suspense>
    <div class="w-full overflow-y-auto grid grid-cols-3">
      <div class="col-span-3 lg:col-span-2 overflow-y-auto">
        <div v-for="post in data" :key="post.id">
          <PostCard :postId="post.id" @click="showCommentList(post.id)" />
        </div>
      </div>
      <div class="hidden lg:block lg:col-span-1 overflow-y-auto">
        <CategoryFilter />
      </div>
      <div class="inset-0 bottom-0 h-5"></div>
    </div>
  </Suspense>
</template>
<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import PostCard from '@/components/post/PostCard.vue'
import CategoryFilter from '@/components/common/CategoryFilter.vue'
const postStore = usePostsStore()
const { data } = storeToRefs(postStore)
postStore.fetchPosts()

const showCommentList = (postId: number) => {
  // might add certain click logic here
  console.log('postId:', postId, 'clicked')
}
</script>
