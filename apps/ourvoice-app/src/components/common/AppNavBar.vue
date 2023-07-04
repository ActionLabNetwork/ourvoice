<template>
  <div class="border-r border-gray-400 flex flex-col bg-gray-800 text-white">
    <!-- Logo -->
    <div class="lg:py-6 flex lg:block justify-between">
      <a class="flex font-bold text-lg lg:text-4xl items-center px-2 lg:px-4" href="../">
        <span class="">Over</span><span class="text-ourvoice-red">Voice</span>
      </a>

      <!-- Mobile Buttons -->
      <div class="flex lg:hidden">
        <DarkButton />
        <button class="block px-4" @click="showSidebar()">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!--  Nav Bar -->
    <div
      class="lg:flex flex-col flex-grow border-t border-gray-400 justify-between bg-gray-800"
      :class="hideDropPanel ? 'flex z-40 ' : 'hidden'"
    >
      <nav class="border-indigo-400 lg:grid space-y-6">
        <div class="p-4 hidden lg:block">
          <DarkButton />
        </div>
        <a href="#" class="block p-4 hover:bg-gray-700 mx-1 transition">
          <font-awesome-icon icon="fa-solid fa-house" />
          <span class="px-6">Home</span>
        </a>
        <a href="#" class="block p-4 hover:bg-gray-700 mx-1 transition">
          <font-awesome-icon icon="fa-solid fa-bullhorn" />
          <span class="px-6">Posts</span>
        </a>
        <a href="#" class="block p-4 rounded-sm hover:bg-gray-700 mx-1 transition">
          <font-awesome-icon icon="fa-solid fa-square-poll-vertical" />
          <span class="px-6">Polls</span>
        </a>
      </nav>

      <!--  signin/signout -->
      <div class="flex justify-between bg-gray-700 px-5">
        <img
          class="rounded-full p-2"
          src="https://ui-avatars.com/api/?size=48?&name=user3"
          alt=""
        />
        <a class="p-2 flex items-center border-ourvoice-red hover:bg-gray-700 transform" href="#"
          >Sign out</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DarkButton from './DarkButton.vue'
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
const hideDropPanel = ref(false)
const showSidebar = useToggle(hideDropPanel)
</script>
