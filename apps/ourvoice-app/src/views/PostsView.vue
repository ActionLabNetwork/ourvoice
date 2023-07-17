<template>
  <div class="flex flex-col overflow-y-scroll relative" ref="scrollContainer">
    <PostSortFilter />
    <div class="max-w-5xl w-full mx-auto px-5">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :postId="post.id"
        class="card card-outline card-hover my-6"
      />
    </div>
    <div v-if="state == 'loading-initial'" class="max-w-5xl w-full mx-auto px-5">
      <div v-for="i in 3" :key="i" class="h-[300px] card my-6 skeleton" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostSortFilter from '@/components/post/PostSortFilter.vue'
import PostCard from '@/components/post/PostCard.vue'
import { useScroll } from '@vueuse/core'
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import { ref, watchEffect } from 'vue'

const postStore = usePostsStore()
const { data: posts, state } = storeToRefs(postStore)
const scrollContainer = ref(null)
const { arrivedState } = useScroll(scrollContainer)

if (state.value == 'initial') {
  postStore.fetchPosts()
}

watchEffect(() => {
  if (arrivedState.bottom && state.value == 'loaded') {
    postStore.loadMorePosts()
  }
})
</script>
