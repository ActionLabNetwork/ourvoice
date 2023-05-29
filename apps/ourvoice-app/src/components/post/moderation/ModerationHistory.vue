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
                <span class="truncate">{{ moderation.moderatorHash }}</span>
                <span class="absolute inset-0" />
              </div>
            </h2>
          </div>
          <div class="mt-3 flex flex-col divide-y gap-x-2.5 text-xs leading-5 text-gray-500">
            <p>
              <span v-if="moderation.reason.length" class="font-semibold">Reason: </span>
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
import { useModerationPostsStore } from '@/stores/moderation-posts';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';

interface History {
  id: number;
  decision: 'ACCEPTED' | 'REJECTED' | 'MODIFIED';
  reason: string;
  timestamp: string;
  moderatorHash: string;
}

const moderationPostsStore = useModerationPostsStore();

const { versionInModeration: version } = storeToRefs(moderationPostsStore);
const moderations = computed(() => {
  if (!version.value) return []

  const acceptOrRejectModerations: History[] = version.value?.moderations.map(({ id, decision, reason, timestamp, moderatorHash }) => ({
    id,
    decision,
    reason,
    timestamp,
    moderatorHash
  })) ?? []

  const modifyModerations: History[] = [{ id: version.value.id, decision: 'MODIFIED', reason: version.value?.reason, timestamp: version.value?.timestamp, moderatorHash: version.value?.authorHash }]

  return modifyModerations.concat(acceptOrRejectModerations)
});

const actions = {
  ACCEPTED: 'text-green-500 bg-green-400/10',
  REJECTED: 'text-rose-500 bg-rose-400/10',
  MODIFIED: 'text-yellow-500 bg-yellow-400/10'
}
</script>
