<template>
  <div class="flex flex-col overflow-y-auto relative border-r" ref="scrollContainer">
    <PostSortFilter />
    <div v-for="post in posts" :key="post.id">
      <PostCard :postId="post.id" @click="showCommentList(post.id)" />
    </div>
    <div v-if="state == 'loading-initial'" class="flex flex-col">
      <div
        v-for="i in 3"
        :key="i"
        class="max-w-4xl w-full h-[160px] mx-auto mx-6 my-6 rounded-xl skeleton"
      />
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

const showCommentList = (postId: number) => {
  // might add certain click logic here
  // console.log('postId:', postId, 'clicked')
}
</script>
