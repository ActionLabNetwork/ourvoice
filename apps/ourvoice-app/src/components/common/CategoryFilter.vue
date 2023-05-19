<template>
  <h1 class="text-2xl lg:text-3xl py-5">Category</h1>
  <div class="flex flex-col">
    <div
      class="bg-gray-200 dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ ['border-2']: selected === 'All' }"
    >
      <input name="category" type="radio" id="All" value="All" v-model="selected" class="hidden" />
      <label class="hover:cursor-pointer" for="All">All</label>
    </div>

    <div
      v-for="category in categoriesStore.data"
      :key="category.id"
      class="bg-gray-200 dark:bg-gray-500 my-2 py-1 px-3 rounded-full w-fit border-black dark:border-white"
      :class="{ 'border-2': selected === category.name }"
    >
      <input
        name="category"
        type="radio"
        :id="category.name"
        :value="category.name"
        v-model="selected"
        class="hidden"
      />
      <label class="hover:cursor-pointer" :for="category.name"> {{ category.name }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCategoriesStore } from '@/stores/categories'
// import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const categoriesStore = useCategoriesStore()
categoriesStore.fetchCategories()
const selected = ref<string>('All')
</script>
