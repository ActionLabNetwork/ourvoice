<template>
  <button
    @click="$emit('select')"
    class="px-4 h-10 items-center rounded-full border-2 border-gray-300"
    :class="{ 'bg-black text-white': active }"
  >
    <span
      class="px-1 rounded-full items-center"
      :class="active ? 'bg-white text-black' : 'bg-yellow-400 text-black'"
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
