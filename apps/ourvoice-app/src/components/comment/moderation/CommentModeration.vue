<template>
  <div class="flex flex-col gap-5">
    <div class="h-[80vh]" v-if="loading">
      <Loading>Loading Comment...</Loading>
    </div>
    <transition name="fade">
      <div>
        <div class="flex justify-between items-center my-10" v-if="!loading">
          <div>
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
          <div class="col-span-full sm:col-span-1 px-4 sm:px-0" v-if="comment">
            <ModerationVersionList
              @versionClicked="handleVersionChange"
              :versions="comment?.versions ?? []"
            />
          </div>

          <!-- Post Context Preview -->
          <div
            v-if="comment && comment.post && comment.post.versions"
            class="col-span-full sm:col-span-3 px-4 sm:px-0"
          >
            <ModerationPostCard
              :post="comment.post"
              :version="comment.post.versions[0]"
              :preview="true"
            />
          </div>

          <!-- Parent Comment Context Preview -->
          <div v-if="history" class="col-span-full sm:col-span-3 px-4 sm:px-0 sm:col-start-2 pl-10">
            <div v-for="c in history" :key="c.id">
              <ModerationCommentCard :comment="c" :version="c.versions[0]" :preview="true" />
            </div>
          </div>

          <!-- Comment Preview -->
          <div
            v-if="comment && version"
            class="col-span-full sm:col-span-3 sm:col-start-2 pl-10 pr-2 sm:pr-0"
          >
            <ModerationEditableCommentCard v-if="showModifyForm" @update="handleModifyFormUpdate" />
            <ModerationCommentCard
              v-else
              :comment="comment"
              :version="version"
              :preview="true"
              :decisionIcon="selfModeration ? decisionIcon[selfModeration] : undefined"
            />

            <div class="grid grid-cols-4">
              <!-- Moderation Controls -->
              <div v-if="isLatestVersion && hasNotBeenModeratedBySelf" class="col-span-4">
                <ModerationControls
                  thread-type="comment"
                  @moderation-submit="handleModerationControlsSubmit"
                  @moderation-action-change="handleModerationControlsActionChange"
                />
              </div>
              <div v-if="isLatestVersion && !hasNotBeenModeratedBySelf" class="col-span-4">
                <!-- Renew button -->
                <div class="mt-4 flex justify-end" v-if="comment.status === 'PENDING'">
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
            <p>Comment not found</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModerationPostCard from '@/components/post/moderation/ModerationPostCard.vue'
