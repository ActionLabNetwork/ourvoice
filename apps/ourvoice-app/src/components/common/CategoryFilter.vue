<template>
  <h1 class="text-2xl lg:text-3xl py-5">Category</h1>
  <div class="grid auto-cols-max overflow-auto no-scrollbar gap-1 border-b max-h-1/2"
  :class="vertical?'grid-flow-row':'grid-flow-col'"
  >
    <div class="bg-gray-200 dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ ['border-2']: selected === '' }">
      <input name="category" type="radio" id="All" value="" v-model="selected" class="hidden" />
      <label class="hover:cursor-pointer" for="All">All</label>
    </div>

    <div v-for="category in categoriesStore.data" :key="category.id"
      class="bg-gray-200 dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ 'border-2': selected === category.name }">
      <input name="category" type="radio" :id="category.name" :value="category.name" v-model="selected" class="hidden" />
      <label class="hover:cursor-pointer" :for="category.name"> {{ category.name }}</label>
    </div>
  </div>
  <div>categoriesId:{{ categoriesStore.selectedCategories }}</div>
</template>

<script lang="ts" setup>
import { useCategoriesStore } from '@/stores/categories'
import { ref, watch } from 'vue'
defineProps({
  vertical: {
    type: Boolean,
    required: false,
    default: true
  }
})
const categoriesStore = useCategoriesStore()
categoriesStore.fetchCategories()
const selected = ref<string>('')
watch(selected, (value: string) => {
  categoriesStore.setSelectedCategories(value ? [value] : [])
})

</script>
