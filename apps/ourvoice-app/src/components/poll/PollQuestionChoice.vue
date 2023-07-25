<template>
  <div
    v-if="state === 'choice'"
    class="relative h-full p-8 flex flex-col rounded-lg shadow-lg"
    ref="questionDiv"
  >
    <div class="mb-8">
      <h4>{{ poll.question }}</h4>
    </div>
    <RadioGroup v-model="selectedOptionId" class="px-4 flex flex-col gap-4">
      <RadioGroupOption
        v-for="option in poll.options"
        :key="option.id"
        v-slot="{ checked }"
        :value="option.id"
        class="flex flex-row items-center gap-4"
      >
        <div
          role="radio"
          :aria-checked="checked"
          @click="selectOption(option.id)"
          class="w-4 h-4 border-2 border-[#3D3D3D] rounded-[4px]"
          :class="{ 'bg-ourvoice-primary': checked }"
        />
        {{ option.option }}
      </RadioGroupOption>
    </RadioGroup>
    <div class="min-h-[56px] flex-grow" />
    <button
      @click="state = 'confirmation'"
      :disabled="selectedOptionId === undefined"
      class="w-[200px] flex-grow-0 flex-shrink-0 px-6 py-4 rounded-lg"
      :class="selectedOptionId === undefined ? 'bg-gray-200' : 'bg-ourvoice-primary'"
    >
      Vote
    </button>
  </div>
  <div
    v-else
    class="px-12 py-4 flex flex-col justify-center bg-[#F5F5F5]"
    :style="confirmationDialogStyle"
  >
    <h4 class="mb-6">Are you sure you want to submit your pole?</h4>
    <div class="px-4 py-6 flex flex-row gap-4">
      <button
        @click="state = 'choice'"
        class="flex-grow px-2 py-4 rounded-lg border-black border-2"
      >
        No
      </button>
      <button
        @click="vote(selectedOptionId)"
        class="flex-grow px-2 py-4 rounded-lg bg-ourvoice-primary"
      >
        Yes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePollStore, type AvailablePollState } from '@/stores/poll'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { useElementBounding } from '@vueuse/core'
import { computed, ref, watchEffect, type PropType } from 'vue'

const props = defineProps({
  poll: {
    type: Object as PropType<AvailablePollState>,
    required: true
  }
})
const pollStore = usePollStore()
function vote(optionId: number | undefined) {
  if (!optionId) {
    throw new Error('optionId is undefined but user was able to press vote button')
  }
  pollStore.votePoll(optionId, props.poll.id)
}
const state = ref<'choice' | 'confirmation'>('choice')

const selectedOptionId = ref<number | undefined>(undefined)
function selectOption(optionId: number) {
  selectedOptionId.value = optionId
}

const questionDiv = ref(null)
const questionDivBBox = useElementBounding(questionDiv)
const measuredHeight = ref(0)
watchEffect(() => {
  measuredHeight.value = Math.max(questionDivBBox.height.value, measuredHeight.value)
})
const confirmationDialogStyle = computed(() => ({
  height: measuredHeight.value + 'px'
}))
</script>
