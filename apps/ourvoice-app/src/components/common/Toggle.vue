<template>
  <div class="mx-5 py-1 bg-white rounded-full">
    <div class="grid grid-cols-2 gap-2 justify-center text-center px-2 relative w-56">
      <div class="rounded-full px-3 py-3 transition duration-300 ease-in-out">
        <div
          class="flex items-center justify-center gap-2 min-w-24 transition-opacity duration-300"
          :class="[enabled ? 'invisible' : 'visible']"
        >
          <span>
            <img
              :src="enabled ? props.items.right.iconLight : props.items.left.iconLight"
              alt="icon"
            />
          </span>
          <span>{{ enabled ? props.items.right.label : props.items.left.label }}</span>
        </div>
      </div>
      <div class="rounded-full px-3 py-3 transition duration-300 ease-in-out">
        <div
          class="flex items-center justify-center gap-2 min-w-24 transition-opacity duration-300"
          :class="[!enabled ? 'invisible' : 'visible']"
        >
          <span>
            <img
              :src="enabled ? props.items.right.iconLight : props.items.left.iconLight"
              alt="icon"
            />
          </span>
          <span>{{ enabled ? props.items.right.label : props.items.left.label }}</span>
        </div>
      </div>

      <!-- This is the element that's moving -->
      <button
        @click="toggle"
        class="border rounded-full px-5 py-3 bg-black transition duration-200 ease-in-out absolute left-1 -top-0.5"
        :class="[enabled ? '' : 'translate-x-[6.5rem]']"
      >
        <div class="flex gap-2 min-w-24 justify-center">
          <span>
            <img
              :src="!enabled ? props.items.right.iconDark : props.items.left.iconDark"
              alt="icon"
            />
          </span>
          <span class="text-white">{{
            enabled ? props.items.left.label : props.items.right.label
          }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type ToggleItems = {
  [K in 'left' | 'right']: {
    label: string
    iconLight: string
    iconDark: string
  }
}

type Events = {
  onToggle: { (e: 'onToggle', direction: 'left' | 'right'): void }
}

const props = defineProps({
  items: {
    type: Object as () => ToggleItems,
    required: true
  }
})

const emit = defineEmits<Events['onToggle']>()

const enabled = ref(false)
const transitioning = ref(false)

const toggle = () => {
  transitioning.value = true

  setTimeout(() => {
    enabled.value = !enabled.value
  }, 0)

  setTimeout(() => {
    transitioning.value = false
  }, 200)

  emit('onToggle', enabled.value ? 'right' : 'left')
}
</script>
