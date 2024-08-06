<template>
  <div ref="createPostNavLink">
    <custom-button
      class-name="rounded-3xl text-xs md:p-3 md:space-x-1 text-ourvoice-black"
      :label="smAndLarger ? 'Create Post' : ''"
      to="/post"
    >
      <template #icon-after-text>
        <icon-message-stripe-circle v-if="isHovered" class="" />
        <icon-message-plus-circle v-else />
      </template>
    </custom-button>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints, useElementHover } from '@vueuse/core'
import { ref } from 'vue'

import CustomButton from '../common/CustomButton.vue'
import IconMessagePlusCircle from '../icons/IconMessagePlusCircle.vue'
import IconMessageStripeCircle from '../icons/IconMessageStripeCircle.vue'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('sm')

const createPostNavLink = ref<null | HTMLElement>(null)
const isHovered = useElementHover(createPostNavLink)
</script>
