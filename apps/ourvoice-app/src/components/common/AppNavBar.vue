<template>
  <div class="border-4 border-black flex flex-col space-y-6">
    <!-- Logo -->
    <div class="border-b-4 py-6 px-4 flex lg:block justify-between">
      <a class="block font-bold text-2xl" href="#">OverVoice</a>

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
      class="lg:flex flex-col flex-grow border-4 space-y-5 justify-between"
      :class="hideDropPanel ? 'flex' : 'hidden'"
    >
      <nav class="border-4 border-indigo-400 lg:grid space-y-8">
        <div class="p-4 hidden lg:block">
          <DarkModeToggle />
        </div>
        <div class="p-4 hover:bg-gray-500 mx-1 transition duration-200">Posts</div>
        <div class="p-4 rounded-sm hover:bg-gray-500 mx-1 transition duration-200">Polls</div>
      </nav>

      <!--  signin/signout -->
      <div class="flex justify-between border-4">
        <img
          class="rounded-full p-2"
          src="https://ui-avatars.com/api/?size=48?&name=Mingye+Li"
          alt=""
        />
        <a class="border-4 p-2 flex items-center border-ourvoice-red hover:bg-gray-700" href="#"
          >Sign out</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DarkButton from './DarkButton.vue'
import DarkModeToggle from './DarkModeToggle.vue'
import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
const hideDropPanel = ref(false)
const showSidebar = useToggle(hideDropPanel)
</script>
