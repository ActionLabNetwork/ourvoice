<template>
  <template v-if="!props.to">
    <button
      v-if="isVisible"
      class="inline-flex items-center rounded-2xl bg-ourvoice-primary-1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ourvoice-primary-1 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      :data-cy="props.dataCy"
      :disabled="isDisabled"
    >
      <slot name="icon-before-text"></slot>
      {{ label }}
      <slot name="icon-after-text"></slot>
    </button>
  </template>
  <template v-else>
    <router-link
      v-if="isVisible"
      :to="props.to"
      class="gap-2 inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium btn-rounded bg-ourvoice-primary-1 hover:bg-ourvoice-primary-1/80"
      :data-cy="props.dataCy"
      ><slot name="icon-before-text"></slot>
      {{ label }}
      <slot name="icon-after-text"></slot>
    </router-link>
  </template>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

const props = defineProps({
  visibilityPredicate: {
    type: Function as PropType<() => boolean>,
    default: () => true
  },
  disabledPredicate: {
    type: Function as PropType<() => boolean>,
    default: () => true
  },
  to: {
    type: [Object, String] as PropType<{ name: string; params: { id: number } } | string>,
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
const isDisabled = computed(() => props.disabledPredicate())
</script>
