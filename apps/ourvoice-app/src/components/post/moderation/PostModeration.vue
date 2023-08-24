<template>
  <div class="flex flex-col gap-5">
    <div class="h-[80vh]" v-if="loading">
      <Loading>Loading Post...</Loading>
    </div>

    <transition name="fade">
      <div v-if="!loading">
        <div class="flex justify-between items-center">
          <div class="my-10">
            <BackButton />
          </div>
          <div v-if="hasModerationHistory" class="flex justify-end pr-5 sm:pr-0">
            <!-- Side pane button -->
            <div
              @click="toggleSidePane"
              class="my-2 px-3 py-2 cursor-pointer hover:bg-gray-100 border border-ourvoice-grey rounded-md shadow-md text-sm sm:text-lg"
              data-cy="moderation-history-button"
            >
              <p>
                Moderation History
                <span>
                  <font-awesome-icon :icon="showSidePane ? faArrowLeft : faArrowRight" />
                </span>
              </p>
            </div>
            <SidePane v-if="showSidePane" @side-pane-toggle="handleSidePaneToggle">
              <ModerationHistory />
            </SidePane>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2">
          <!-- Versioning -->
          <div class="col-span-full sm:col-span-1 px-4 sm:px-0" v-if="post">
            <ModerationVersionList
              @versionClicked="handleVersionChange"
              :versions="post?.versions ?? []"
            />
          </div>

          <!-- Post Preview -->
          <div v-if="post && version" class="col-span-full sm:col-span-3 px-4 sm:px-0">
            <ModerationEditablePostCard
              v-if="showModifyForm"
              @update="handleModifyFormUpdate"
              :has-content-warning="hasContentWarning"
            />
            <ModerationPostCard
              v-else
              :post="post"
              :version="version"
              :preview="true"
              :decisionIcon="selfModeration ? decisionIcon[selfModeration] : undefined"
              :has-content-warning="hasContentWarning"
            />

            <div class="grid grid-cols-4 mt-4">
              <!-- Moderation Controls -->
              <div v-if="isLatestVersion && hasNotBeenModeratedBySelf" class="col-span-4">
                <ModerationControls
                  thread-type="post"
                  @moderation-submit="handleModerationControlsSubmit"
                  @moderation-action-change="handleModerationControlsActionChange"
                  @content-warning-set="handleContentWarningSet"
                  @moderation-category-change="moderationCategory = $event"
                />
              </div>
              <div v-if="isLatestVersion && !hasNotBeenModeratedBySelf" class="col-span-4">
                <!-- Renew button -->
                <div class="mt-4 flex justify-end" v-if="post.status === 'PENDING'">
                  <div>
                    <button
                      @click="handleRenewModeration"
                      class="inline-flex items-center justify-center px-5 py-2 gap-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                      data-cy="renew-button"
                    >
                      Renew Moderation
                      <span><font-awesome-icon :icon="faRotateLeft" /></span>
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
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  usePostModerationStore,
  type Moderation,
  type ModerationPostVersion
} from '@/stores/post-moderation'
import { useUserStore } from '@/stores/user'
import { ref, onMounted, computed, type ComputedRef, watchEffect, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModerationPostCard from '@/components/post/moderation/ModerationPostCard.vue'
import ModerationEditablePostCard from './ModerationEditablePostCard.vue'
import ModerationHistory from '@/components/post/moderation/ModerationHistory.vue'
import ModerationVersionList from '@/components/post/moderation/ModerationVersionList.vue'
import ModerationControls from '@/components/common/ModerationControls.vue'
import SidePane from '@/components/common/SidePane.vue'
import BackButton from '@/components/common/BackButton.vue'
import Loading from '@/components/common/Loading.vue'

import { storeToRefs } from 'pinia'
import { postFilesPresignedUrlTTL } from '@/constants/post'
import type { ModerationAction } from '@/types/moderation'
import { faArrowLeft, faArrowRight, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

interface PostFields {
  title?: string
  content?: string
  categoryIds?: number[]
  files?: string[] | null
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const postModerationStore = usePostModerationStore()

// Post and Version refs
const {
  postInModeration: post,
  versionInModeration: version,
  hasErrors
} = storeToRefs(postModerationStore)

const loading = ref(true)
const selfModeration = ref<Moderation['decision'] | undefined>(undefined)
const showSidePane = ref<boolean>(false)
const modifyValues = ref<PostFields | null>(null)
const showModifyForm = ref<boolean>(false)
const hasContentWarning = ref<boolean>(version.value?.hasContentWarning ?? false)
const moderationCategory = ref<string | null>(null)

const isLatestVersion: ComputedRef<boolean> = computed(() => postModerationStore.latestPostVersion)
const hasNotBeenModeratedBySelf = computed(() => !postModerationStore.userHasModeratedPost)
const hasModerationHistory = computed(() => {
  const wasModified = version.value?.version ? version.value?.version > 1 : false
  const hasModerations = version.value?.moderations && version.value?.moderations.length > 0

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
  loading.value = true
  await initializeModerationPost()
  loading.value = false
})

watchEffect(async () => {
  if (post.value?.id === Number(route.params.id)) {
    if (post.value.status !== 'PENDING') {
      router.push('/moderation/posts')
    }
    // TODO: Show a toast with the error and a countdown to redirect
    else if (hasErrors.value) {
      router.push('/moderation/posts')
    }
  }
})

watch(version, async (newVersion) => {
  if (newVersion) {
    hasContentWarning.value = newVersion.hasContentWarning ?? false
  }
})

async function initializeModerationPost() {
  await userStore.verifyUserSession()

  postModerationStore.$reset()
  await postModerationStore.fetchPostById(Number(route.params.id))

  if (version.value) {
    await refreshVersion(version.value)
  }
}

async function refreshVersion(newVersion: ModerationPostVersion) {
  // Check if user has moderated this version
  await postModerationStore.checkIfUserHasModerated(userStore.userId)

  selfModeration.value = (await postModerationStore.selfModerationForVersion)?.decision

  // If there are files, request their download urls
  if (newVersion.files && newVersion.files.length > 0)
    await postModerationStore.getPresignedDownloadUrls(newVersion.files, postFilesPresignedUrlTTL)
}

function toggleSidePane() {
  showSidePane.value = !showSidePane.value
}

function handleSidePaneToggle(open: boolean) {
  showSidePane.value = open
}

async function handleVersionChange(newVersion: ModerationPostVersion) {
  postModerationStore.versionInModeration = newVersion
  await refreshVersion(newVersion)
}

function handleModerationControlsSubmit(data: { action: ModerationAction; reason: string }) {
  const { action, reason } = data
  const moderationHandlers = {
    Accept: acceptPost,
    Modify: modifyPost,
    Reject: rejectPost
  }
  moderationHandlers[action](reason)
}

function handleModerationControlsActionChange(action: ModerationAction) {
  if (action === 'Modify') {
    postModerationStore.resetVersionInModification()
    showModifyForm.value = true
  } else {
    showModifyForm.value = false
  }
}

function handleContentWarningSet(value: boolean) {
  hasContentWarning.value = value
}

function handleModifyFormUpdate({
  version: editedVersion,
  isValid
}: {
  version: ModerationPostVersion
  isValid: boolean
}) {
  if (!isValid) return

  modifyValues.value = {
    title: editedVersion.title,
    content: editedVersion.content,
    categoryIds: editedVersion.categoryIds,
    files: editedVersion.files
  }
}

async function handleRenewModeration() {
  await postModerationStore.renewPostModeration()
  selfModeration.value = (await postModerationStore.selfModerationForVersion)?.decision
}

async function performModeration(action: (versionId: number) => Promise<any>) {
  const version = postModerationStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }
  await action(version.id)
  selfModeration.value = (await postModerationStore.selfModerationForVersion)?.decision

  // Redirect to posts list if status changes
  if (postModerationStore.postInModeration?.status !== 'PENDING') {
    router.push({ name: 'moderate-post-list' })
  }
}

function acceptPost(reason: string) {
  performModeration((versionId) =>
    postModerationStore.approvePostVersion(
      versionId,
      userStore.sessionHash,
      userStore.nickname,
      reason
    )
  )
}

function rejectPost(reason: string) {
  performModeration((versionId) =>
    postModerationStore.rejectPostVersion(
      versionId,
      userStore.sessionHash,
      userStore.nickname,
      reason,
      moderationCategory.value
    )
  )
}

const modifyPost = async (reason: string) => {
  const version = postModerationStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (modifyValues.value === null) {
    console.error('No post modify values')
    return
  }

  const post = postModerationStore.postInModeration
  if (!post) {
    console.error('No post selected')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await postModerationStore.modifyModerationPost(
    post.id,
    userStore.sessionHash,
    userStore.nickname,
    reason,
    modifyValues.value,
    hasContentWarning.value,
    moderationCategory.value
  )
  selfModeration.value = (await postModerationStore.selfModerationForVersion)?.decision

  // Reload the page
  router.go(0)
}
</script>
