<template>
  <div v-bind="$attrs">
    <div class="sm:hidden">
      <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
        <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="isolate flex divide-x divide-gray-200 rounded-lg shadow">
        <a
        v-for="(tab, tabIdx) in tabs"
        :key="tab.name"
        @click.prevent="switchTab(tab)"
        :class="[tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700', tabIdx === 0 ? 'rounded-l-lg' : '', tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '', 'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10']">
          <span>{{ tab.name }}</span>
          <span :class="[tab.current ? 'bg-indigo-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5']" />
        </a>
      </nav>
      <div>
        <slot :name="currentTab.name.toLowerCase().replace(' ', '-')"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref, watchEffect } from 'vue'

const props = defineProps({
  tabs: { type: Array as PropType<Tab[]>, required: true },
  initialTab: { type: Object as PropType<Tab>, required: true },
})

const emit = defineEmits(['tab-switched']);

let currentTab = ref<Tab>(props.initialTab)

watchEffect(() => {
  currentTab.value = props.tabs.find(tab => tab.current) || props.initialTab;
});

const switchTab = (selectedTab: Tab) => {
  props.tabs.forEach(tab => {
    tab.current = tab === selectedTab;
  });
  currentTab.value = selectedTab;
  emit('tab-switched', selectedTab);
};
</script>
