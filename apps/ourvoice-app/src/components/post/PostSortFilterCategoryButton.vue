<template>
  <button
    @click="$emit('select')"
    class="px-4 my-1 h-8 md:h-10 items-center text-sm rounded-full border-2 border-ourvoice-base-light-300"
    :class="{ 'bg-ourvoice-primary-2 text-ourvoice-white': active }"
  >
    <span
      class="shrink-0 h-full px-1 min-w-[24px] rounded-full items-center"
      :class="
        active
          ? 'bg-ourvoice-white text-ourvoice-black'
          : 'bg-ourvoice-secondary text-ourvoice-black'
      "
    >
      {{ count }}
    </span>
    <span class="px-1 whitespace-nowrap">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})
</script>
