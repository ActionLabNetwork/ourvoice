<template>
  <template v-if="!props.to">
    <button
      v-if="isVisible"
      :class="
        twMerge(props.variant === 'outlined' ? 'btn-outlined' : 'btn-filled', props.className)
      "
      :data-cy="props.dataCy"
      :disabled="isDisabled"
      @click="props.onClick"
      :type="props.type"
    >
      <slot name="icon-before-text"></slot>
      <p class="mx-auto">{{ label }}</p>
      <slot name="icon-after-text"></slot>
    </button>
  </template>
  <template v-else>
    <router-link
      v-if="isVisible"
      :to="props.to"
      :class="
        twMerge(props.variant === 'outlined' ? 'btn-outlined' : 'btn-filled', props.className)
      "
      :data-cy="props.dataCy"
      ><slot name="icon-before-text"></slot>
      <p class="mx-auto">{{ label }}</p>
      <slot name="icon-after-text"></slot>
    </router-link>
  </template>
</template>

<script setup lang="ts">
import { computed, type ButtonHTMLAttributes, type PropType } from 'vue'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  visibilityPredicate: {
    type: Function as PropType<() => boolean>,
    default: () => true
  },
  disabledPredicate: {
    type: Function as PropType<() => boolean>,
    default: () => false
  },
  to: {
    type: [Object, String] as PropType<{ name: string; params: { id: number } } | string>,
    required: false
  },
  dataCy: {
    type: String,
    required: false
  },
  onClick: {
    type: Function as PropType<() => void>,
    required: false
  },
  label: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: false
  },
  variant: {
    type: String as PropType<'filled' | 'outlined'>,
    default: 'filled'
  },
  type: {
    type: String as PropType<ButtonHTMLAttributes['type']>,
    default: 'button'
  }
})

const isVisible = computed(() => props.visibilityPredicate())
const isDisabled = computed(() => props.disabledPredicate())
</script>
