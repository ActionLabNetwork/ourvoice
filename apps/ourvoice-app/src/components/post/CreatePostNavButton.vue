<template>
  <div ref="createPostNavLink">
    <CustomButton label="Create Post" :disabledPredicate="() => false" :to="'/post'">
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
