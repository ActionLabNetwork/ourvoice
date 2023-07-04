<template>
  <button class="w-10 h-10 text-yellow-400 dark:text-indigo-400" @click="toggleDark()">
    <font-awesome-icon icon="fa-solid fa-moon" size="xl" v-if="isDark" />
    <font-awesome-icon icon="fa-solid fa-sun" size="xl" v-else />
  </button>
</template>
<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
