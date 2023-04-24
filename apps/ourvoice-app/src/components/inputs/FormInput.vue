<template>
  <div class="flex flex-col space-y-2">
    <label :for="id" class="block text-gray-700 mb-1 font-semibold">{{ labelText }}</label>
    <div class="flex">
      <slot name="icon"></slot>
      <slot></slot>
    </div>

    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
    <slot name="info"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: String,
    labelText: String,
    error: String,
  },
});
</script>
