<template>
  <div v-bind="$attrs">
    <!-- Mobile -->
    <div class="sm:hidden">
      <select
        id="tabs"
        name="tabs"
        class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">
          {{ tab.name }}
        </option>
      </select>
      <transition name="fade">
        <div v-if="props.loading" class="h-[80vh]">
          <Loading>Loading...</Loading>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="!props.loading">
          <slot :name="currentTab.name.toLowerCase().replace(' ', '-')"></slot>
        </div>
      </transition>
    </div>
    <div class="hidden sm:block">
      <nav class="isolate flex relative mb-5">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          :data-cy="`${tab.name.toLowerCase()}-tab`"
          :ref="(el: VNodeRef) => (tabElements[tab.name] = el)"
          @click.prevent="switchTab(tab)"
          :class="[
            tab.current ? 'text-ourvoice-black' : 'text-gray-500 hover:text-gray-700',
            'group min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 hover:cursor-pointer focus:z-10 border-none outline-none'
          ]"
        >
          <div class="flex items-center justify-center gap-5">
            {{ tab.name }}
            <span
              v-if="!!tab.count && tab.count > 0"
              class="bg-ourvoice-primary text-ourvoice-black text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              {{ tab.count }}
            </span>
          </div>

          <!-- Underline accent for active state -->
          <div>
            <span
              :class="[
                'absolute inset-x-0 bottom-0.5 z-10 bg-gray-500 h-0.5 rounded-md w-[99%] left-1'
              ]"
            />
            <span
              v-if="tab.current"
              :style="{
                transform: `translateX(${underlinePosition}px)`,
                width: `${underlineWidth}px`
              }"
              class="absolute bottom-0 z-20 h-1.5 bg-ourvoice-primary rounded-md transition-all duration-500 ease-in-out left-0"
            />
          </div>
        </div>
      </nav>
      <transition name="fade">
        <div v-if="props.loading" class="h-[80vh]">
          <Loading>Loading...</Loading>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="!props.loading">
          <slot :name="currentTab.name.toLowerCase().replace(' ', '-')"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loading from './Loading.vue'

import type { Tab } from '@/types'
import { type PropType, ref, watchEffect, nextTick, reactive, onMounted, type VNodeRef } from 'vue'

const props = defineProps({
  tabs: { type: Array as PropType<Tab[]>, required: true },
  initialTab: { type: Object as PropType<Tab>, required: true },
  loading: { type: Boolean, required: true }
})

const emit = defineEmits(['tab-switched'])

let currentTab = ref<Tab>(props.initialTab)
const tabElements = reactive<Record<string, VNodeRef>>({})

const underlinePosition = ref(0)
const underlineWidth = ref(0)

const updateUnderline = () => {
  nextTick(() => {
    const activeTab = currentTab.value.name
    if (activeTab) {
      const el = tabElements[activeTab] as unknown as HTMLElement
      underlinePosition.value = el.offsetLeft
      underlineWidth.value = el.offsetWidth
    }
  })
}

watchEffect(() => {
  currentTab.value = props.tabs.find((tab) => tab.current) || props.initialTab
})

const switchTab = (selectedTab: Tab) => {
  props.tabs.forEach((tab) => {
    tab.current = tab === selectedTab
  })
  currentTab.value = selectedTab
  emit('tab-switched', selectedTab)
  updateUnderline()
}

onMounted(updateUnderline)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
