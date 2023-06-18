<template>
  <Suspense>
    <div class="w-full overflow-y-auto grid grid-cols-3">
      <div class="col-span-3 overflow-y-auto relative border-r">
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
import { usePostsStore } from '@/stores/posts'
import { useCategoriesStore } from '@/stores/categories'
useCategoriesStore().fetchCategories()
import { storeToRefs } from 'pinia'
import PostCard from '@/components/post/PostCard.vue'
const postStore = usePostsStore()
const { data } = storeToRefs(postStore)
// postStore.fetchPosts()

const showCommentList = (postId: number) => {
  // might add certain click logic here
  console.log('postId:', postId, 'clicked')
}
</script>
