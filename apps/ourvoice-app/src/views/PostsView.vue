<template>
  <div class="flex flex-col overflow-y-auto relative p-10">
    <PostSortFilter />
    <div class="max-w-5xl w-full mx-auto space-y-3">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :postId="post.id"
        class="card card-outline card-hover"
      />
      <EmptyState v-if="posts.length <= 0">No posts to display...</EmptyState>
      <button
        class="mx-auto block"
        v-if="postStore.pageInfo?.hasNextPage"
        @click="postStore.loadMorePosts()"
      >
        Load More
      </button>
    </div>
    <div v-if="state == 'loading-initial'" class="max-w-5xl w-full mx-auto space-y-3">
      <div v-for="i in 3" :key="i" class="h-[300px] card skeleton" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostSortFilter from '@/components/post/PostSortFilter.vue'
import PostCard from '@/components/post/PostCard.vue'
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import EmptyState from '../components/common/EmptyState.vue'
const postStore = usePostsStore()
const { data: posts, state } = storeToRefs(postStore)

if (state.value == 'initial') {
  postStore.fetchPosts()
}
</script>
