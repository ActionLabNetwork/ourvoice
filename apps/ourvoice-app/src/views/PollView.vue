<template>
  <div class="w-full h-full flex flex-col">
    <!-- available polls -->
    <div class="w-full pt-8 pb-12 lg:pb-16 flex-grow flex flex-col items-center">
      <div
        class="px-4 w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch justify-items-stretch"
      >
        <div v-for="poll in availablePolls" :key="poll.id" class="w-full h-full">
          <ActivePollCard :poll="poll" />
        </div>
      </div>
      <div
        v-if="state === 'loaded' && availablePolls.length === 0"
        class="w-full p-6 py-10 flex flex-col items-center"
      >
        <img
          class="lg:mb-4 w-full max-w-[232px] lg:max-w-[400px]"
          src="@/assets/polls_no_active.png"
          alt=""
        />
        <div class="mb-10 text-[14px] lg:text-[28px] text-[#444] font-semibold">
          No polls are running
        </div>
        <button
          class="min-w-[212px] px-2 py-4 rounded-full bg-ourvoice-primary text-ourvoice-white text-[18px] font-medium"
          @click="$router.push({ name: 'posts' })"
        >
          Go Back to Discussion
        </button>
      </div>
    </div>
    <!-- past polls -->
    <div
      v-if="votedPolls.length !== 0"
      class="w-full py-8 lg:py-12 flex flex-col items-center bg-ourvoice-primary"
    >
      <div
        class="px-4 w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch justify-items-stretch"
      >
        <h4 class="mb-4 px-4 col-span-full">Polls you have voted on</h4>
        <div v-for="poll in votedPolls" :key="poll.id" class="w-ful h-full">
          <PollResultCard :poll="poll" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivePollCard from '@/components/poll/ActivePollCard.vue'
import PollResultCard from '@/components/poll/PollResultCard.vue'
import { usePollStore } from '@/stores/poll'
import { storeToRefs } from 'pinia'

const pollStore = usePollStore()
const { availablePolls, votedPolls, state } = storeToRefs(pollStore)
if (state.value === 'initial') {
  pollStore.initialLoad()
}
</script>
