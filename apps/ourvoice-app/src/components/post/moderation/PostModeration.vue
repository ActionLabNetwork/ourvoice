<template>
  <div class="flex flex-col gap-5">
    <div v-if="hasModerationHistory" class="flex justify-end">
      <!-- Side pane button -->
      <div
        @click="toggleSidePane"
        class="my-2 px-3 py-2 cursor-pointer hover:bg-gray-100 border border-ourvoice-grey rounded-md shadow-md" data-cy="moderation-history-button"
      >
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
        <ModerationEditablePostCard v-if="showModifyForm" @update="handleModifyFormUpdate" />
        <ModerationPostCard v-else :post="post" :version="version" :preview="true" :decisionIcon="selfModeration ? decisionIcon[selfModeration] : undefined" />

        <div class="grid grid-cols-4">
          <!-- Moderation Controls -->
          <div v-if="isLatestVersion && hasNotBeenModeratedBySelf"
            class="col-span-4"
          >
            <ModerationControls @moderation-submit="handleModerationControlsSubmit" @moderation-action-change="handleModerationControlsActionChange" />
          </div>
          <div v-if="isLatestVersion && !hasNotBeenModeratedBySelf" class="col-span-4">
            <!-- Renew button -->
            <div class="mt-4 flex justify-end">
              <div>
                <button
                  @click="handleRenewModeration"
                  class="inline-flex items-center justify-center px-5 py-2 gap-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                  data-cy="renew-button"
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModerationPostCard from '@/components/post/moderation/ModerationPostCard.vue';
import ModerationEditablePostCard from './ModerationEditablePostCard.vue';
import ModerationHistory from '@/components/post/moderation/ModerationHistory.vue';
import ModerationVersionList from '@/components/post/moderation/ModerationVersionList.vue'
import ModerationControls from '@/components/post/moderation/ModerationControls.vue'
import SidePane from '@/components/common/SidePane.vue'
import { storeToRefs } from 'pinia';
import { postFilesBucket, postFilesPresignedUrlTTL } from '@/constants/post';

type ModerationActions = 'Accept' | 'Modify' | 'Reject'

interface PostFields {
  title?: string;
  content?: string;
  categoryIds?: number[];
  files?: string[] | null;
}

const route = useRoute();
const router = useRouter()
const userStore = useUserStore()
const moderationPostsStore = useModerationPostsStore()

// Post and Version refs
const { postInModeration: post, versionInModeration: version } = storeToRefs(moderationPostsStore)

const selfModeration = ref<Moderation['decision'] | undefined>(undefined)
const showSidePane = ref(false)
const modifyValues = ref<PostFields | null>(null)
const showModifyForm = ref<boolean>(false)

const isLatestVersion = computed(() => moderationPostsStore.latestPostVersion)
const hasNotBeenModeratedBySelf = computed(() => !moderationPostsStore.userHasModeratedPost)
const hasModerationHistory = computed(() => {
  const wasModified =
    version.value?.authorHash !== post.value?.versions?.at(-1)?.authorHash
  const hasModerations =
    (version.value?.moderations && version.value?.moderations.length > 0)

  return wasModified || hasModerations
})

const decisionIcon = {
  ACCEPTED: {
    text: 'Accepted',
    indicatorClass: 'text-green-500 bg-green-400/10'
  },
  REJECTED: {
    text: 'Rejected',
    indicatorClass: 'text-rose-500 bg-rose-400/10'
  }
}

onMounted(async () => {
  await initializeModerationPosts()
});

async function initializeModerationPosts() {
  await userStore.verifyUserSession()

  moderationPostsStore.$reset()
  await moderationPostsStore.fetchPostById(+route.params.id)

  if (version.value) {
    await refreshVersion(version.value)
  }
}

async function refreshVersion(newVersion: PostVersion) {
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

function toggleSidePane() {
  showSidePane.value = !showSidePane.value
}

function handleSidePaneToggle(open: boolean) {
  showSidePane.value = open
}

async function handleVersionChange(newVersion: PostVersion) {
  moderationPostsStore.versionInModeration = newVersion
  await refreshVersion(newVersion)
}

function handleModerationControlsSubmit(
  { action, reason }: { action: ModerationActions, reason: string }
) {
  const moderationHandlers = {
    'Accept': acceptPost,
    'Modify': modifyPost,
    'Reject': rejectPost
  }
  moderationHandlers[action](reason);
}

function handleModerationControlsActionChange(action: ModerationActions) {
  if (action === 'Modify') {
    moderationPostsStore.resetVersionInModification()
    showModifyForm.value = true
  } else {
    showModifyForm.value = false
  }
}

function handleModifyFormUpdate(
  { version: editedVersion, isValid }: { version: PostVersion, isValid: boolean }
) {
  if (!isValid) return;

  modifyValues.value = {
    title: editedVersion.title,
    content: editedVersion.content,
    categoryIds: editedVersion.categoryIds,
    files: editedVersion.files
  }
}

async function handleRenewModeration() {
  await moderationPostsStore.renewPostModeration()
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision
}

async function performModeration({ actionHandler, reason }: { actionHandler: Function, reason: string }) {
  const version = moderationPostsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await actionHandler(version.id, userStore.sessionHash, userStore.nickname, reason)
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision
}

function acceptPost(reason: string) {
  performModeration({
    actionHandler: moderationPostsStore.approvePostVersion,
    reason
  })
}

function rejectPost(reason: string) {
  performModeration({
    actionHandler: moderationPostsStore.rejectPostVersion,
    reason
  })
}

const modifyPost = async (reason: string) => {
  const version = moderationPostsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (modifyValues.value === null) {
    console.error('No post modify values')
    return
  }

  const post = moderationPostsStore.postInModeration
  if (!post) {
    console.error('No post selected')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.modifyModerationPost(post.id, userStore.sessionHash, userStore.nickname, reason, modifyValues.value)
  selfModeration.value = (await moderationPostsStore.selfModerationForVersion)?.decision

  // Reload the page
  router.go(0)
}
</script>
