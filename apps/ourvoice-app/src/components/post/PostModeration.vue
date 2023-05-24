<template>
  <div class="p-6">
    <h1 class="text-3xl font-extrabold mb-4 text-center">Moderate Post</h1>

    <div class="grid grid-cols-4 gap-2">
      <!-- Versioning -->
      <div class="col-span-1" v-if="post">
        <ModerationVersionList @versionClicked="handleVersionChange" :versions="post?.versions ?? []" />
      </div>

      <div v-if="post && version" class="col-span-3">
        <ModerationPostCard :post="post" :version="version ?? undefined" />

        <!-- Buttons for accepting or rejecting the post -->
        <div class="mt-4 flex">
          <div>
            <button
            class="inline-flex items-center justify-center px-5 py-2 gap-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 mr-4"
            @click="acceptPost"
          > Accept
          <span><font-awesome-icon :icon="['fas', 'fa-check']" /></span>
          </button>

          </div>
          <div>
            <button
            class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 mr-4 gap-3"
            @click="acceptPost"
          >
            Modify
            <span><font-awesome-icon :icon="['fas', 'fa-pen-to-square']" /></span>
          </button>
          </div>
          <div>
            <button
            class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 gap-3"
            @click="rejectPost"
          >
            Reject
            <span><font-awesome-icon :icon="['fas', 'fa-xmark']" /></span>
          </button>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Post not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModerationPostsStore, type ModerationPost, type PostVersion } from '@/stores/moderation-posts';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModerationPostCard from './ModerationPostCard.vue';
import ModerationVersionList from './ModerationVersionList.vue'

const latestPostVersion = computed(() => post.value?.versions[post.value?.versions.length - 1])

const route = useRoute();
const router = useRouter();
const post = ref<ModerationPost | null>(null);
const version = ref<PostVersion | null>(latestPostVersion.value ?? null)

const moderationPostsStore = useModerationPostsStore()

const handleVersionChange = (newVersion: PostVersion) => {
  version.value = newVersion
}


onMounted(async () => {
  post.value = await moderationPostsStore.fetchPostById(+route.params.id)
  version.value = post.value?.versions[0] ?? null
});

watch(post, newPost => {
  post.value = newPost
})

const acceptPost = () => {
  // call the API to accept the post
  // await moderatePost(post.value.id, 'ACCEPTED');
  // then redirect to the previous page
  router.back();
};

const modifyPost = () => {
  router.back()
}

const rejectPost = () => {
  // call the API to reject the post
  // await moderatePost(post.value.id, 'REJECTED');
  // then redirect to the previous page
  router.back();
};
</script>
