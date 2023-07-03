<template>
  <div>
    <div class="tabs max-w-lg text-center m-auto">
      <ul class="tabs_header flex list-none">
        <li
          v-for="tabTitle in tabTitles"
          :key="tabTitle"
          class="mr-2 p-1 rounded-t-lg text-white cursor-pointer"
          :class="[activeTab === tabTitle ? 'bg-indigo-500' : 'bg-slate-400']"
          @click="activeTab = tabTitle"
        >
          {{ tabTitle }}
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { ref, provide } from 'vue'
export default {
  setup(props, { slots }) {
    const tabTitles = ref(
      slots.default!().map((slot) => {
        return slot.props?.title
      })
    )
    const activeTab = ref(tabTitles?.value[0])

    provide('activeTab', activeTab)
    return {
      tabTitles,
      activeTab
    }
  }
}
</script>
