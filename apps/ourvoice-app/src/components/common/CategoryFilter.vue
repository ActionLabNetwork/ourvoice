<template>
  <div>
    <h1 class="text-2xl lg:text-3xl py-5">Category</h1>
    <div
      class="mr-1 inline-block bg-gray-200 dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ ['border-2']: selected === '' }">
      <input name="category" type="radio" id="All" value="" v-model="selected" class="hidden" />
      <label class="hover:cursor-pointer" for="All">All</label>
    </div>
    <div v-for="category in categoriesStore.data" :key="category.id"
      class="mr-1 bg-gray-200 inline-block dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ 'border-2': selected === category.name }">
      <input name="category" type="radio" :id="category.name" :value="category.name" v-model="selected" class="hidden" />
      <label class="hover:cursor-pointer" :for="category.name"> {{ category.name }}</label>
    </div>
    <div
      class="mr-1 inline-block bg-gray-200 dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ ['border-2']: selected === 'Other' }">
      <input name="category" type="radio" id="Other" value="Other" v-model="selected" class="hidden" />
      <label class="hover:cursor-pointer" for="Other">Other</label>
    </div>
    <!-- <div class="border-b">categoriesId:{{ categoriesStore.selectedCategories }}</div> -->
  </div>
</template>

<script lang="ts" setup>
import { useCategoriesStore } from '@/stores/categories'
import { ref, watch } from 'vue'
const categoriesStore = useCategoriesStore()
categoriesStore.fetchCategories()
const selected = ref<string>('')
watch(selected, (value: string) => {
  categoriesStore.setSelectedCategories(value ? [value] : [])
})

</script>
