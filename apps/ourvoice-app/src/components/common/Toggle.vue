<template>
  <button
    :class="twMerge('mx-5 py-1 bg-white rounded-full h-fit', props.className)"
    @click="toggle"
  >
    <div class="grid grid-cols-2 gap-2 justify-center text-center px-2 relative w-[18.7rem]">
      <!-- Left element -->
      <div class="rounded-full px-3 py-3 transition duration-300 ease-in-out">
        <div
          class="flex items-center justify-center gap-2 min-w-24 transition-opacity duration-300"
          :class="[isOnTheLeft ? 'invisible' : 'visible']"
        >
          <span :v-if="!!props.items.left.iconLight">
            <img :src="props.items.left.iconLight" alt="icon" />
          </span>
          <span>{{ props.items.left.label }}</span>
        </div>
      </div>
      <!-- Right Element -->
      <div class="rounded-full px-3 py-3 transition duration-300 ease-in-out">
        <div
          class="flex items-center justify-center gap-2 min-w-24 transition-opacity duration-300"
          :class="[!isOnTheLeft ? 'invisible' : 'visible']"
        >
          <span :v-if="!!props.items.right.iconLight">
            <img :src="props.items.right.iconLight" alt="icon" />
          </span>
          <span>
            {{ props.items.right.label }}
          </span>
          <span v-if="isOnTheLeft ? props.items.right.hasUpdates : props.items.left.hasUpdates">
            <div class="h-2 w-2 rounded-full bg-current text-ourvoice-accent-1" />
          </span>
        </div>
      </div>

      <!-- This is the element that's moving -->
      <div
        class="border rounded-full px-5 py-3 bg-black transition duration-200 ease-in-out absolute left-1 -top-0.5 w-[9.7rem]"
        :class="[isOnTheLeft ? '' : `translate-x-[8.5rem]`]"
      >
        <div class="flex gap-2 min-w-24 justify-center">
          <span :v-if="props.items.right.iconDark && props.items.left.iconDark">
            <img
              :src="!isOnTheLeft ? props.items.right.iconDark : props.items.left.iconDark"
              alt="icon"
            />
          </span>
          <span class="text-white">{{
            isOnTheLeft ? props.items.left.label : props.items.right.label
          }}</span>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { twMerge } from 'tailwind-merge'

import type { ToggleItems } from '@/types'

type Events = {
  onToggle: (e: 'onToggle', direction: 'left' | 'right') => void
}

const props = defineProps({
  items: {
    type: Object as () => ToggleItems,
    required: true
  },
  startLeft: {
    type: Boolean,
    default: true
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<Events['onToggle']>()

const isOnTheLeft = ref(props.startLeft)

const toggle = () => {
  isOnTheLeft.value = !isOnTheLeft.value
  emit('onToggle', isOnTheLeft.value ? 'left' : 'right')
}
</script>
