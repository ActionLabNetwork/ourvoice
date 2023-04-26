<template>
  <div class="flex flex-col space-y-2">
    <label :for="id" class="block text-gray-700 mb-1 font-semibold">{{ labelText }}
      <span v-if="labelSpan" class="text-sm font-light">({{ labelSpan }})</span>
    </label>
    <div class="flex">
      <slot name="icon"></slot>
      <slot></slot>
    </div>

    <ErrorMessage class="text-red-500 text-sm" v-if="name" :name="name" />
    <slot name="info"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ErrorMessage } from 'vee-validate';

export default defineComponent({
  components: { ErrorMessage },
  props: {
    id: String,
    labelText: String,
    labelSpan: String,
    name: String,
  },
});
</script>
