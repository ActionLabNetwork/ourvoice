<template>
  <Suspense>
    <div class="w-full overflow-y-hidden grid grid-cols-3">
      <div class="col-span-3 overflow-y-auto relative border-r" ref="scrollContainer">
        <PostSortFilter />
        <div v-for="post in data" :key="post.id">
          <PostCard :postId="post.id" @click="showCommentList(post.id)" />
        </div>
      </div>
    </div>
  </Suspense>
</template>
<script lang="ts" setup>
import PostSortFilter from '@/components/post/PostSortFilter.vue'
import PostCard from '@/components/post/PostCard.vue'
import { useScroll } from '@vueuse/core'
import { usePostsStore } from '@/stores/posts'
import { useCategoriesStore } from '@/stores/categories'
import { storeToRefs } from 'pinia'
import { ref, watchEffect } from 'vue'

//load categories
useCategoriesStore().fetchCategories()

//use posts store
const postStore = usePostsStore()
const { data, loading } = storeToRefs(postStore)
if (!loading) {
  postStore.fetchPosts()
}

//setup scroll behaviour for loading more posts
const scrollContainer = ref<HTMLElement | null>(null)
const { arrivedState } = useScroll(scrollContainer)
watchEffect(() => {
  if (arrivedState.bottom) {
    postStore.loadMorePosts()
  }
})

const showCommentList = (postId: number) => {
  // might add certain click logic here
  console.log('postId:', postId, 'clicked')
}
</script>
