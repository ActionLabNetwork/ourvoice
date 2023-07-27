<template>
  <div class="h-full w-full flex flex-col justify-items-center w-full px-6 py-6 bg-white rounded-lg">
    <p class="mb-6 text-[16px] font-medium">{{ props.poll.question }}</p>
    <div v-if="mergedStats !== null" class="flex flex-col gap-4">
      <table class="table-auto">
        <div v-for="option in mergedStats" :key="option.id" class="flex flex-row gap-2">
          <div class="w-fit font-normal text-12 min-w-[40px]" valign="top">
            {{ (option.proportion * 100).toFixed(0).padStart(4, ' ') }}%
          </div>
          <div class="flex flex-col flex-grow mb-1">
            <div class="font-normal text-14 mb-1">
              {{ option.option }}
            </div>
            <div class="h-2 w-full bg-black rounded-full" :style="option.style"></div>
          </div>
        </div>
      </table>
    </div>
    <div v-else class="text-[#222] text-sm">
      Not enough people have voted in the poll. Results are hidden.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PollWithStatsSub } from '@/stores/poll';
import { computed, type PropType } from 'vue';

const props = defineProps({
  poll: {
    type: Object as PropType<PollWithStatsSub>,
    required: true
  }
})

const resultColor = ['#59CC57', '#FFCD29', '#FF7629', '#29B2FF']

const mergedStats = computed(() => {
  const stats = props.poll.stats
  if (!stats) return null
  const merged = props.poll.options.map((option) => ({
    ...option,
    proportion: stats.find((stat) => stat.optionId === option.id)?.proportion ?? 0
  }))
  const highestProportion = Math.max(...merged.map((option) => option.proportion))
  return merged.map((option, index) => ({
    ...option,
    relativeProportion: option.proportion / highestProportion,
    style: {
      width: `${option.proportion * 100}%`,
      backgroundColor: resultColor[index % resultColor.length]
    }
  }))
})
</script>
