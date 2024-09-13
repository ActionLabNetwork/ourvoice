<template>
  <div class="flex flex-col items-center">
    <div class="w-full p-4 flex flex-col items-center">
      <button class="btn-primary btn-rounded min-w-[200px]" @click="isCreatingPoll = true">
        Create Poll
      </button>
    </div>
    <dialog-component class="relative z-50" :open="isCreatingPoll" @close="isCreatingPoll = false">
      <poll-edit-dialog
        :locked="false"
        :poll="undefined"
        title="Create Poll"
        @close="isCreatingPoll = false"
        @submit="createPoll"
      />
    </dialog-component>

    <div
      class="w-fit p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center justify-items-stretch items-stretch gap-4"
    >
      <div v-for="poll in polls" :key="poll.id" class="max-w-[600px]">
        <poll-moderation-card :poll="poll" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dialog as DialogComponent } from '@headlessui/vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import type { PollCreateInput, PollUpdateInput } from '@/graphql/generated/graphql'
import PollEditDialog from '@/components/poll/moderation/PollEditDialog.vue'
import PollModerationCard from '@/components/poll/moderation/PollModerationCard.vue'
import { useModerationPollStore } from '@/stores/moderation-poll'

const moderationPollStore = useModerationPollStore()
const { polls, state } = storeToRefs(moderationPollStore)

const isCreatingPoll = ref(false)

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
async function fetch() {
  await moderationPollStore.fetchPolls()
}

async function createPoll(data: PollCreateInput) {
  await moderationPollStore.createPoll(data)
}

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
async function updatePoll(id: number, data: PollUpdateInput) {
  await moderationPollStore.updatePoll(id, data)
}

if (state.value === 'initial') {
  moderationPollStore.fetchPolls()
}
</script>