import ModerationCommentCard from '@/components/comment/moderation/ModerationCommentCard.vue'
import ModerationEditableCommentCard from './ModerationEditableCommentCard.vue'
import ModerationHistory from '@/components/comment/moderation/ModerationHistory.vue'
import ModerationVersionList from '@/components/comment/moderation/ModerationVersionList.vue'
import ModerationControls from '@/components/common/ModerationControls.vue'
import SidePane from '@/components/common/SidePane.vue'
import BackButton from '@/components/common/BackButton.vue'
import { storeToRefs } from 'pinia'
import Loading from '@/components/common/Loading.vue'
import {
  useCommentModerationStore,
  type ModerationCommentVersion
} from '@/stores/comment-moderation'
import type { CommentModeration } from '@/graphql/generated/graphql'
import { faArrowLeft, faArrowRight, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import type { ModerationAction } from '@/types/moderation'

interface CommentFields {
  title?: string
  content?: string
  categoryIds?: number[]
  files?: string[] | null
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const commentModerationStore = useCommentModerationStore()

// Comment and Version refs
const {
  commentInModeration: comment,
  versionInModeration: version,
  history,
  hasErrors
} = storeToRefs(commentModerationStore)

const selfModeration = ref<CommentModeration['decision'] | undefined>(undefined)
const showSidePane = ref(false)
const modifyValues = ref<CommentFields | null>(null)
const showModifyForm = ref<boolean>(false)
const loading = ref(false)

const isLatestVersion = computed(() => commentModerationStore.latestCommentVersion)
const hasNotBeenModeratedBySelf = computed(() => !commentModerationStore.userHasModeratedComment)
const hasModerationHistory = computed(() => {
  const wasModified =
    version.value?.authorHash !== comment.value?.versions?.at(-1)?.authorHash ||
    (version.value?.version && version.value?.version > 1)
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
  await initializeCommentModeration()
  loading.value = false
})

watchEffect(() => {
  if (comment.value?.id === Number(route.params.id)) {
    if (comment.value.status !== 'PENDING') {
      router.push('/moderation/comments')
    }
    // TODO: Show a toast with the error and countdown before redirecting
    else if (hasErrors.value) {
      router.push('/moderation/comments')
    }
  }
})

async function initializeCommentModeration() {
  await userStore.verifyUserSession()

  commentModerationStore.$reset()
  await commentModerationStore.fetchCommentById(+route.params.id)
  await commentModerationStore.fetchCommentHistoryById(+route.params.id)

  if (version.value) {
    await refreshVersion()
  }
}

async function refreshVersion() {
  // Check if user has moderated this version
  await commentModerationStore.checkIfUserHasModerated(userStore.userId)

  selfModeration.value = (await commentModerationStore.selfModerationForVersion)?.decision
}

function toggleSidePane() {
  showSidePane.value = !showSidePane.value
}

function handleSidePaneToggle(open: boolean) {
  showSidePane.value = open
}

async function handleVersionChange(newVersion: ModerationCommentVersion) {
  commentModerationStore.versionInModeration = newVersion
  await refreshVersion()
}

function handleModerationControlsSubmit({
  action,
  reason
}: {
  action: ModerationAction
  reason: string
}) {
  const moderationHandlers = {
    Accept: acceptComment,
    Modify: modifyComment,
    Reject: rejectComment
  }
  moderationHandlers[action](reason)
}

function handleModerationControlsActionChange(action: ModerationAction) {
  if (action === 'Modify') {
    commentModerationStore.resetVersionInModification()
    showModifyForm.value = true
  } else {
    showModifyForm.value = false
  }
}

function handleModifyFormUpdate({
  version: editedVersion,
  isValid
}: {
  version: ModerationCommentVersion
  isValid: boolean
}) {
  if (!isValid) return

  modifyValues.value = { content: editedVersion.content }
}

async function handleRenewModeration() {
  await commentModerationStore.renewCommentModeration()
  selfModeration.value = (await commentModerationStore.selfModerationForVersion)?.decision
}

async function performModeration({
  actionHandler,
  reason
}: {
  actionHandler: Function
  reason: string
}) {
  const version = commentModerationStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }
  console.log(commentModerationStore.commentInModeration?.status)

  await actionHandler(version.id, userStore.sessionHash, userStore.nickname, reason)
  selfModeration.value = (await commentModerationStore.selfModerationForVersion)?.decision

  console.log(commentModerationStore.commentInModeration?.status)
  // Redirect to comments list if status changes
  if (commentModerationStore.commentInModeration?.status !== 'PENDING') {
    router.push('/moderation/comments')
  }
}

function acceptComment(reason: string) {
  performModeration({
    actionHandler: commentModerationStore.approveCommentVersion,
    reason
  })
}

function rejectComment(reason: string) {
  performModeration({
    actionHandler: commentModerationStore.rejectCommentVersion,
    reason
  })
}

const modifyComment = async (reason: string) => {
  const version = commentModerationStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (modifyValues.value === null) {
    console.error('No comment modify values')
    return
  }

  const comment = commentModerationStore.commentInModeration
  if (!comment) {
    console.error('No comment selected')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await commentModerationStore.modifyModerationComment(
    comment.id,
    userStore.sessionHash,
    userStore.nickname,
    reason,
    modifyValues.value
  )
  selfModeration.value = (await commentModerationStore.selfModerationForVersion)?.decision

  // Reload the page
  router.go(0)
}
</script>
