<template>
  <div class="text-center w-6 h-6 text-yellow-400 dark:text-indigo-400">
    <button @click="toggleDark()">
      <font-awesome-icon icon="fa-solid fa-moon" size="xl" v-if="isDark" />
      <font-awesome-icon icon="fa-solid fa-sun" size="xl" v-else />
    </button>
  </div>
</template>
<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
