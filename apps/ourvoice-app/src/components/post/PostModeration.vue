<template>
  <div>
    <div class="grid grid-cols-4 gap-2">
      <!-- Versioning -->
      <div class="col-span-1" v-if="post">
        <ModerationVersionList @versionClicked="handleVersionChange" :versions="post?.versions ?? []" />
      </div>

      <!-- Post Preview -->
      <div v-if="post && version" class="col-span-3">
        <ModerationPostCard :post="post" :version="version ?? undefined" :preview="true" />

        <div v-if="version !== originalPostVersion">
          <div class="mt-4 flex flex-row justify-end">
            <div>
              <!-- Buttons for accepting or rejecting the post -->
              <button
                class="inline-flex items-center justify-center px-5 py-2 gap-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 mr-4"
                @click="acceptPost"
              >
                Accept
                <span><font-awesome-icon :icon="['fas', 'fa-check']" /></span>
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

          <!-- Post Modify Form -->
          <div v-if="version" class="col-start-2 col-span-full">
            <ModifyPost :title="version.title" :content="version.content" />
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
import ModifyPost from './ModifyPost.vue';

const latestPostVersion = computed(() => post.value?.versions[post.value?.versions.length - 1])
const originalPostVersion = computed(() => post.value?.versions[post.value?.versions.length - 1])

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
