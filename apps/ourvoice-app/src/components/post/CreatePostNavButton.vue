<template>
  <div ref="createPostNavLink">
    <CustomButton
      :label="smAndLarger ? 'Create Post' : ''"
      :to="'/post'"
      class-name="rounded-3xl text-xs md:p-3 md:space-x-1 text-ourvoice-white"
    >
      <template #icon-after-text>
        <IconMessageStripeCircle v-if="isHovered" class="" />
        <IconMessagePlusCircle v-else />
      </template>
    </CustomButton>
  </div>
</template>
<script lang="ts" setup>
import CustomButton from '../common/CustomButton.vue'
import { ref } from 'vue'
import IconMessageStripeCircle from '../icons/IconMessageStripeCircle.vue'
import IconMessagePlusCircle from '../icons/IconMessagePlusCircle.vue'
import { breakpointsTailwind, useBreakpoints, useElementHover } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('sm')

const createPostNavLink = ref<null | HTMLElement>(null)
const isHovered = useElementHover(createPostNavLink)
</script>
