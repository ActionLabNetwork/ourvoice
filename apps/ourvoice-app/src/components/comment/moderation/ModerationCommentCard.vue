<template>
  <div
    v-if="comment && version"
    class="bg-slate-100 shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3"
  >
    <div class="flex items-center justify-between">
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
            {{ `${moderationCount}/${comment.requiredModerations}` }} Moderated
          </div>
        </div>

        <!-- Self moderation indicator -->
        <div
          class="absolute right-10"
          v-if="props.decisionIcon"
          data-cy="self-moderation-indicator"
        >
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

    <!-- Content -->
    <p class="text-gray-700 text-md sm:text-lg leading-relaxed mb-3">{{ version.content }}</p>

    <!-- Moderation decisions count -->
    <div
      v-if="
        props.version &&
        isModerationCommentVersion(props.version) &&
        props.version?.moderations?.length &&
        props.version.moderations.length > 0
      "
      class="flex flex-col sm:flex-row gap-3 justify-center sm:justify-around mx-auto sm:mx-0"
      data-cy="comment-moderation-decisions-count"
    >
      <div v-for="(count, decision) in moderationResultGroups" :key="decision">
        <p class="text-xs text-gray-600">{{ decision }}: {{ count }}</p>
      </div>
    </div>

    <!-- Moderate button -->
    <div
      class="mt-4 mx-auto sm:mx-0"
      v-if="!preview && isModerationComment(comment) && comment.status === 'PENDING'"
    >
      <CustomButton
        :show="!!(comment && comment.id)"
        :to="{ name: 'moderate-comment', params: { id: comment.id } }"
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
import { getGroupsByProperty } from '@/utils/groupByProperty'
import { isModerationComment, isModerationCommentVersion } from '@/utils/types'

import AuthorBadge from '@/components/common/AuthorBadge.vue'
import CustomButton from '@/components/common/CustomButton.vue'

import type { Moderation } from '@/stores/moderation-comments'
import type {
  ModerationComment,
  ModerationCommentVersion,
  ModerationCommentParent,
  ModerationCommentParentVersion
} from '@/stores/comment-moderation'
import type { PropType } from 'vue'
import type { ModerationVersionDecision } from '@/types/moderation'

interface DecisionIcon {
  text: string
  indicatorClass: string
}

const props = defineProps({
  comment: {
    type: Object as PropType<ModerationComment | ModerationCommentParent>,
    required: true
  },
  version: {
    type: Object as PropType<ModerationCommentVersion | ModerationCommentParentVersion>,
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
const comment = computed(() => props.comment)

const nickname = computed(() => {
  const authorNickname = comment.value?.versions?.at(-1)?.authorNickname
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
  if (!version.value || !isModerationCommentVersion(version.value))
    return { ACCEPTED: 0, REJECTED: 0 }

  const groups: Record<ModerationVersionDecision, Moderation[]> | undefined =
    version.value?.moderations?.reduce(
      (acc, moderation) => {
        return getGroupsByProperty('decision', acc, moderation)
      },
      { ACCEPTED: [] as Moderation[], REJECTED: [] as Moderation[] }
    )

  const groupsCount: Record<ModerationVersionDecision, number> = { ACCEPTED: 0, REJECTED: 0 }

  if (groups) {
    ;(Object.keys(groups) as Array<keyof typeof groups>).forEach((key) => {
      groupsCount[key] = groups[key].length
    })
  }

  return groupsCount
})

const moderationCount = computed(() => {
  return moderationResultGroups.value.ACCEPTED + moderationResultGroups.value.REJECTED
})
</script>
