<template>
  <div class="w-full h-full">
    <PollQuestionChoice v-if="poll.pollState === 'NOT_VOTED'" :poll="props.poll" />
    <div
      v-else
      class="h-full p-4 pt-8 flex flex-col justify-center rounded-lg bg-ourvoice-primary"
    >
      <h4 class="mb-8 text-center">Thanks for submitting!</h4>
      <PollResultCard :poll="props.poll" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AvailablePollState } from '@/stores/poll'
import type { PropType } from 'vue'
import PollQuestionChoice from './PollQuestionChoice.vue'
import PollResultCard from './PollResultCard.vue'

const props = defineProps({
  poll: {
    type: Object as PropType<AvailablePollState>,
    required: true
  }
})
</script>
