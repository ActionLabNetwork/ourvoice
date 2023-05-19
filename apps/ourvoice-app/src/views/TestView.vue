<template>
  <!-- 
1. Apply h-screen
2. Apply overflow-y-hidden at main container
3. Apply overflow-y-auto to column that needs scroll
-->
  <div class="min-h-screen h-screen flex flex-col">
    <header class="bg-ourvoice-gray border-b border-slate-400 dark:text-gray-400 dark:bg-gray-800">
      <HeaderNavBar class="lg:hidden" />
    </header>

    <!-- main container -->
    <div class="flex-1 flex flex-row overflow-y-hidden dark:text-gray-400 dark:bg-gray-700">
      <nav
        class="order-first hidden lg:block w-48 lg:w-64 xl:w-96 bg-ourvoice-gray p-5 overflow-y-auto no-scrollbar"
      >
        <div
          class="text-ourvoice-blue dark:text-ourvoice-white text-5xl xl:text-6xl text-center mb-6"
        >
          <span class="text-ourvoice-red">Our</span>
          <span>Voice</span>
        </div>
        <div class="text-center">
          <DarkModeToggle />
        </div>

        <!-- <ul class="text-xs underline">
          <li>
            <a href="/ui/avatar" class="block hover:bg-indigo-50 py-2 px-2 rounded">Avatar</a>
          </li>
          <li>
            <a href="/ui/avatar-initial" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Avatar Initial</a
            >
          </li>
          <li>
            <a href="/ui/avatar-presence" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Avatar Presence</a
            >
          </li>
          <li>
            <a href="/ui/avatar-stack" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Avatar Stack</a
            >
          </li>
          <li><a href="/ui/badge" class="block hover:bg-indigo-50 py-2 px-2 rounded">Badge</a></li>
          <li>
            <a href="/ui/box-arrow" class="block hover:bg-indigo-50 py-2 px-2 rounded">Box Arrow</a>
          </li>
          <li>
            <a href="/ui/button" class="block hover:bg-indigo-50 py-2 px-2 rounded">Button</a>
          </li>
          <li>
            <a href="/ui/stacked-card" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Card Stacked</a
            >
          </li>
          <li>
            <a href="/ui/centering" class="block hover:bg-indigo-50 py-2 px-2 rounded">Centering</a>
          </li>
          <li>
            <a href="/ui/centering-icon" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Centering Icon</a
            >
          </li>
          <li>
            <a href="/ui/centering-row" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Centering Row Items</a
            >
          </li>
          <li>
            <a
              href="/ui/chat-box"
              aria-current="page"
              class="block hover:bg-indigo-50 py-2 px-2 rounded nuxt-link-exact-active nuxt-link-active"
              >Chat Box</a
            >
          </li>
          <li>
            <a href="/ui/docked-corner" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Docked Corner</a
            >
          </li>
          <li>
            <a href="/ui/layout-drawer" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Drawer</a
            >
          </li>
          <li>
            <a href="/ui/fixed-corner" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Fixed at corner</a
            >
          </li>
          <li>
            <a href="/ui/fixed-screen" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Fixed at screen</a
            >
          </li>
          <li>
            <a href="/ui/fixed-side" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Fixed at side</a
            >
          </li>
          <li>
            <a href="/ui/fullscreen-background" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Full Screen Background</a
            >
          </li>
          <li>
            <a href="/ui/flex-grid" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Grid with Flexbox</a
            >
          </li>
          <li>
            <a href="/ui/indicator" class="block hover:bg-indigo-50 py-2 px-2 rounded">Indicator</a>
          </li>
          <li>
            <a href="/ui/input-addon" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Input Addon</a
            >
          </li>
          <li>
            <a href="/ui/layout-holy-grail" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Holy Grail</a
            >
          </li>
          <li>
            <a href="/ui/layout-sidebar" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Sidebar</a
            >
          </li>
          <li>
            <a href="/ui/layout-split" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Split</a
            >
          </li>
          <li>
            <a href="/ui/layout-sticky-footer" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Sticky Footer</a
            >
          </li>
          <li>
            <a href="/ui/layout-sticky-header" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Sticky Header</a
            >
          </li>
          <li>
            <a href="/ui/media-object" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Media Object</a
            >
          </li>
          <li>
            <a href="/ui/overlay-loading" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Overlay Loading</a
            >
          </li>
          <li>
            <a href="/ui/responsive-column" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Responsive Column</a
            >
          </li>
          <li>
            <a href="/ui/ribbon-corner" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Ribbon at corner</a
            >
          </li>
          <li>
            <a href="/ui/search-result" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Search Result</a
            >
          </li>
          <li>
            <a href="/ui/vertical-scroll" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Vertical Scroll</a
            >
          </li>
        </ul> -->
      </nav>

      <main
        class="flex-1 border-x border-slate-400 text-xs overflow-y-auto md:no-scrollbar relative"
      >
        <div
          class="backdrop-blur-3xl drop-shadow-lg bg-gray-100 dark:bg-gray-700 bg-opacity-70 text-xl font-semibold sticky top-0 left-0"
        >
          <MainNavTabs />
        </div>
        <div class="px-2">
          <div class="leading-10">
            {{ postsStoreRef }}
          </div>
        </div>
      </main>

      <aside
        class="hidden lg:block w-48 lg:w-64 xl:w-96 bg-ourvoice-gray p-5 overflow-y-auto no-scrollbar"
      >
        <CategoryFilter />
        <!-- <ul class="text-xs underline">
          <li>
            <a href="/ui/avatar" class="block hover:bg-indigo-50 py-2 px-2 rounded">Avatar</a>
          </li>
          <li>
            <a href="/ui/avatar-initial" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Avatar Initial</a
            >
          </li>
          <li>
            <a href="/ui/avatar-presence" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Avatar Presence</a
            >
          </li>
          <li>
            <a href="/ui/avatar-stack" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Avatar Stack</a
            >
          </li>
          <li><a href="/ui/badge" class="block hover:bg-indigo-50 py-2 px-2 rounded">Badge</a></li>
          <li>
            <a href="/ui/box-arrow" class="block hover:bg-indigo-50 py-2 px-2 rounded">Box Arrow</a>
          </li>
          <li>
            <a href="/ui/button" class="block hover:bg-indigo-50 py-2 px-2 rounded">Button</a>
          </li>
          <li>
            <a href="/ui/stacked-card" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Card Stacked</a
            >
          </li>
          <li>
            <a href="/ui/centering" class="block hover:bg-indigo-50 py-2 px-2 rounded">Centering</a>
          </li>
          <li>
            <a href="/ui/centering-icon" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Centering Icon</a
            >
          </li>
          <li>
            <a href="/ui/centering-row" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Centering Row Items</a
            >
          </li>
          <li>
            <a
              href="/ui/chat-box"
              aria-current="page"
              class="block hover:bg-indigo-50 py-2 px-2 rounded nuxt-link-exact-active nuxt-link-active"
              >Chat Box</a
            >
          </li>
          <li>
            <a href="/ui/docked-corner" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Docked Corner</a
            >
          </li>
          <li>
            <a href="/ui/layout-drawer" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Drawer</a
            >
          </li>
          <li>
            <a href="/ui/fixed-corner" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Fixed at corner</a
            >
          </li>
          <li>
            <a href="/ui/fixed-screen" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Fixed at screen</a
            >
          </li>
          <li>
            <a href="/ui/fixed-side" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Fixed at side</a
            >
          </li>
          <li>
            <a href="/ui/fullscreen-background" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Full Screen Background</a
            >
          </li>
          <li>
            <a href="/ui/flex-grid" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Grid with Flexbox</a
            >
          </li>
          <li>
            <a href="/ui/indicator" class="block hover:bg-indigo-50 py-2 px-2 rounded">Indicator</a>
          </li>
          <li>
            <a href="/ui/input-addon" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Input Addon</a
            >
          </li>
          <li>
            <a href="/ui/layout-holy-grail" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Holy Grail</a
            >
          </li>
          <li>
            <a href="/ui/layout-sidebar" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Sidebar</a
            >
          </li>
          <li>
            <a href="/ui/layout-split" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Split</a
            >
          </li>
          <li>
            <a href="/ui/layout-sticky-footer" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Sticky Footer</a
            >
          </li>
          <li>
            <a href="/ui/layout-sticky-header" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Layout Sticky Header</a
            >
          </li>
          <li>
            <a href="/ui/media-object" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Media Object</a
            >
          </li>
          <li>
            <a href="/ui/overlay-loading" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Overlay Loading</a
            >
          </li>
          <li>
            <a href="/ui/responsive-column" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Responsive Column</a
            >
          </li>
          <li>
            <a href="/ui/ribbon-corner" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Ribbon at corner</a
            >
          </li>
          <li>
            <a href="/ui/search-result" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Search Result</a
            >
          </li>
          <li>
            <a href="/ui/vertical-scroll" class="block hover:bg-indigo-50 py-2 px-2 rounded"
              >Vertical Scroll</a
            >
          </li>
        </ul> -->
      </aside>
    </div>
    <!-- end main container -->
    <footer class="bg-white dark:bg-gray-800 border-t border-slate-400">
      <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
          >© 2023 <a href="#" class="hover:underline">OurVoice</a>. All Rights Reserved.
        </span>
        <ul
          class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0"
        >
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
  </div>
</template>
<script lang="ts" setup>
import HeaderNavBar from '@/components/common/HeaderNavBar.vue'
import MainNavTabs from '@/components/MainNavTabs.vue'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'
import CategoryFilter from '@/components/common/CategoryFilter.vue'
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'

const postsStore = usePostsStore()
postsStore.fetchPosts({ limit: 10 })
const postsStoreRef = storeToRefs(postsStore)
</script>
