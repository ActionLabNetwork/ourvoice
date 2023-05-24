<template>
  <ul role="list" class="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
    <li v-for="version in props.versions" :key="version.id" class="relative flex justify-between gap-x-6 px-4 py-3 hover:bg-gray-100 hover:cursor-pointer sm:px-6" :class="isSelected(version) && 'bg-slate-200'" @click="() => handleVersionClick(version)">
      <div class="flex gap-x-4">
        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
              <span class="absolute inset-x-0 -top-px bottom-0" />
              {{ version.title }}
          </p>
          <p class="mt-1 flex text-xs leading-5 text-gray-500">
            Version {{ version.version }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-x-4">
        <div class="hidden sm:flex sm:flex-col sm:items-end">
          <p v-if="version.timestamp" class="mt-1 text-xs leading-5 text-gray-500">
            Last moderated <br />
            <time :datetime="version.timestamp">
              {{ `${formatTimestampToReadableDate(+version.timestamp)}` }}
            </time>
          </p>
          <div v-else class="mt-1 flex items-center gap-x-1.5">
            <div class="flex-none rounded-full bg-emerald-500/20 p-1">
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p class="text-xs leading-5 text-gray-500">Online</p>
          </div>
        </div>
        <font-awesome-icon :icon="['fas', 'fa-chevron-right']" />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PostVersion } from '@/stores/moderation-posts'
import { computed, onMounted, ref, watch, type PropType } from 'vue'

import { formatTimestampToReadableDate } from '@/utils'


const props = defineProps({
  versions: {
    type: Array as PropType<PostVersion[]>,
    required: true
  }
})

const emit = defineEmits(['versionClicked'])

const selected = ref<PostVersion | null>(null)
const isSelected = computed(() => {
  return (postVersion: PostVersion) => postVersion === selected.value
})

onMounted(() => {
  selected.value = props.versions[0]
  console.log(selected.value)
})

const handleVersionClick = (version: PostVersion) => {
  selected.value = version
  emit('versionClicked', version)
}

watch(isSelected, (newVal) => {
  console.log(newVal)
})
</script>
