<template>
  <div
    class="flex flex-col justify-center justify-items-center space-y-10 max-w-5xl w-full mx-auto mb-3"
  >
    <!-- Categories Filter start -->
    <div
      class="px-8 flex space-x-2 md:space-y-5 overflow-x-auto no-scrollbar md:block md:text-center -mx-10 md:mx-0"
    >
      <PostSortFilterCategoryButton
        v-if="result?.posts?.totalCount"
        :count="result.posts.totalCount"
        :active="!sortFilter.selectedCategoryIds"
        text="All"
        @select="selectCategory(null)"
      />
      <template v-for="category in categories" :key="category.id">
        <PostSortFilterCategoryButton
          v-if="category.numPosts > 0"
          :active="sortFilter.selectedCategoryIds?.includes(category.id) ?? false"
          :count="category.numPosts"
          :text="category.name"
          @select="selectCategory(category.id)"
        />
      </template>
      <div v-if="state == 'loading-initial'" class="w-full flex flex-row justify-center space-x-5">
        <div v-for="i in 5" :key="i" class="w-[150px] h-10 shrink-0 rounded-full skeleton" />
      </div>
    </div>
    <!-- Categories Filter end -->

    <div class="min-h-[72px] flex text-center self-center text-center text-xl md:text-2xl lg:text-3xl font-semibold">
      {{ message }}
    </div>

    <!-- Time range and sorting start -->
    <div class="flex flex-col-reverse md:flex-row justify-between">
      <div class="flex justify-around space-x-2 text-base mt-5 md:text-xl md:mt-0 font-normal">
        <button
          v-for="(option, index) in timeRangeOptions"
          :key="index"
          class="px-2 py-1"
          :class="{
            'font-semibold border-ourvoice-black border-b-4':
              option.label === selectedTimeRangeOption.label
          }"
          @click="handleTimeRangeSelected(index)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="flex justify-between">
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
          <font-awesome-icon :icon="faArrowDownWideShort" v-if="sortAscending" />
          <font-awesome-icon :icon="faArrowUpWideShort" v-else />
          {{ sortAscending ? 'asc' : 'desc' }}
        </button>
      </div>
    </div>
    <!-- Time range and sorting end -->
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
import PostSortFilterCategoryButton from '@/components/post/PostSortFilterCategoryButton.vue'
import { faArrowDownWideShort, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { useToggle } from '@vueuse/core'
import { computed, ref, watch, watchEffect } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import { startOfDay } from 'date-fns'
import { GET_TOTAL_POST_COUNT_BY_CATEGORY_QUERY } from '@/graphql/queries/getPosts'
import { useQuery } from '@vue/apollo-composable'
const { result } = useQuery(GET_TOTAL_POST_COUNT_BY_CATEGORY_QUERY)
const categoriesStore = useCategoriesStore()
const postsStore = usePostsStore()
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
  await postsStore.setSortOption(
    selectedSortOption.value.value,
    sortAscending.value ? 'asc' : 'desc'
  )
  postsStore.fetchPosts()
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
watch(selectedTimeRangeOption, () => {
  if (selectedTimeRangeOption.value.label === 'Latest 3 Days') {
    postsStore.setCreatedAfter(startOfDay(Date.now() - 3 * 24 * 60 * 60 * 1000))
  } else {
    postsStore.setCreatedAfter(null)
  }
  postsStore.fetchPosts()
})
const handleTimeRangeSelected = (index: number) => {
  selectedTimeRangeOption.value = timeRangeOptions[index]
}

const { data: categories, state } = storeToRefs(categoriesStore)
if (state.value == 'initial') {
  categoriesStore.fetchCategories()
}
const { sortFilter } = storeToRefs(postsStore)
const selectCategory = (id: number | null) => {
  postsStore.setSelectedCategoryIds(id ? [id] : null)
}

const message = computed(() => {
  const selectedCategory = sortFilter.value.selectedCategoryIds?.at(0)
  const defaultMessage =
    'Discuss your experience of balancing out your work and personal life in your organization, and any suggestions to improve matters.'

  if (!selectedCategory) {
    return defaultMessage
  }
  return (
    categories.value.find((category) => category.id === selectedCategory)?.description ??
    defaultMessage
  )
})
</script>
