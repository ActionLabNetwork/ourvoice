<template>
  <div class="w-full h-full bg-gray-100">
    <Header title="Moderation Posts List" />
    <main>
      <div class="px-10 py-10 bg-gray-100">
        <BaseTab :tabs="tabs" :initialTab="tabs[0]" @tab-switched="handleTabSwitched">
          <template #pending>
            <PostModerationList :posts="moderationPosts.PENDING" />
          </template>
          <template #accepted>
            <PostModerationList :posts="moderationPosts.APPROVED" />
          </template>
          <template #rejected>
            <PostModerationList :posts="moderationPosts.REJECTED" />
          </template>
        </BaseTab>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import PostModerationList from '@/components/post/moderation/PostModerationList.vue'
import BaseTab from '@/components/common/BaseTab.vue'

import { computed, onMounted, ref } from 'vue';
import { useModerationPostsStore } from '@/stores/moderation-posts';
import type { ModerationPost } from '@/stores/moderation-posts';

const tabs = ref([
  { name: 'Pending', current: true },
  { name: 'Accepted', current: false },
  { name: 'Rejected', current: false },
])

const handleTabSwitched = (selectedTab) => {
  // If we need to know when the tab is switched, we can do it here
};

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
    ACCEPTED: [],
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
