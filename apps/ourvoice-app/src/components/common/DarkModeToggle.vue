<template>
  <!-- <div class=""> -->
  <Switch
    v-model="isDark"
    :class="isDark ? 'bg-gray-500' : 'bg-gray-300'"
    class="relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
  >
    <span
      aria-hidden="true"
      :class="isDark ? 'translate-x-6' : 'translate-x-0'"
      class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out text-yellow-400 dark:text-indigo-500"
      ><font-awesome-icon icon="fa-solid fa-moon" v-if="isDark" />
      <font-awesome-icon icon="fa-solid fa-sun" v-else />
    </span>
  </Switch>
  <!-- </div> -->
</template>

<script lang="ts" setup>
import { Switch } from '@headlessui/vue'
import { useDark } from '@vueuse/core'
const isDark = useDark()
// const toggleDark = useToggle(isDark)
</script>
