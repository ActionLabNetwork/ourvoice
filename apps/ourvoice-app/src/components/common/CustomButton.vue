<template>
  <template v-if="!props.to">
    <button
      v-if="show"
      :class="
        twMerge(props.variant === 'outlined' ? 'btn-outlined' : 'btn-filled', props.className)
      "
      :data-cy="props.dataCy"
      :disabled="disabled"
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
      v-if="show"
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
import { type ButtonHTMLAttributes, type PropType } from 'vue'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean as PropType<ButtonHTMLAttributes['disabled']>,
    default: false
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
</script>
