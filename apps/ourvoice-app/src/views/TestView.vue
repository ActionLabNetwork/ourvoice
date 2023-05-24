<template>
  <div class="min-h-screen h-screen w-screen flex flex-col">
    <header class="bg-ourvoice-gray border-b border-slate-400 dark:text-gray-400 dark:bg-gray-800">
      <HeaderNavBar class="lg:hidden" />
    </header>

    <!-- main container -->
    <div class="flex-1 flex overflow-y-auto dark:text-gray-400 dark:bg-gray-700 h-screen">
      <nav class="order-first hidden lg:block lg:w-64 2xl:w-96 bg-ourvoice-gray p-5 h-full overflow-y-auto no-scrollbar">
        <div class="text-ourvoice-blue dark:text-ourvoice-white text-5xl 2xl:text-6xl text-center mb-6">
          <span class="text-ourvoice-red">Our</span>
          <span>Voice</span>
        </div>
        <div class="text-center">
          <DarkModeToggle />
        </div>
      </nav>

      <main class="flex-1 border-x border-slate-400 text-xs relative ">


        <div class="backdrop-blur-md text-xl absolute top-0 z-10 w-full">
          <MainNavTabs @set-active-tab="(tabName) => {
            activeTab = tabName
          }" />
        </div>

        <PostVirtualList v-if="activeTab === 'Posts'" />
        <div v-else class="h-full w-full flex items-center justify-center text-9xl" >
            <!-- Second tab container -->
            <font-awesome-icon icon="fa-solid fa-square-poll-vertical"  size="2xl"/>
        </div>
      </main>

      <aside class="hidden lg:block lg:w-64 2xl:w-96 bg-ourvoice-gray p-5 overflow-y-auto h-full no-scrollbar">
        <CategoryFilter />
      </aside>
    </div>
    <!-- end main container -->

    <footer class="bg-white dark:bg-gray-800 border-t border-slate-400">
      <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#"
            class="hover:underline">OurVoice</a>. All Rights Reserved.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">About</a>
          </li>
          <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
          </li>
          <li>
            <a href="#" class="hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </footer>

    <!-- Create Post Modal -->
    <div>
      <Modal :isOpen="modalOpen" @close="modalOpen = false">
        <template #content>
          <CreatePost />
        </template>
      </Modal>
      <button @click="modalOpen = true" type="button"
        class="bg-indigo-400 hover:bg-indigo-500 text-white drop-shadow-md font-bold p-1 rounded-full h-fit fixed bottom-20 right-10 z-10">
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
import MainNavTabs from '@/components/MainNavTabs.vue'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'
import PostVirtualList from '@/components/post/PostVirtualList.vue'
import CategoryFilter from '@/components/common/CategoryFilter.vue'
import Modal from '@/components/common/Modal.vue'
import CreatePost from '@/components/post/CreatePost.vue'
import { ref } from 'vue'

const activeTab = ref('Posts')
const modalOpen = ref(false)
</script>
