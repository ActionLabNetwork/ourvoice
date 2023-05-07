<template>
  <div class="flex flex-col space-y-2">
    <label :for="id" class="block text-gray-700 mb-1 font-semibold">{{ labelText }}
      <span v-if="labelSpan" class="text-sm font-light">({{ labelSpan }})</span>
    </label>
    <div class="flex">
      <slot name="icon"></slot>
      <slot></slot>
    </div>
    <span v-if="name && errorMessage" class="text-red-500 text-sm" :name="name" :data-cy="`${name}-error-message`">{{ errorMessage }}</span>
    <slot name="info"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  labelText: String,
  labelSpan: String,
  name: String,
  errorMessage: { type: String, required: false },
})
</script>
