<template>
  <div>
    {{ $route.params.id }}
  </div>
  <!-- <PostWrapper
    class="drop-shadow-md"
    :id="posts[postIndex].node?.id"
    :title="posts[postIndex].node?.title"
    :content="posts[postIndex].node?.content"
    :author="posts[postIndex].node?.author"
    :votesUp="posts[postIndex].node?.votesUp"
    :votesDown="posts[postIndex].node?.votesDown"
    :comments="posts[postIndex].node?.comments"
    :createdAt="posts[postIndex].node?.createdAt"
    :publishedAt="posts[postIndex].node?.publishedAt"
    :moderatedAt="posts[postIndex].node?.moderatedAt"
    :updatedAt="posts[postIndex].node?.updatedAt"
    :files="posts[postIndex].node?.files"
    :categories="posts[postIndex].node?.categories"
  >
    <div></div>
  </PostWrapper> -->
</template>

<script lang="ts" setup>
import PostWrapper from '@/components/post/PostWrapper.vue'
</script>
