<template>
  <div :class="['border-b', 'grid', 'grid-flow-col', `grid-cols-${tabState.length}`]">
    <div
      class="text-center hover:bg-gray-400 bg-opacity-10 hover:bg-opacity-30 border-black dark:border-white"
      :class="tab.isActive ? ' border-b-2  font-semibold dark:text-white' : ''"
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

const emit = defineEmits(['setActiveTab'])

const tabState = ref<Tab[]>([
  { name: 'Posts', isActive: true },
  { name: 'Polls', isActive: false }
  // { name: 'Posts', isActive: false }
])

const setActiveTab = (tab: Tab) => {
  if (tab.isActive) return
  tabState.value.forEach((tab) => (tab.isActive = false))
  tab.isActive = true
  emit('setActiveTab', tab.name)
}
</script>
