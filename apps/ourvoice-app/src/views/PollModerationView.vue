<template>
  <div class="flex flex-col items-center">
    <div class="w-full p-4 flex flex-col items-center">
      <button @click="isCreatingPoll = true" class="btn-primary btn-rounded min-w-[200px]">
        Create Poll
      </button>
    </div>
    <Dialog :open="isCreatingPoll" @close="isCreatingPoll = false" class="relative z-50">
      <PollEditDialog
        title="Create Poll"
        :poll="undefined"
        @submit="createPoll"
        @close="isCreatingPoll = false"
        :locked="false"
      />
    </Dialog>

    <div
      class="w-fit p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center justify-items-stretch items-stretch gap-4"
    >
      <div class="max-w-[600px]" v-for="poll in polls" :key="poll.id">
        <PollModerationCard :poll="poll" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModerationPollStore } from '@/stores/moderation-poll'
import { storeToRefs } from 'pinia'

import PollEditDialog from '@/components/poll/moderation/PollEditDialog.vue'
import PollModerationCard from '@/components/poll/moderation/PollModerationCard.vue'
import type { PollCreateInput, PollUpdateInput } from '@/graphql/generated/graphql'
import { ref } from 'vue'
import { Dialog } from '@headlessui/vue'

const moderationPollStore = useModerationPollStore()
const { polls, state } = storeToRefs(moderationPollStore)

const isCreatingPoll = ref(false)

async function fetch() {
  await moderationPollStore.fetchPolls()
}

async function createPoll(data: PollCreateInput) {
  await moderationPollStore.createPoll(data)
}

async function updatePoll(id: number, data: PollUpdateInput) {
  await moderationPollStore.updatePoll(id, data)
}

if (state.value == 'initial') {
  moderationPollStore.fetchPolls()
}
</script>
