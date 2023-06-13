<template>
  <div v-for="post in data" :key="post.id">
    <PostWrapper
      :id="post.id"
      :title="post.title"
      :content="post.content"
      :author="post.author"
      :categories="post.categories"
      :createdAt="post.createdAt"
      :moderatedAt="post.moderatedAt"
      :publishedAt="post.publishedAt"
      :votesUp="post.votesUp"
      :votesDown="post.votesDown"
      :comments="post.comments"
      :files="post.files"
    >
      <div>comments({{ post.comments.length }})</div>
    </PostWrapper>
  </div>
</template>
<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import PostWrapper from '@/components/post/PostWrapper.vue'
const postStore = usePostsStore()
const { data } = storeToRefs(postStore)
postStore.fetchPosts()
</script>
