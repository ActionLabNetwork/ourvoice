<template>
  <router-link
    to="/post"
    class="text-sm font-semibold items-center gap-2 py-3 btn-rounded btn-primary"
    ref="createPostNavLink"
  >
    Create Post
    <IconMessageStripeCircle v-if="isHovered" />
    <IconMessagePlusCircle v-else />
  </router-link>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import IconMessageStripeCircle from '../icons/IconMessageStripeCircle.vue'
import IconMessagePlusCircle from '../icons/IconMessagePlusCircle.vue'
import { useElementHover } from '@vueuse/core'
const createPostNavLink = ref<null | HTMLElement>(null)
const isHovered = useElementHover(createPostNavLink)
</script>
