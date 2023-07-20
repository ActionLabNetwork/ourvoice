<template>
  <button class="mx-5 py-1 bg-white rounded-full" @click="toggle">
    <div class="grid grid-cols-2 gap-2 justify-center text-center px-2 relative w-56">
      <div class="rounded-full px-3 py-3 transition duration-300 ease-in-out">
        <div
          class="flex items-center justify-center gap-2 min-w-24 transition-opacity duration-300"
          :class="[isOnTheLeft ? 'invisible' : 'visible']"
        >
          <span>
            <img
              :src="isOnTheLeft ? props.items.right.iconLight : props.items.left.iconLight"
              alt="icon"
            />
          </span>
          <span>{{ isOnTheLeft ? props.items.right.label : props.items.left.label }}</span>
        </div>
      </div>
      <div class="rounded-full px-3 py-3 transition duration-300 ease-in-out">
        <div
          class="flex items-center justify-center gap-2 min-w-24 transition-opacity duration-300"
          :class="[!isOnTheLeft ? 'invisible' : 'visible']"
        >
          <span>
            <img
              :src="isOnTheLeft ? props.items.right.iconLight : props.items.left.iconLight"
              alt="icon"
            />
          </span>
          <span>
            {{ isOnTheLeft ? props.items.right.label : props.items.left.label }}
          </span>
          <span v-if="isOnTheLeft ? props.items.right.hasUpdates : props.items.left.hasUpdates">
            <div class="h-2 w-2 rounded-full bg-current text-[#FFBE00]" />
          </span>
        </div>
      </div>

      <!-- This is the element that's moving -->
      <div
        class="border rounded-full px-5 py-3 bg-black transition duration-200 ease-in-out absolute left-1 -top-0.5"
        :class="[isOnTheLeft ? '' : 'translate-x-[6.5rem]']"
      >
        <div class="flex gap-2 min-w-24 justify-center">
          <span>
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

type ToggleItems = {
  [K in 'left' | 'right']: {
    label: string
    iconLight: string
    iconDark: string
    hasUpdates: boolean
  }
}

type Events = {
  onToggle: { (e: 'onToggle', direction: 'left' | 'right'): void }
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
  currentPath: { type: String, required: false }
})

const emit = defineEmits<Events['onToggle']>()

const isOnTheLeft = ref(props.startLeft)

const toggle = () => {
  isOnTheLeft.value = !isOnTheLeft.value
  emit('onToggle', isOnTheLeft.value ? 'left' : 'right')
}
</script>
