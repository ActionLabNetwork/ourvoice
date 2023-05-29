<template>
  <div class="flow-root">
    <ul class="divide-y divide-white/5">
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
            <p><span class="font-semibold">Reason: </span>{{ moderation.reason }}</p>
            <p class="whitespace-nowrap">
              {{ moderation.decision + " at " + formatTimestampToReadableDate(+moderation.timestamp) }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useModerationPostsStore } from '@/stores/moderation-posts';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';

const moderationPostsStore = useModerationPostsStore();

const { versionInModeration: version } = storeToRefs(moderationPostsStore);
const moderations = computed(() => version.value?.moderations);
console.log(version?.value)
console.log(moderations.value)

const actions = {
  ACCEPTED: 'text-green-500 bg-green-400/10',
  REJECTED: 'text-rose-500 bg-rose-400/10',
}
</script>
