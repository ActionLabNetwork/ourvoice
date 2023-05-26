<template>
  <div>
    <div class="grid grid-cols-4 gap-2">
      <!-- Versioning -->
      <div class="col-span-1" v-if="post">
        <ModerationVersionList @versionClicked="handleVersionChange" :versions="post?.versions ?? []" />
      </div>

      <!-- Post Preview -->
      <div v-if="post && version" class="col-span-3">
        <ModerationPostCard :post="post" :version="version ?? undefined" :preview="true" :decisionIcon="decisionIcon" />

        <div class="grid grid-cols-4">
          <div v-if="showModifyForm && version" class="col-span-2">
            <!-- Post Modify Form -->
            <ModifyPost :title="version.title" :content="version.content" @modify-form-submit="handleModifyFormSubmit"/>
          </div>

          <!-- Moderation Controls -->
          <div v-if="isLatestVersion && hasNotBeenModerated"
            :class="{ 'col-span-2': showModifyForm, 'col-span-4': !showModifyForm }"
          >
            <ModerationControls @moderation-submit="handleModerationControlsSubmit" @moderation-action-change="handleModerationControlsActionChange" />
          </div>
          <div v-if="isLatestVersion && !hasNotBeenModerated" class="col-span-4">
            <!-- Renew button -->
            <div class="mt-4 flex justify-end">
              <div>
                <button
                  class="inline-flex items-center justify-center px-5 py-2 gap-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  Renew Moderation
                  <span><font-awesome-icon :icon="['fas', 'fa-rotate-left']" /></span>
                </button>
              </div>
            </div>
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
import authService from '@/services/auth-service';
import { useModerationPostsStore, type ModerationPost, type PostVersion, type Moderation } from '@/stores/moderation-posts';
import { useUserStore } from '@/stores/user';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModerationPostCard from '@/components/post/moderation/ModerationPostCard.vue';
import ModerationVersionList from '@/components/post/moderation/ModerationVersionList.vue'
import ModifyPost, { type FormFields } from '@/components/post/moderation/ModifyPost.vue';
import ModerationControls from '@/components/post/moderation/ModerationControls.vue'
import { storeToRefs } from 'pinia';

// Define Props
const props = defineProps({ deployment: { type: String, required: true } })

// Set deployment and fetch user session
const userStore = useUserStore()
await userStore.verifyUserSession()

// Init post moderation store
const moderationPostsStore = useModerationPostsStore()

// Post and Version refs
const { postInModeration: post, versionInModeration: version } = storeToRefs(moderationPostsStore)

// Route handling
const route = useRoute();

onMounted(async () => {
  // Fetch and set Post and Version, defaulting to latest version
  moderationPostsStore.$reset()
  await moderationPostsStore.fetchPostById(+route.params.id)

  // Check if user has moderated this version
  await moderationPostsStore.checkIfUserHasModerated(userStore.userId, props.deployment)
});

const modifyValues = ref<FormFields | null>(null)
const isLatestVersion = computed(() => moderationPostsStore.latestPostVersion)
const hasNotBeenModerated = computed(() => !moderationPostsStore.userHasModeratedPost)

// Methods
const handleVersionChange = async (newVersion: PostVersion) => {
  moderationPostsStore.versionInModeration = newVersion

  // Check if user has moderated this version
  await moderationPostsStore.checkIfUserHasModerated(userStore.userId, props.deployment)

  console.log(isLatestVersion.value, hasNotBeenModerated.value)
}

const hasModerated = async (userId: string): Promise<boolean> => {
  const version = moderationPostsStore.versionInModeration

  if (!version) return false

  const versionModerators = Array.from(version.moderations.reduce((acc, moderation) => {
    if (moderation) acc.add(moderation.moderatorHash)
    return acc
  }, new Set<string>()))

  const promises = versionModerators.map((moderator) => authService.verifyHash(userId, props.deployment, moderator))

  const hasModeratedList = await Promise.all(promises)

  return hasModeratedList.includes(true)
}

const findSelfModeration = async () => {
  const version = moderationPostsStore.versionInModeration

  if (!version) return null

  const promises = version.moderations.map((moderation) => {
    return authService.verifyHash(userStore.userId, props.deployment, moderation.moderatorHash)
  })

  const moderators = await Promise.all(promises)
  return version.moderations[moderators.indexOf(true)]
}

const decisionIcon = { icon: 'fa-check', color: '#ffffff' }

// Component show flags
const showModerationControls = ref<boolean>(true)
const showModifyForm = ref<boolean>(false)

showModerationControls.value = (moderationPostsStore.latestPostVersion ?? false) && !(await hasModerated(userStore.userId))

const acceptPost = async (reason: string) => {
  const version = moderationPostsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.approvePostVersion(version.id, userStore.sessionHash, reason)
};

const modifyPost = async (values: FormFields, reason: string) => {
  const post = moderationPostsStore.postInModeration
  const version = moderationPostsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!post) {
    console.error('No post selected')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.modifyModerationPost(post.id, userStore.sessionHash, reason, values)
}

const rejectPost = async (reason: string) => {
  const version = moderationPostsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.rejectPostVersion(version.id, userStore.sessionHash, reason)
};

const handleModerationControlsSubmit = ({ action, reason }: { action: 'Approve' | 'Modify' | 'Reject', reason: string }) => {
  switch (action) {
    case 'Approve':
      acceptPost(reason);
      break;
    case 'Modify':
      if (modifyValues.value === null) {
        console.error('No post modify values')
        return
      }
      modifyPost(modifyValues.value, reason);
      break;
    case 'Reject':
      rejectPost(reason);
      break;
    default:
      console.error(`Unexpected action: ${action}`);
  }
}

const handleModerationControlsActionChange = (action: 'Approve' | 'Modify' | 'Reject') => {
  console.log({ action })
  if (action === 'Modify') {
    showModifyForm.value = true
  } else {
    showModifyForm.value = false
  }
}

const handleModifyFormSubmit = (values: FormFields) => {
  modifyValues.value = values
}
</script>
