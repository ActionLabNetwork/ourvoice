<template>
  <router-link
    to="/post"
    class="text-sm ml-5 font-semibold hidden lg:inline-flex items-center gap-2 bg-yellow-400 py-3 px-4 rounded-full hover:bg-yellow-500"
    ref="createPostNavLink"
  >
    Create Post
    <IconMessageCircle class="" v-if="isHovered" />
    <IconMessagePlusCircle class="" v-else />
  </router-link>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import IconMessageCircle from '../icons/IconMessageCircle.vue'
import IconMessagePlusCircle from '../icons/IconMessagePlusCircle.vue'
import { useElementHover } from '@vueuse/core'
const createPostNavLink = ref<null | HTMLElement>(null)
const isHovered = useElementHover(createPostNavLink)
</script>
