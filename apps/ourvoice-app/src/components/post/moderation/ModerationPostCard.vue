<template>
  <div
    v-if="post && version"
    class="bg-white drop-shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-2 md:gap-3"
    :class="[props.preview ? 'rounded-t-2xl' : 'rounded-2xl']"
  >
    <div class="flex flex-col md:flex-row justify-between items-left md:items-center">
      <!-- Author -->
      <AuthorBadge
        v-if="nickname.author.nickname"
        :authorName="nickname.author.nickname"
        :authorAvatar="`https://ui-avatars.com/api/?name=${nickname.author.parts.first}+${nickname.author.parts.last}`"
        :modificationDate="formatTimestampToReadableDate(Number(version.timestamp))"
        :modifierName="nickname.moderator.nickname"
      />

      <div>
        <!-- Moderated Count -->
        <div
          class="h-8 px-4 py-2 bg-ourvoice-util-pink rounded-3xl justify-center items-center gap-2 inline-flex"
        >
          <div
            class="text-center text-ourvoice-black text-xs font-medium leading-none tracking-tight"
          >
            {{ `${moderationCount}/${post.requiredModerations}` }} Moderated
          </div>
        </div>

        <!-- Self moderation indicator -->
        <div v-if="props.decisionIcon" data-cy="self-moderation-indicator">
          <div
            :class="[
              props.decisionIcon?.indicatorClass,
              'flex gap-2 items-center rounded-full p-1 px-2'
            ]"
          >
            <div class="h-2 w-2 rounded-full bg-current" />
            <p>{{ props.decisionIcon?.text }} by you</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-xl sm:text-2xl font-extrabold text-ourvoice-black mb-3">
      {{ version.title }}
    </h3>

    <!-- Content -->
    <p class="text-ourvoice-neutral-body text-md sm:text-lg leading-relaxed mb-3">
      {{ version.content }}
    </p>

    <!-- Categories -->
    <div class="flex flex-wrap flex-row text-center justify-start">
      <div
        v-for="{ id, name } in version.categories"
        :key="id"
        class="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-2"
      >
        {{ name }}
      </div>
    </div>

    <!-- Attachments -->
    <div>
      <p v-if="version.files" class="mt-2 text-gray-400 text-md mb-2">
        {{ `${version.files.length}` }} attachments
      </p>
      <AttachmentBadge
        v-if="version.attachmentsDownloadUrls"
        :files="version.attachmentsDownloadUrls"
      />
    </div>

    <!-- Moderation decisions count -->
    <div
      v-if="props.version?.moderations?.length && props.version.moderations.length > 0"
      class="flex flex-row gap-3 justify-center mx-auto sm:mx-0 sm:justify-around"
      data-cy="moderation-decisions-count"
    >
      <div v-for="(count, decision) in moderationResultGroups" :key="decision">
        <p class="text-xs text-gray-600">{{ decision }}: {{ count }}</p>
      </div>
    </div>

    <!-- Moderate button -->
    <div class="mt-4 mx-auto sm:mx-0" v-if="!preview && post.status === 'PENDING'">
      <CustomButton
        :show="!!(post && post.id)"
        :to="{ name: 'moderate-post', params: { id: post.id } }"
        data-cy="moderate-button"
        label="Moderate"
        class-name="bg-ourvoice-primary-3 text-white hover:bg-ourvoice-primary-3/80"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatTimestampToReadableDate } from '@/utils'
import AttachmentBadge from '@/components/common/AttachmentBadge.vue'
import type { ModerationVersionDecision } from '@/types/moderation'
import { getGroupsByProperty } from '@/utils/groupByProperty'
import AuthorBadge from '@/components/common/AuthorBadge.vue'
import CustomButton from '@/components/common/CustomButton.vue'

import type { Moderation } from '@/stores/moderation-posts'
import type { ModerationPost, ModerationPostVersion } from '@/stores/post-moderation'
import type { PropType } from 'vue'

interface DecisionIcon {
  text: string
  indicatorClass: string
}

const props = defineProps({
  post: {
    type: Object as PropType<ModerationPost>,
    required: true
  },
  version: {
    type: Object as PropType<ModerationPostVersion>,
    required: false
  },
  preview: {
    type: Boolean,
    defaultValue: false
  },
  decisionIcon: {
    type: Object as PropType<DecisionIcon>,
    required: false
  }
})

const version = computed(() => props.version)
const post = computed(() => props.post)

const nickname = computed(() => {
  const authorNickname = post.value?.versions?.at(-1)?.authorNickname
  const moderatorNickname =
    version.value?.authorNickname !== authorNickname ? version.value?.authorNickname : undefined

  const nicknameSeparator = '_'
  const [aFirst, aMiddle, aLast] = authorNickname?.split(nicknameSeparator) || []
  const [mFirst, mMiddle, mLast] = moderatorNickname?.split(nicknameSeparator) || []

  return {
    author: {
      nickname: authorNickname,
      parts: {
        first: aFirst,
        middle: aMiddle,
        last: aLast
      }
    },
    moderator: {
      nickname: moderatorNickname,
      parts: {
        first: mFirst,
        middle: mMiddle,
        last: mLast
      }
    }
  }
})

const moderationResultGroups = computed(() => {
  if (!version.value?.moderations) return { ACCEPTED: 0, REJECTED: 0 }

  const groups: Record<ModerationVersionDecision, Moderation[]> | undefined =
    version.value?.moderations.reduce(
      (acc, moderation) => {
        return getGroupsByProperty('decision', acc, moderation)
      },
      { ACCEPTED: [] as Moderation[], REJECTED: [] as Moderation[] }
    )

  const groupsCount: Record<ModerationVersionDecision, number> = {
    ACCEPTED: 0,
    REJECTED: 0
  }

  if (groups) {
    ;(Object.keys(groups) as Array<keyof typeof groups>).forEach(
      (key: ModerationVersionDecision) => {
        groupsCount[key] = groups[key].length
      }
    )
  }

  return groupsCount
})

const moderationCount = computed(() => {
  return moderationResultGroups.value.ACCEPTED + moderationResultGroups.value.REJECTED
})
</script>
