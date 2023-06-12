<template>
  <header class="bg-black" v-if="userStore.sessionHash">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <!-- Logo -->
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">OurVoice</span>
          <img class="h-8 w-auto" src="@/assets/ourvoice_logo_new.png" alt="OurVoice Logo" />
        </a>
      </div>
      <!-- Desktop Menu -->
      <div class="flex lg:hidden">
        <!-- Mobile Menu Icon -->
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-bars']" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <router-link :to="item.href" v-for="item in navItems" :key="item.id" class="text-sm font-semibold leading-6 text-white hover:bg-gray-700"
        @click.prevent="handleItemClick(item.id)">
          <span :class="{ 'border-b-2': item.current }">
            {{ item.name }}
          </span>
        </router-link>
        <Popover class="relative">
          <PopoverButton
          class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white"
          :class="{ 'border-b-2': isModerationPage }">
            Moderation
            <font-awesome-icon :icon="['fas', 'fa-chevron-down']" />
          </PopoverButton>

          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in moderation" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-700">
                  <div class="flex-auto">
                    <a :href="item.href" class="block font-semibold text-white">
                      {{ item.name }}
                      <span class="absolute inset-0" />
                    </a>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </PopoverGroup>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <div class="flex-shrink-0 mr-0">
          <img class="inline-block h-9 w-9 rounded-full" :src="`https://ui-avatars.com/api/?name=${userStore.nicknameInParts.first}+${userStore.nicknameInParts.last}`" alt="PseudoNickname" />
        </div>
        <p class="text-white inline-block my-auto ml-2">
          {{ userStore.nickname }}
        </p>
      </div>
    </nav>
    <!-- Mobile Menu -->
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">OurVoice</span>
            <img class="h-8 w-auto" src="@/assets/ourvoice_logo_new.png" alt="OurVoice Logo" />
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <font-awesome-icon :icon="['fas', 'fa-xmark']" class="h-6 w-6 bg-white rounded-md" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <router-link :to="item.href" v-for="item in navItems"
              :key="item.id" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white"
              @click.prevent="handleItemClick(item.id)">
                <span :class="{ 'border-b-2': item.current }">
                  {{ item.name }}
                </span>
              </router-link>
              <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                <DisclosureButton
                class="flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-white hover:bg-gray-700">
                  Moderation
                  <font-awesome-icon :icon="['fas', 'fa-chevron-down']"
                  class="h-5 w-5 flex-none"
                  :class="{ 'rotate-180': open }" />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <DisclosureButton v-for="item in [...moderation]"
                  :key="item.name" as="div"
                  class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-white">
                    <router-link :to="item.href"
                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white"
                    @click.prevent="handleChildItemClick(item.id)">
                      <span :class="{ 'border-b-2': item.current }">
                        {{ item.name }}
                      </span>
                    </router-link>
                  </DisclosureButton>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div class="py-6 flex">
              <div class="flex-shrink-0 mr-0">
                <img class="inline-block h-9 w-9 rounded-full" :src="`https://ui-avatars.com/api/?name=${userStore.nicknameInParts.first}+${userStore.nicknameInParts.last}`" alt="PseudoNickname" />
              </div>
              <p class="text-white inline-block my-auto ml-2">
                {{ userStore.nickname }}
              </p>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/vue'
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { useDeploymentStore } from '@/stores/deployment';

const userStore = useUserStore()
const route = useRoute()
const currentPath = computed(() => route.fullPath)

onMounted(() => {
  console.log("Current path: ", currentPath.value)
  console.log("Deployment", useDeploymentStore().deployment)
})

// Single level nav items
const navItems = ref([
  { id: 1, name: 'Home', href: "/", current: currentPath.value === '/' },
  { id: 2, name: 'Active Threads', href: "/posts", current: currentPath.value === '/posts' },
  { id: 3, name: 'Polls', href: "/polls", current: currentPath.value === '/polls' },
])

// Multi level nav items
// TODO: Refactor this to be more dynamic
const moderation = ref([
  { id: 1, name: 'Posts', href: '/moderation/posts', current: currentPath.value === '/moderation/posts' },
  { id: 2, name: 'Comments', href: "/moderation/comments", current: currentPath.value === '/moderation/comments' }
])

const mobileMenuOpen = ref(false)

const handleItemClick = (id: number) => {
  for (let item of navItems.value) {
    item.current = item.id === id
  }
  moderation.value = moderation.value.map(item => ({ ...item, current: false }))
}

const handleChildItemClick = (id: number) => {
  for (let item of moderation.value) {
    item.current = item.id === id
  }
  navItems.value = navItems.value.map(item => ({ ...item, current: false }))
}

const isModerationPage = computed(() => {
  return currentPath.value.includes('/moderation')
})

watchEffect(() => {
  // Single level nav items
  navItems.value = [
    { id: 1, name: 'Home', href: "/", current: currentPath.value === '/' },
    { id: 2, name: 'Active Threads', href: "/posts", current: currentPath.value === '/posts' },
    { id: 3, name: 'Polls', href: "/polls", current: currentPath.value === '/polls' },
  ]

  // Multi level nav items
  moderation.value = [
    { id: 1, name: 'Posts', href: '/moderation/posts', current: currentPath.value === '/moderation/posts' },
    { id: 2, name: 'Comments', href: "/moderation/comments", current: currentPath.value === '/moderation/comments' }
  ]
})
</script>
