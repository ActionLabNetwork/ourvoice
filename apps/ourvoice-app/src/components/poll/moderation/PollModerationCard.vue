<template>
  <div class="h-full w-full p-4 flex flex-col gap-2 shadow-lg rounded-lg">
    <h4 class="text-[16px] mb-2">{{ poll.question }}</h4>
    <div class="p-4 flex flex-col gap-1 bg-ourvoice-white rounded-lg">
      <div v-for="option in computedOptions" :key="option.id" class="flex flex-row">
        <div class="mr-2 w-fit text-12 min-w-[60px]">
          {{ option.numVotes }} ({{ (option.proportion * 100).toFixed(0) }}%)
        </div>
        <div class="flex flex-col flex-grow mb-1">
          <div class="mb-1">
            {{ option.option }}
          </div>
          <div class="h-2 w-full rounded-full" :style="option.style" />
        </div>
      </div>
    </div>
    <div class="flex-grow"/>
    <div class="flex flex-col text-sm">
      <div>{{ poll.published ? 'Published' : 'Not published' }}</div>
      <div>{{ poll.active ? 'Poll is currently active' : 'Poll is not active' }}</div>
      <div v-if="poll.expiresAt">
        Closing date: {{ formatTimestampToReadableDate(poll.expiresAt) }}
      </div>
      <div v-else>Poll does not have a closing date</div>
    </div>
    <div class="flex flex-row gap-2 justify-between">
      <button class="btn-primary btn-rounded min-w-[100px]" @click="isEditing = !isEditing">
        Edit
      </button>
      <button v-if="!locked" class="btn-outline btn-rounded" @click="removePoll">
        <font-awesome-icon :icon="faTrash" alt="Delete Poll" class="text-gray-600"/>
      </button>
    </div>
    <Dialog :open="isEditing" @close="isEditing = false" class="relative z-50">
      <PollEditDialog
        title="Edit Poll"
        :poll="poll"
        @submit="updatePoll"
        @close="isEditing = false"
        :locked="locked"
      />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { PollCreateInput, PollWithResult } from '@/graphql/generated/graphql'
import { useModerationPollStore } from '@/stores/moderation-poll'
import { areArraysEqual } from '@/utils/array'
import { ref, type PropType, computed } from 'vue'
import PollEditDialog from './PollEditDialog.vue'
import { formatTimestampToReadableDate } from '@/utils'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  poll: {
    type: Object as PropType<PollWithResult>,
    required: true
  }
})

const resultColor = ['#59CC57', '#FFCD29', '#FF7629', '#29B2FF']

const computedOptions = computed(() => {
  const options = props.poll.options
  const totalNumVotes = options.reduce((acc, option) => acc + option.numVotes, 0)
  return options
    .map((option) => ({
      ...option,
      proportion: totalNumVotes === 0 ? 0 : option.numVotes / totalNumVotes
    }))
    .map((option, index) => ({
      ...option,
      style: {
        width: `${option.proportion * 100}%`,
        backgroundColor: resultColor[index % resultColor.length]
      }
    }))
})

const locked = computed(
  () => props.poll.options.reduce((acc, option) => acc + option.numVotes, 0) > 0
)

const isEditing = ref(false)
const pollModerationStore = useModerationPollStore()
function updatePoll(input: PollCreateInput) {
  const diffedInput = {
    ...input,
    question: input.question === props.poll.question ? undefined : input.question,
    options: areArraysEqual(
      input.options?.map((option) => option.option),
      props.poll.options.map((option) => option.option)
    )
      ? undefined
      : input.options
  }
  pollModerationStore.updatePoll(props.poll.id, diffedInput)
}

function removePoll() {
  pollModerationStore.removePoll(props.poll.id)
}
</script>
