<template>
  <div ref="createPostNavLink">
    <CustomButton label="Create Post" :to="'/post'" class-name="rounded-3xl h-12 px-4 py-3 text-xs">
      <template #icon-after-text>
        <IconMessageStripeCircle v-if="isHovered" />
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
import { useElementHover } from '@vueuse/core'
const createPostNavLink = ref<null | HTMLElement>(null)
const isHovered = useElementHover(createPostNavLink)
</script>
