<template>
  <div class="h-full w-screen flex flex-col">
    <header class="bg-ourvoice-gray border-b border-slate-400 dark:text-gray-400 dark:bg-gray-800">
      <HeaderNavBar class="lg:hidden" />
    </header>

    <!-- main container -->
    <div class="flex-1 flex overflow-x-hidden dark:text-gray-400 dark:bg-gray-700">
      <nav class="order-first hidden lg:block lg:w-64 2xl:w-96 bg-ourvoice-gray p-5 overflow-y-auto">
        <div class="text-ourvoice-blue dark:text-ourvoice-white text-5xl 2xl:text-6xl text-center mb-6">
          <span class="text-ourvoice-red">Our</span>
          <span>Voice</span>
        </div>
        <div class="text-center">
          <DarkModeToggle />
        </div>
      </nav>

      <main class="flex-1 border-x border-slate-400 text-xs relative">


        <div class="backdrop-blur-md text-xl w-full absolute top-0 z-20">
          <!-- <HeaderNavBar class="lg:hidden" /> -->
          <!-- <MainNavTabs @set-active-tab="(tabName) => {
            activeTab = tabName
          }" /> -->
        </div>
        <div class="h-full">
          <PostVirtualList class="" />
        </div>
      </main>

      <aside class="hidden lg:block lg:w-64 2xl:w-96 bg-ourvoice-gray p-5 overflow-y-auto h-full no-scrollbar">
        <CategoryFilter />
      </aside>
    </div>
    <!-- end main container -->
    <AppFooter />
    <!-- Create Post Modal -->
    <div>
      <Modal :isOpen="modalOpen" @close="modalOpen = false">
        <template #content>
          <CreatePost />
        </template>
      </Modal>
      <button @click="modalOpen = true" type="button"
        class="bg-indigo-400 hover:bg-indigo-500 text-white drop-shadow-md font-bold p-1 rounded-full h-fit fixed bottom-24 right-10 z-10">
        <div class="flex align-middle">
          <div class="p-2 bg-indigo-300 rounded-full">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" size="xl" />
          </div>
          <div class="py-2 px-1">Create Post</div>
        </div>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderNavBar from '@/components/common/HeaderNavBar.vue'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'
import PostVirtualList from '@/components/post/PostVirtualList.vue'
import CategoryFilter from '@/components/common/CategoryFilter.vue'
import Modal from '@/components/common/Modal.vue'
import CreatePost from '@/components/post/CreatePost.vue'
import { ref } from 'vue'

const modalOpen = ref(false)
</script>
