<template>
  <div>
    <!-- Main navigation container -->
    <nav
      class="flex-no-wrap relative flex w-full items-center justify-between bg-ourvoice-gray py-2 shadow-md shadow-black/5 dark:bg-gray-800 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4"
      data-te-navbar-ref
    >
      <div class="flex w-full flex-wrap items-center justify-between px-3">
        <div>
          <div class="text-ourvoice-blue dark:text-ourvoice-white text-5xl xl:text-6xl text-center">
            <span class="text-ourvoice-red">Our</span>
            <span>Voice</span>
          </div>
        </div>
        <div class="relative flex items-center">
          <DarkButton class="mr-4" />

          <!-- Second dropdown container -->
          <div class="relative" data-te-dropdown-ref>
            <!-- Second dropdown trigger -->
            <a
              class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
              href="#"
              id="dropdownMenuButton2"
              role="button"
              data-te-dropdown-toggle-ref
              aria-expanded="false"
              @click="toggleDropDown()"
            >
              <!-- User avatar -->
              <img
                src="https://api.multiavatar.com/user3.png"
                class="rounded-full"
                style="height: 25px; width: 25px"
                alt=""
                loading="lazy"
              />
            </a>
            <!-- Second dropdown menu -->
            <ul
              class="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
              :class="{ hidden: !dropdownOpen }"
              aria-labelledby="dropdownMenuButton2"
              data-te-dropdown-menu-ref
            >
              <!-- Second dropdown menu items -->
              <li>
                <a
                  class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                  href="#"
                  data-te-dropdown-item-ref
                  >Action</a
                >
              </li>
              <li>
                <a
                  class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                  href="#"
                  data-te-dropdown-item-ref
                  >Another action</a
                >
              </li>
              <li>
                <a
                  class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
                  href="#"
                  data-te-dropdown-item-ref
                  >Something else here</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import DarkButton from './DarkButton.vue'
const [dropdownOpen, toggleDropDown] = useToggle()
</script>
