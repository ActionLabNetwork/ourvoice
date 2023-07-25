<template>
  <div class="flex items-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="prevPage"
        :disabled="page === 1"
      >
        Previous
      </button>
      <button
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="nextPage"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :disabled="page === 1"
            @click="prevPage"
            v-if="page !== 1"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <a
            href="#"
            aria-current="page"
            class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >{{ page }}</a
          >
          <button
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            @click="nextPage"
            :disabled="!hasNextPage"
            v-if="hasNextPage"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { ref } from 'vue'

type Direction = 'Previous' | 'Next'
export type PageChangePayload = {
  direction: Direction
  page: number
}

defineProps<{
  hasNextPage: boolean
}>()
const emit = defineEmits<{
  (event: 'pageChange', payload: PageChangePayload): void
}>()

const page = ref(1)

const nextPage = () => {
  page.value++
  emit('pageChange', { direction: 'Next', page: page.value })
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    emit('pageChange', { direction: 'Previous', page: page.value })
  }
}
</script>
