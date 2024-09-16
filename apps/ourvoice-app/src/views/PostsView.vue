<template>
  <div class="flex flex-col overflow-y-auto relative p-4 md:p-10">
    <post-sort-filter />
    <div class="max-w-5xl w-full mx-auto space-y-3">
      <post-card
        v-for="post in posts"
        :key="post.id"
        class="card card-outline card-hover"
        :post-id="post.id"
      />
      <empty-state v-if="posts.length <= 0 && state === 'loaded'">
        No posts to display...
      </empty-state>
      <button
        v-if="postStore.pageInfo?.hasNextPage"
        class="mx-auto block"
        @click="postStore.loadMorePosts()"
      >
        Load More
      </button>
    </div>
    <div v-if="state === 'loading-initial'" class="max-w-5xl w-full mx-auto space-y-3">
      <div v-for="i in 3" :key="i" class="h-[300px] card skeleton" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import PostCard from '@/components/post/PostCard.vue'
import PostSortFilter from '@/components/post/PostSortFilter.vue'
import { usePostsStore } from '@/stores/posts'

import EmptyState from '../components/common/EmptyState.vue'

const postStore = usePostsStore()
const { data: posts, state } = storeToRefs(postStore)

if (state.value === 'initial') {
  postStore.fetchPosts()
}
</script>
