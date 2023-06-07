<template>
  <div v-if="comment && version" class="bg-white shadow-lg border border-gray-200 rounded-t-lg p-6 hover:shadow-xl transition-all duration-200 relative flex flex-col gap-3">
    <!-- Self moderation indicator -->
    <div class="absolute right-10" v-if="props.decisionIcon">
      <div :class="[props.decisionIcon?.indicatorClass, 'flex gap-2 items-center rounded-full p-1 px-2']">
        <div class="h-2 w-2 rounded-full bg-current" />
        <p>{{ props.decisionIcon?.text }} by you</p>
      </div>
    </div>

    <!-- Author -->
    <div class="group block flex-shrink-0 mb-3">
      <div class="flex items-center">
        <div>
          <img class="inline-block h-9 w-9 rounded-full" :src="`https://ui-avatars.com/api/?name=${nickname.author.parts.first}+${nickname.author.parts.last}`" alt="PseudoNickname" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-700">
            {{ nickname.author.nickname }}
            <span v-if="!!nickname.moderator.nickname" class="italic font-light text-orange-700">
              (Modified by {{ nickname.moderator.nickname }})
            </span>
          </p>
          <p class="text-xs font-medium text-gray-500">
            {{ `${formattedDate(version)}` }}
          </p>
        </div>
      </div>
    </div>

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
    <div class="mt-4" v-if="!preview && version.status === 'PENDING'">
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
import type { Moderation, ModerationComment, CommentVersion } from '@/stores/moderation-comments';
import type { PropType } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';

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

const nickname = computed(() => {
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
  const groups = version.value?.moderations.reduce((acc, moderation) => {
    const group = moderation.decision
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(moderation);
    return acc;
  }, {} as Record<string, Moderation[]>);

  const groupsCount = {} as Record<string, number>

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
