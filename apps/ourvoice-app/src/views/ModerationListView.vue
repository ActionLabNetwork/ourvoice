<template>
  <div class="w-full h-full bg-gray-100">
    <Header title="Moderation Posts List" />
    <div class="px-10 py-10">
      <BaseTab>
        <template #pending>
          <PostModerationList :posts="moderationPosts.PENDING" />
        </template>
        <template #approved>
          <PostModerationList :posts="moderationPosts.APPROVED" />
        </template>
        <template #rejected>
          <PostModerationList :posts="moderationPosts.REJECTED" />
        </template>
      </BaseTab>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import PostModerationList from '@/components/post/moderation/PostModerationList.vue'
import BaseTab from '@/components/common/BaseTab.vue'

import { computed, onMounted } from 'vue';
import { useModerationPostsStore } from '@/stores/moderation-posts';
import type { ModerationPost } from '@/stores/moderation-posts';

// Fetch all posts for moderation
const postsStore = useModerationPostsStore();

onMounted(async () => {
  await postsStore.fetchPosts()
})

const allPosts = computed(() => postsStore.posts);

// Group the posts by their moderation status
const moderationPosts = computed(() => {
  const initialGroups: Record<string, ModerationPost[]> = {
    PENDING: [],
    APPROVED: [],
    REJECTED: [],
  };

  return allPosts.value.reduce((groups, post) => {
    if (!groups[post.status]) {
      groups[post.status] = [];
    }
    groups[post.status].push(post);
    return groups;
  }, initialGroups);
});

defineProps({
  deployment: String
})
</script>
