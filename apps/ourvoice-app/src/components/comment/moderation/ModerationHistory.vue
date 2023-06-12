<template>
  <div class="flow-root">
    <ul v-if="moderations && moderations.length" class="divide-y divide-white/5">
      <li v-for="moderation in moderations" :key="moderation.id" class="relative flex items-center space-x-4 py-4">
        <div class="min-w-0 flex-auto">
          <div class="flex items-center gap-x-3">
            <div :class="[actions[moderation.decision], 'flex-none rounded-full p-1']">
              <div class="h-2 w-2 rounded-full bg-current" />
            </div>
            <h2 class="min-w-0 text-sm font-semibold leading-6">
              <div class="flex gap-x-2">
                <span class="truncate">{{ moderation.moderatorNickname }}</span>
                <span class="absolute inset-0" />
              </div>
            </h2>
          </div>
          <div class="mt-3 flex flex-col divide-y gap-x-2.5 text-xs leading-5 text-gray-500">
            <p>
              <span v-if="moderation.reason && moderation.reason.length" class="font-semibold">Reason: </span>
              <span v-else class="font-semibold">No reason specified </span>
              {{ moderation.reason }}
            </p>
            <p class="whitespace-nowrap">
              {{ moderation.decision + " at " + formatTimestampToReadableDate(+moderation.timestamp) }}
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div v-else>
      <p class="text-gray-400 text-xs">No Moderation History</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModerationCommentsStore } from '@/stores/moderation-comments';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';
import type { Moderation, ModerationVersionDecisionHistory } from '@/types/moderation'

interface History {
  id: number;
  decision: ModerationVersionDecisionHistory;
  reason: string;
  timestamp: string;
  moderatorHash: string;
  moderatorNickname: string;
}

const moderationCommentsStore = useModerationCommentsStore();

const { versionInModeration: version } = storeToRefs(moderationCommentsStore);

const moderations = computed(() => {
  if (!version.value) return []

  const acceptOrRejectModerations: History[] = version.value?.moderations.map(({ id, decision, reason, timestamp, moderatorHash, moderatorNickname }) => ({
    id,
    decision,
    reason,
    timestamp,
    moderatorHash,
    moderatorNickname
  })) ?? []

  const modifyModerations: History[] = version.value.version > 1 ? [{ id: version.value.id, decision: 'MODIFIED', reason: version.value?.reason, timestamp: version.value?.timestamp, moderatorHash: version.value?.authorHash, moderatorNickname: version.value?.authorNickname }] : []

  const moderations = acceptOrRejectModerations.concat(modifyModerations)

  return moderations
});

const actions = {
  ACCEPTED: 'text-green-500 bg-green-400/10',
  REJECTED: 'text-rose-500 bg-rose-400/10',
  MODIFIED: 'text-yellow-500 bg-yellow-400/10'
}
</script>
