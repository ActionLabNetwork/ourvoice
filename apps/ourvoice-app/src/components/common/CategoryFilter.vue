<template>
  <div class="w-full px-4 py-5">
    <h1 class="mb-3">postStore.selectedCategoryIds</h1>
    <!-- {{ selectedCategories }} -->
    {{ selectedCategoryIds }}
    <div class="mx-auto w-full max-w-md">
      <RadioGroup v-model="selectedCategory">
        <div class="space-y-2">
          <RadioGroupOption
            as="template"
            v-for="el in categories"
            :key="el.name"
            :value="el"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active
                  ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-300'
                  : '',
                checked ? 'bg-gray-600 bg-opacity-75 text-white ' : 'bg-white '
              ]"
              class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
            >
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <RadioGroupLabel
                      as="p"
                      :class="checked ? 'text-white' : 'text-gray-900'"
                      class="font-medium"
                    >
                      {{ el.name }}()
                    </RadioGroupLabel>
                    <RadioGroupDescription
                      as="span"
                      :class="checked ? 'text-gray-100' : 'text-gray-500'"
                      class="inline"
                    >
                    </RadioGroupDescription>
                  </div>
                </div>
                <div v-show="checked" class="shrink-0 text-white">
                  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#fff" fill-opacity="0.2" />
                    <path
                      d="M7 13l3 3 7-7"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption
} from '@headlessui/vue'
import { useCategoriesStore } from '@/stores/categories'
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
const postStore = usePostsStore()
const { selectedCategoryIds } = storeToRefs(postStore)

const categoriesStore = useCategoriesStore()
await categoriesStore.fetchCategories()
const { data } = storeToRefs(categoriesStore)
const categories = computed(() => [{ id: 0, name: 'All' }, ...data.value])

const selectedCategory = ref(categories.value[0])

const selectedCategories = computed(() => {
  if (selectedCategory.value.id === 0) {
    return categories.value.map((el) => el.id).slice(1)
  }
  return [selectedCategory.value.id]
})

watchEffect(() => {
  postStore.setSelectedCategoryIds(selectedCategories.value)
})
</script>
