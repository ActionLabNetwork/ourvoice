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
          <div v-if="!showModerationControls"
            :class="{ 'col-span-2': showModifyForm, 'col-span-4': !showModifyForm }"
          >
            <ModerationControls @moderation-submit="handleModerationControlsSubmit" @moderation-action-change="handleModerationControlsActionChange" />
          </div>
          <div v-else class="col-span-4">
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
import ModerationPostCard from './ModerationPostCard.vue';
import ModerationVersionList from './ModerationVersionList.vue'
import ModifyPost, { type FormFields } from './ModifyPost.vue';
import ModerationControls from './ModerationControls.vue'

const props = defineProps({ deployment: { type: String, required: true } })

const latestPostVersion = computed(() => post.value?.versions[0])

const route = useRoute();
const router = useRouter();
const post = ref<ModerationPost | null>(null);
const version = ref<PostVersion | null>(latestPostVersion.value ?? null)
const modifyValues = ref<FormFields | null>(null)

const moderationPostsStore = useModerationPostsStore()
const userStore = useUserStore()

await userStore.setDeployment(props.deployment)

const handleVersionChange = async (newVersion: PostVersion) => {
  version.value = newVersion
  showModerationControls.value = newVersion === latestPostVersion.value && !(await hasModerated(userStore.userId))
}

const hasModerated = async (userId: string): Promise<boolean> => {
  if (!version.value) return false

  const versionModerators = Array.from(version.value.moderations.reduce((acc, moderation) => {
    if (moderation) acc.add(moderation.moderatorHash)
    return acc
  }, new Set<string>()))

  const promises = versionModerators.map((moderator) => authService.verifyHash(userId, props.deployment, moderator))

  const hasModeratedList = await Promise.all(promises)

  return hasModeratedList.includes(true)
}

const findSelfModeration = async () => {
  if (!version.value) return null

  const promises = version.value.moderations.map((moderation) => {
    return authService.verifyHash(userStore.userId, props.deployment, moderation.moderatorHash)
  })

  const moderators = await Promise.all(promises)
  return version.value.moderations[moderators.indexOf(true)]
}

const decisionIcon = { icon: 'fa-check', color: '#ffffff' }

const showModerationControls = ref<boolean>(true)
const showModifyForm = ref<boolean>(false)

showModerationControls.value = (latestPostVersion.value ?? false) && !(await hasModerated(userStore.userId))

onMounted(async () => {
  post.value = await moderationPostsStore.fetchPostById(+route.params.id)
  version.value = post.value?.versions[0] ?? null
  version.value = post.value?.versions[0] ?? null

  console.log(await findSelfModeration())
});

watch(post, newPost => {
  post.value = newPost
})

const acceptPost = async (reason: string) => {
  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version.value) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.approvePostVersion(version.value.id, userStore.sessionHash, reason)
};

const modifyPost = async (values: FormFields, reason: string) => {
  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!post.value) {
    console.error('No post selected')
    return
  }

  if (!version.value) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.modifyModerationPost(post.value.id, userStore.sessionHash, reason, values)
}

const rejectPost = async (reason: string) => {
  if (!userStore.userId) {
    console.error('User not logged in')
    return
  }

  if (!version.value) {
    console.error('No version selected')
    return
  }

  await moderationPostsStore.rejectPostVersion(version.value.id, userStore.sessionHash, reason)
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
