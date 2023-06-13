<template>
  <div v-if="post && version" class="bg-white shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3">
    <!-- Self moderation indicator -->
    <div class="absolute right-10" v-if="props.decisionIcon">
      <div :class="[props.decisionIcon?.indicatorClass, 'flex gap-2 items-center rounded-full p-1 px-2']">
        <div class="h-2 w-2 rounded-full bg-current" />
        <p>{{ props.decisionIcon?.text }} by you</p>
      </div>
    </div>

    <!-- Author -->
    <AuthorBadge v-if="nickname.author.nickname"
      :authorName="nickname.author.nickname"
      :authorAvatar="`https://ui-avatars.com/api/?name=${nickname.author.parts.first}+${nickname.author.parts.last}`"
      :modificationDate="formattedDate(version)"
      :modifierName="nickname.moderator.nickname"
    />

    <!-- Title -->
    <h3 class="text-2xl font-extrabold text-black-700 mb-3">
      {{ version.title }}
    </h3>

    <!-- Content -->
    <p class="text-gray-700 text-lg leading-relaxed mb-3">
      {{ version.content }}
    </p>

    <!-- Categories -->
    <div class="flex flex-wrap">
      <div v-for="{ id, name } in version.categories" :key="id" class="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-2">
        {{ name }}
      </div>
    </div>

    <!-- Attachments -->
    <div>
      <p v-if="version.files" class="mt-2 text-gray-400 text-md mb-2">
        {{ `${version.files.length}` }} attachments
      </p>
      <AttachmentBadge v-if="version.attachmentsDownloadUrls"  :files="version.attachmentsDownloadUrls" />
    </div>

    <!-- Moderation decisions count -->
    <div v-if="props.version?.moderations?.length && props.version.moderations.length > 0" class="flex gap-3 justify-around">
      <div v-for="(count, decision) in moderationResultGroups" :key="decision">
        <p class="text-xs text-gray-600">
          {{ decision }}: {{ count }}
        </p>
      </div>
    </div>

    <!-- Moderate button -->
    <div class="mt-4" v-if="!preview && post.status === 'PENDING'">
      <router-link v-if="post && post.id"
        :to="{ name: 'moderate-post', params: { id: post.id } }"
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
import AttachmentBadge from '@/components/common/AttachmentBadge.vue';
import type { ModeratedPostNicknames, ModerationVersionDecision } from '@/types/moderation';
import { getGroupsByProperty } from '@/utils/groupByProperty';
import AuthorBadge from '@/components/common/AuthorBadge.vue';

import type { ComputedRef } from 'vue'
import type { Moderation, ModerationPost, PostVersion } from '@/stores/moderation-posts';
import type { ModerationPost as CModerationPost } from '@/stores/moderation-comments'
import type { PropType } from 'vue';

interface DecisionIcon {
  text: string;
  indicatorClass: string;
}

const props = defineProps({
  post: {
    type: Object as PropType<ModerationPost | CModerationPost>,
    required: true
  },
  version: {
    type: Object as PropType<PostVersion>,
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
const post = computed(() => props.post)

const nickname = computed(() => {
  const authorNickname = post.value?.versions?.at(-1)?.authorNickname
  const moderatorNickname = version.value?.authorNickname !== authorNickname ? version.value?.authorNickname : undefined

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
  const groups: Record<ModerationVersionDecision, Moderation[]> | undefined = version.value?.moderations.reduce((acc, moderation) => {
    return getGroupsByProperty('decision', acc, moderation)
  }, { ACCEPTED: [] as Moderation[], REJECTED: [] as Moderation[] });

  const groupsCount: Record<ModerationVersionDecision, number> = {
    ACCEPTED: 0,
    REJECTED: 0
  }

  if (groups) {
    (Object.keys(groups) as Array<keyof typeof groups>).forEach((key: ModerationVersionDecision) => {
      groupsCount[key] = groups[key].length;
    });
  }

  return groupsCount
})

const formattedDate = (version: PostVersion) =>
  formatTimestampToReadableDate(+version.timestamp);
</script>
