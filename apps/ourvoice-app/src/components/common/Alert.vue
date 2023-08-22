<template>
  <div :class="twMerge('rounded-md p-4', props.className)">
    <div class="flex gap-4">
      <slot name="icon"> </slot>
      <div>
        <slot name="title"></slot>
        <slot name="content"></slot>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  className: { type: String, default: 'bg-ourvoice-success-light' }
})
</script>
