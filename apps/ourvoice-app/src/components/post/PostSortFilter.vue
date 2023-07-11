<template>
  <div class="sticky top-0">
    <div class="flex py-3 bg-white shadow-md justify-between items-center px-6">
      <div class="flex text-base md:text-xl font-bold">
        <button
          v-for="(option, index) in timeRangeOptions"
          :key="index"
          class="hover:bg-gray-100 px-2 py-1 rounded-md"
          :class="{ 'text-gray-500 font-normal': option.label !== selectedTimeRangeOption.label }"
          @click="handleTimeRangeSelected(index)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="flex">
        <Listbox class="w-fit" v-model="selectedSortOption">
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm"
            >
              <span class="block truncate">{{ selectedSortOption.label }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition
              leaveActiveClass="transition duration-100 ease-in"
              leaveFromClass="opacity-100"
              leaveToClass="opacity-0"
            >
              <ListboxOptions
                class="z-10 absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="sortOption in sortOptions"
                  :key="sortOption.label"
                  :value="sortOption"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4'
                    ]"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                      sortOption.label
                    }}</span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                    >
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <button class="w-20 text-sm lg:text-md hover:text-gray-500" @click="toggleSortOrder()">
          <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" v-if="sortAscending" />
          <font-awesome-icon icon="fa-solid fa-arrow-up-wide-short" v-else />
          {{ sortAscending ? 'asc' : 'desc' }}
        </button>
      </div>
    </div>
    <div class="flex overflow-x-auto py-4 space-x-5 backdrop-blur-md items-center">
      <span class="hidden md:inline-block font-semibold md:text-xl md:pl-10">Categories</span>
      <PostSortFilterCategoryButton
        :active="!sortFilter.selectedCategoryIds"
        :count="3"
        text="All"
        @select="selectCategory(null)"
      />
      <PostSortFilterCategoryButton
        v-for="category in categories"
        :key="category.id"
        :active="sortFilter.selectedCategoryIds?.includes(category.id) ?? false"
        :count="category.numPosts"
        :text="category.name"
        @select="selectCategory(category.id)"
      />
    </div>
    <!-- {{ selectedTimeRangeOption }} -->
    <!-- <div class="border-2">{{ selectedSortOption }}</div>
    <div class="border-2">{{ sortAscending }}</div> -->
    <!-- <div class="border-2">{{ selectedCategoryIds }}</div> -->
  </div>
</template>

<script lang="ts" setup>
import {
  Listbox,
  // ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { useToggle } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { usePostsStore } from '@/stores/posts'
import { GET_POST_COUNT_BY_CATEGORY_QUERY } from '@/graphql/queries/getPosts'
import { apolloClient } from '@/graphql/client'
import { storeToRefs } from 'pinia'
import PostSortFilterCategoryButton from '@/components/post/PostSortFilterCategoryButton.vue'
interface CategoryWithCount {
  id: number
  name: string
  count: number
  active: boolean
}
const sortAscending = ref(false)
const toggleSortOrder = useToggle(sortAscending)

const sortOptions = [
  { label: 'Time Created', value: 'sortByCreatedAt' },
  { label: 'Comments Count', value: 'sortByCommentsCount' },
  { label: 'Down Vote Count', value: 'sortByVotesDown' },
  { label: 'Up Vote Count', value: 'sortByVotesUp' }
]
const selectedSortOption = ref(sortOptions[0])
watchEffect(async () => {
  console.log(selectedSortOption.value.value, sortAscending.value ? 'asc' : 'desc')
  await usePostsStore().setSortOption(
    selectedSortOption.value.value,
    sortAscending.value ? 'asc' : 'desc'
  )
  usePostsStore().fetchPosts()
})

const timeRangeOptions = [
  {
    label: 'All Time'
  },
  {
    label: 'Latest 3 Days'
  }
]
const selectedTimeRangeOption = ref(timeRangeOptions[0])
watchEffect(async () => {
  if (selectedTimeRangeOption.value.label === 'Latest 3 Days') {
    await usePostsStore().setCreatedAfter(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  } else {
    await usePostsStore().setCreatedAfter(null)
  }
  usePostsStore().fetchPosts()
})
const handleTimeRangeSelected = (index: number) => {
  selectedTimeRangeOption.value = timeRangeOptions[index]
}
const categoriesStore = useCategoriesStore()
const postsStore = usePostsStore()
const { data: categories } = storeToRefs(categoriesStore)
const { sortFilter } = storeToRefs(postsStore)
const selectCategory = (id: number | null) => {
  postsStore.setSelectedCategoryIds(id ? [id] : null)
}
</script>
