<template>
  <div v-if="comment && version" class="bg-slate-100 shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3">
    <!-- Self moderation indicator -->
    <div class="absolute right-10" v-if="props.decisionIcon">
      <div :class="[props.decisionIcon?.indicatorClass, 'flex gap-2 items-center rounded-full p-1 px-2']">
        <div class="h-2 w-2 rounded-full bg-current" />
        <p>{{ props.decisionIcon?.text }} by you</p>
      </div>
    </div>

    <!-- Author -->
    <AuthorBadge
      :authorName="nickname.author.nickname"
      :authorAvatar="`https://ui-avatars.com/api/?name=${nickname.author.parts.first}+${nickname.author.parts.last}`"
      :modificationDate="formattedDate(version)"
      :modifierName="nickname.moderator.nickname"
    />

    <!-- Content -->
    <p class="text-gray-700 text-lg leading-relaxed mb-3">{{ version.content }}</p>

    <!-- Moderation decisions count -->
    <div v-if="props.version?.moderations?.length && props.version.moderations.length > 0" class="flex gap-3 justify-around">
      <div v-for="(count, decision) in moderationResultGroups" :key="decision">
        <p class="text-xs text-gray-600">
          {{ decision }}: {{ count }}
        </p>
      </div>
    </div>

    <!-- Moderate button -->
    <div class="mt-4" v-if="!preview && comment.status === 'PENDING'">
      <router-link v-if="comment && comment.id"
        :to="{ name: 'moderate-comment', params: { id: comment.id } }"
        class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Moderate
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';
import AuthorBadge from '@/components/common/AuthorBadge.vue';

import type { Moderation, ModerationComment, CommentVersion } from '@/stores/moderation-comments';
import type { PropType, ComputedRef } from 'vue';
import type { ModeratedPostNicknames, ModerationVersionDecision } from '@/types/moderation';
import { getGroupsByProperty } from '@/utils/groupByProperty';

interface DecisionIcon {
  text: string;
  indicatorClass: string;
}

const props = defineProps({
  comment: {
    type: Object as PropType<ModerationComment>,
    required: true
  },
  version: {
    type: Object as PropType<CommentVersion>,
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
});

const version = computed(() => props.version)
const comment = computed(() => props.comment)

const nickname: ComputedRef<ModeratedPostNicknames> = computed(() => {
  const authorNickname = comment.value?.versions.at(-1).authorNickname
  const moderatorNickname = version.value?.authorNickname !== authorNickname ? version.value?.authorNickname : null

  const nicknameSeparator = '_'
  const [aFirst, aMiddle, aLast] = authorNickname.split(nicknameSeparator)
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
  const groups: Record<ModerationVersionDecision, Moderation[]> = version.value?.moderations.reduce((acc, moderation) => {
    return getGroupsByProperty('decision', acc, moderation)
  }, {
    ACCEPTED: [],
    REJECTED: []
  });

  const groupsCount: Record<ModerationVersionDecision, number> = { ACCEPTED: 0, REJECTED: 0 }

  if (groups) {
    Object.keys(groups).forEach((key) => {
      groupsCount[key] = groups[key].length;
    });
  }

  return groupsCount
})

const formattedDate = (version: CommentVersion) =>
  formatTimestampToReadableDate(+version.timestamp);
</script>
