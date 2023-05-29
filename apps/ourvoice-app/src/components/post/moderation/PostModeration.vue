<template>
  <div class="flex flex-col gap-5">
    <div v-if="version?.reason || (version?.moderations && version.moderations.length)" class="flex justify-end">
      <div @click="toggleSidePane" class="my-2 px-3 py-2 cursor-pointer hover:bg-gray-100 border border-ourvoice-grey rounded-md shadow-md">
        <p>
          Moderation History
          <span>
            <font-awesome-icon :icon="['fas', showSidePane ? 'fa-arrow-left' : 'fa-arrow-right']" />
          </span>
        </p>
      </div>
      <SidePane v-if="showSidePane" @side-pane-toggle="handleSidePaneToggle">
        <ModerationHistory />
      </SidePane>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <!-- Versioning -->
      <div class="col-span-1" v-if="post">
        <ModerationVersionList @versionClicked="handleVersionChange" :versions="post?.versions ?? []" />
      </div>

      <!-- Post Preview -->
      <div v-if="post && version" class="col-span-3">
        <ModerationEditablePostCard v-if="showModifyForm" :preview="true" :decisionIcon="selfModeration ? decisionIcon[selfModeration] : undefined" @update="handleModifyFormUpdate" />
        <ModerationPostCard v-else :post="post" :version="version" :preview="true" :decisionIcon="selfModeration ? decisionIcon[selfModeration] : undefined" />

        <div class="grid grid-cols-4">
          <!-- Moderation Controls -->
          <div v-if="isLatestVersion && hasNotBeenModerated"
            class="col-span-4"
          >
            <ModerationControls @moderation-submit="handleModerationControlsSubmit" @moderation-action-change="handleModerationControlsActionChange" />
          </div>
          <div v-if="isLatestVersion && !hasNotBeenModerated" class="col-span-4">
            <!-- Renew button -->
            <div class="mt-4 flex justify-end">
              <div>
                <button
                  @click="handleRenewModeration"
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
import { useModerationPostsStore, type Moderation, type PostVersion, } from '@/stores/moderation-posts';
import { useUserStore } from '@/stores/user';
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModerationPostCard from '@/components/post/moderation/ModerationPostCard.vue';
import ModerationEditablePostCard from './ModerationEditablePostCard.vue';
import ModerationHistory from '@/components/post/moderation/ModerationHistory.vue';
import ModerationVersionList from '@/components/post/moderation/ModerationVersionList.vue'
import ModerationControls from '@/components/post/moderation/ModerationControls.vue'
import SidePane from '@/components/common/SidePane.vue'
import { storeToRefs } from 'pinia';
import { createPostContentCharacterLimit, postFilesBucket, postFilesPresignedUrlTTL, inputPlaceholders } from '@/constants/post';

type ModerationActions = 'Accept' | 'Modify' | 'Reject'

interface PostFields {
  title?: string;
  content?: string;
  categoryIds?: number[];
  files?: string[] | null;
}

// Verify user session
const userStore = useUserStore()
await userStore.verifyUserSession()

// Init post moderation store
const moderationPostsStore = useModerationPostsStore()

// Post and Version refs
const { postInModeration: post, versionInModeration: version } = storeToRefs(moderationPostsStore)

const selfModeration = ref<Moderation['decision'] | undefined>(undefined)

// Side pane interaction
const showSidePane = ref(false)

const toggleSidePane = () => {
  showSidePane.value = !showSidePane.value
}

const handleSidePaneToggle = (open: boolean) => {
  showSidePane.value = open
}

// Route handling
const route = useRoute();
const router = useRouter()

onMounted(async () => {
  // Fetch and set Post and Version, defaulting to latest version
  moderationPostsStore.$reset()
  await moderationPostsStore.fetchPostById(+route.params.id)

  if (version.value) {
    refreshVersion(version.value)
  }
});

const modifyValues = ref<PostFields | null>(null)
const isLatestVersion = computed(() => moderationPostsStore.latestPostVersion)
const hasNotBeenModerated = computed(() => !moderationPostsStore.userHasModeratedPost)

// Methods
const handleVersionChange = async (newVersion: PostVersion) => {
  moderationPostsStore.versionInModeration = newVersion
  refreshVersion(newVersion)
}

const refreshVersion = async (newVersion: PostVersion) => {
  // Check if user has moderated this version
  await moderationPostsStore.checkIfUserHasModerated(userStore.userId)

  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision

  // If there are files, request their download urls
  if (newVersion.files && newVersion.files.length > 0)
    await moderationPostsStore.getPresignedDownloadUrls(
      postFilesBucket,
      newVersion.files,
      postFilesPresignedUrlTTL
    )
}

const decisionIcon = { ACCEPTED: { text: 'Accepted', indicatorClass: 'text-green-500 bg-green-400/10' }, REJECTED: { text: 'Rejected', indicatorClass: 'text-rose-500 bg-rose-400/10' } }

// Component show flags
const showModifyForm = ref<boolean>(false)

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
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision
};

const modifyPost = async (values: PostFields, reason: string) => {
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
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision

  // Reload the page
  router.go(0)
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
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision
};

const handleModerationControlsSubmit = ({ action, reason }: { action: ModerationActions, reason: string }) => {
  switch (action) {
    case 'Accept':
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

const handleModerationControlsActionChange = (action: ModerationActions) => {
  if (action === 'Modify') {
    showModifyForm.value = true
  } else {
    showModifyForm.value = false
  }
}

const handleModifyFormUpdate = (editedVersion: PostVersion) => {
  console.log({ editedVersion })
  moderationPostsStore.modifiedPostVersion = editedVersion
  modifyValues.value = {
    title: editedVersion.title,
    content: editedVersion.content,
    categoryIds: editedVersion.categoryIds,
    files: editedVersion.files
  }
}

const handleRenewModeration = async () => {
  await moderationPostsStore.renewPostModeration()
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision
}
</script>
