<template>
  <div class="flex flex-col gap-5">
    <div v-if="hasModerationHistory" class="flex justify-end">
      <!-- Side pane button -->
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
      <div class="col-span-1" v-if="comment">
        <ModerationVersionList @versionClicked="handleVersionChange" :versions="comment?.versions ?? []" />
      </div>

      <!-- Post Context Preview -->
      <div v-if="comment && comment.post && comment.post.versions" class="col-span-3">
        <ModerationPostCard :post="comment.post" :version="comment.post.versions[0]" :preview="true"  />
      </div>

      <!-- Parent Comment Context Preview -->
      <div v-if="comment && comment.parent && comment.parent.versions" class="col-span-3 col-start-2 pl-10">
        <ModerationCommentCard :comment="comment.parent" :version="comment.parent.versions[0]" :preview="true" />
      </div>

      <!-- Comment Preview -->
      <div v-if="comment && version" class="col-span-3 col-start-2 pl-10">
        <ModerationEditableCommentCard v-if="showModifyForm" @update="handleModifyFormUpdate" />
        <ModerationCommentCard v-else :comment="comment" :version="version" :preview="true" :decisionIcon="selfModeration ? decisionIcon[selfModeration] : undefined" />

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
        <p>Comment not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModerationCommentsStore, type Moderation, type CommentVersion, } from '@/stores/moderation-comments';
import { useUserStore } from '@/stores/user';
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ModerationPostCard from '@/components/post/moderation/ModerationPostCard.vue';
import ModerationCommentCard from '@/components/comment/moderation/ModerationCommentCard.vue';
import ModerationEditableCommentCard from './ModerationEditableCommentCard.vue';
import ModerationHistory from '@/components/comment/moderation/ModerationHistory.vue';
import ModerationVersionList from '@/components/comment/moderation/ModerationVersionList.vue'
import ModerationControls from '@/components/comment/moderation/ModerationControls.vue'
import SidePane from '@/components/common/SidePane.vue'
import { storeToRefs } from 'pinia';

type ModerationActions = 'Accept' | 'Modify' | 'Reject'

interface CommentFields {
  title?: string;
  content?: string;
  categoryIds?: number[];
  files?: string[] | null;
}

const route = useRoute();
const router = useRouter()
const userStore = useUserStore()
const moderationCommentsStore = useModerationCommentsStore()

// Comment and Version refs
const { commentInModeration: comment, versionInModeration: version } = storeToRefs(moderationCommentsStore)

const selfModeration = ref<Moderation['decision'] | undefined>(undefined)
const showSidePane = ref(false)
const modifyValues = ref<CommentFields | null>(null)
const showModifyForm = ref<boolean>(false)

const isLatestVersion = computed(() => moderationCommentsStore.latestCommentVersion)
const hasNotBeenModeratedBySelf = computed(() => !moderationCommentsStore.userHasModeratedComment)
const hasModerationHistory = computed(() => {
  // The second check is for development. It shouldn't happen in reality (a moderator shouldn't be able to moderate their own comment, less so modify it)
  const wasModified =
    (version.value?.authorHash !== comment.value?.versions.at(-1).authorHash) || (version.value?.version > 1)
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
  console.log(comment.value)
  await initializeModerationComments()
});

async function initializeModerationComments() {
  await userStore.verifyUserSession()

  moderationCommentsStore.$reset()
  await moderationCommentsStore.fetchCommentById(+route.params.id)

  if (version.value) {
    await refreshVersion(version.value)
  }
}

async function refreshVersion(newVersion: CommentVersion) {
  // Check if user has moderated this version
  await moderationCommentsStore.checkIfUserHasModerated(userStore.userId)

  selfModeration.value = (await moderationCommentsStore.selfModerationForVersion)?.decision
}

function toggleSidePane() {
  showSidePane.value = !showSidePane.value
}

function handleSidePaneToggle(open: boolean) {
  showSidePane.value = open
}

async function handleVersionChange(newVersion: CommentVersion) {
  moderationCommentsStore.versionInModeration = newVersion
  await refreshVersion(newVersion)
}

function handleModerationControlsSubmit(
  { action, reason }: { action: ModerationActions, reason: string }
) {
  const moderationHandlers = {
    'Accept': acceptComment,
    'Modify': modifyComment,
    'Reject': rejectComment
  }
  moderationHandlers[action](reason);
}

function handleModerationControlsActionChange(action: ModerationActions) {
  if (action === 'Modify') {
    moderationCommentsStore.resetVersionInModification()
    showModifyForm.value = true
  } else {
    showModifyForm.value = false
  }
}

function handleModifyFormUpdate(
  { version: editedVersion, isValid }: { version: CommentVersion, isValid: boolean }
) {
  if (!isValid) return;

  modifyValues.value = { content: editedVersion.content }
}

async function handleRenewModeration() {
  await moderationCommentsStore.renewCommentModeration()
  selfModeration.value = (await moderationCommentsStore.selfModerationForVersion)?.decision
}

async function performModeration({ actionHandler, reason }: { actionHandler: Function, reason: string }) {
  const version = moderationCommentsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await actionHandler(version.id, userStore.sessionHash, userStore.nickname, reason)
  selfModeration.value = (await moderationCommentsStore.selfModerationForVersion)?.decision
}

function acceptComment(reason: string) {
  performModeration({
    actionHandler: moderationCommentsStore.approveCommentVersion,
    reason
  })
}

function rejectComment(reason: string) {
  performModeration({
    actionHandler: moderationCommentsStore.rejectCommentVersion,
    reason
  })
}

const modifyComment = async (reason: string) => {
  const version = moderationCommentsStore.versionInModeration

  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (modifyValues.value === null) {
    console.error('No comment modify values')
    return
  }

  const comment = moderationCommentsStore.commentInModeration
  if (!comment) {
    console.error('No comment selected')
    return
  }

  if (!version) {
    console.error('No version selected')
    return
  }

  await moderationCommentsStore.modifyModerationComment(comment.id, userStore.sessionHash, userStore.nickname, reason, modifyValues.value)
  selfModeration.value = (await moderationCommentsStore.selfModerationForVersion)?.decision

  // Reload the page
  router.go(0)
}
</script>
