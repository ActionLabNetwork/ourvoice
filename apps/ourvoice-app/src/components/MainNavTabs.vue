<template>
  <div :class="['grid', `grid-cols-${tabState.length}`]">
    <div
      class="text-center overflow-hidden hover:bg-gray-200 dark:hover:bg-gray-500 border-black dark:border-white"
      :class="tab.isActive ? ' border-b-2 ' : ''"
      v-for="tab in tabState"
      :key="tab.name"
      @click="setActiveTab(tab)"
    >
      <div class="p-2">{{ tab.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Tab {
  name: string
  isActive: boolean
}

const tabState = ref<Tab[]>([
  { name: 'Q/A', isActive: true },
  { name: 'Polls', isActive: false }
])

const setActiveTab = (tab: Tab) => {
  tabState.value.forEach((tab) => (tab.isActive = false))
  tab.isActive = true
}
</script>
