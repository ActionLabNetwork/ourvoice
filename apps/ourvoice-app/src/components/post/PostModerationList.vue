<template>
  <div class="moderation-page">
    <h1 class="text-center text-4xl font-bold my-6">Moderation Posts List</h1>

    <div v-for="(posts, status) in moderationPosts" :key="status" class="p-5">
      <h2 class="my-2 text-2xl font-semibold" :class="statusHeader[status as PostStatus].textColor">
        <font-awesome-icon :icon="['fas', statusHeader[status as PostStatus].icon]" />
        {{ status }}
      </h2>

      <div v-if="posts.length === 0">
        <p class="text-lg text-gray-600">No posts to display...</p>
      </div>

      <div v-else>
        <ul>
          <li v-for="post in posts" :key="post.id">
            <ModerationPostCard :post="post" :version="post.versions[0]" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import ModerationPostCard from './ModerationPostCard.vue';
import { useModerationPostsStore } from '@/stores/moderation-posts';
import type { ModerationPost } from '@/stores/moderation-posts';

interface StatusHeader {
  icon: string;
  textColor: string;
}

type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED';


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

watch(moderationPosts, (newVal) => {
  console.log(newVal)
})

// Define status icons and colors
const statusHeader: Record<PostStatus, StatusHeader> = {
  PENDING: { icon: 'hourglass-half', textColor: 'text-yellow-500' },
  APPROVED: { icon: 'check-circle', textColor: 'text-green-500' },
  REJECTED: { icon: 'times-circle', textColor: 'text-red-500' }
};
</script>

<style scoped>
.moderation-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
