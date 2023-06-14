<template>
  <template v-if="!props.to">
    <button v-if="isVisible">{{ label }}</button>
  </template>
  <template v-else>
    <router-link
      v-if="isVisible"
      :to="props.to"
      class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      :data-cy="props.dataCy"
    >
      {{ label }}
    </router-link>
  </template>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
  visibilityPredicate: {
    type: Function as PropType<() => boolean>,
    default: () => true
  },
  to: {
    type: Object as PropType<{ name: string; params: { id: number; }; }>,
    required: false
  },
  dataCy: {
    type: String,
    required: false
  },
  label: {
    type: String,
    required: true
  }
})

const isVisible = computed(() => props.visibilityPredicate())
</script>
