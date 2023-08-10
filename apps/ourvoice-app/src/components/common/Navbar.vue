<template>
  <header class="bg-ourvoice-primary-2" v-if="userStore.sessionHash" data-cy="ourvoice-navbar">
    <nav
      class="mx-auto grid grid-cols-3 md:grid-cols-5 grid-flow-row-dense p-6 gap-y-5"
      aria-label="Global"
    >
      <!-- Logo -->
      <div class="sm:col-span-1 place-self-center">
        <div class="flex gap-3 place-items-center">
          <div class="border-r-2 border-ourvoice-base px-2">
            <a href="/">
              <span class="sr-only">OurVoice</span>
              <img
                class="object-cover"
                src="@/assets/logo/ourvoice_logo_primary_light.svg"
                alt="OurVoice Logo"
              />
            </a>
          </div>
          <div>
            <a href="/" class="">
              <span class="sr-only">Diversity Council Australia</span>
              <img class="w-24 rounded-md" src="@/assets/logo/dca_logo.png" alt="Deployment Logo" />
            </a>
          </div>
        </div>
      </div>

      <!-- Toggle -->
      <div
        class="w-fit justify-self-center col-span-full lg:col-start-3 lg:col-span-1"
        v-if="currentPathIsReady && !hasElevatedPermissions"
      >
        <Toggle
          :items="toggleItems"
          v-if="navBarSwitchState"
          :start-left="navBarSwitchState === 'post'"
          @on-toggle="handleToggle"
        />
      </div>

      <!-- Create Post Button & Mobile Menu MD -->
      <div class="col-start-3 place-self-center hidden md:flex lg:hidden">
        <CreatePostNavButton class="inline-flex" />
      </div>
      <div class="hidden md:flex lg:hidden justify-self-end col-start-5 gap-10">
        <!-- Mobile Menu Icon -->
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-ourvoice-white"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <font-awesome-icon class="w-5 h-5" :icon="faBars" />
        </button>
      </div>

      <!-- Create Post Button & Mobile Menu SM -->
      <div class="grid md:hidden md:col-span-1 col-start-2 md:col-start-3">
        <CreatePostNavButton class="inline-flex mx-auto text-center" />
      </div>
      <div class="grid col-start-3 md:col-start-5 md:hidden justify-self-end">
        <!-- Mobile Menu Icon -->
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-ourvoice-white"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <font-awesome-icon class="w-5 h-5" :icon="faBars" />
        </button>
      </div>
      <!-- Desktop Menu -->
      <div
        class="hidden lg:flex lg:gap-x-10 justify-center justify-self-end px-2"
        :class="`${hasElevatedPermissions ? 'lg:col-start-3' : 'lg:col-start-4'}`"
      >
        <!-- Nav Items -->
        <PopoverGroup class="flex gap-5 items-center">
          <router-link
            :to="item.href"
            v-for="item in navItems"
            :key="item.id"
            class="text-sm font-semibold leading-6 text-ourvoice-white hover:bg-ourvoice-primary-1"
            @click.prevent="handleItemClick(item.id)"
          >
            <span
              v-if="hasElevatedPermissions"
              class="lg:block"
              :class="{ 'border-b-2': item.current, hidden: !item.showOnSmallScreen }"
            >
              {{ item.name }}
            </span>
            <span
              v-else-if="item.href === '/about'"
              class="lg:block"
              :class="{ 'border-b-2': item.current, hidden: !item.showOnSmallScreen }"
            >
              {{ item.name }}
            </span>
          </router-link>

          <!-- Moderation Dropdown start-->
          <Popover
            :class="{
              hidden: !hasElevatedPermissions
            }"
            class="relative"
            v-slot="{ open, close }"
          >
            <PopoverButton
              class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-ourvoice-white"
              :class="{ 'border-b-2': isModerationPage }"
            >
              Moderation
              <font-awesome-icon
                :icon="faChevronDown"
                class="transition-transform"
                :class="{ 'rotate-180': open }"
              />
            </PopoverButton>

            <TransitionRoot
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <PopoverPanel
                class="absolute -left-8 top-full z-10 mt-3 w-fit max-w-md overflow-hidden rounded-3xl bg-ourvoice-primary-2 shadow-lg ring-1 ring-gray-900/5"
                static
              >
                <div class="p-4" v-if="open">
                  <div
                    v-for="item in moderation"
                    :key="item.name"
                    class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-ourvoice-primary-1"
                  >
                    <div class="flex-auto">
                      <router-link
                        :to="item.href"
                        class="block font-semibold text-ourvoice-white"
                        @click.prevent="() => close()"
                      >
                        {{ item.name }}
                        <span class="absolute inset-0" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </TransitionRoot>
          </Popover>
          <!-- Moderation Dropdown end-->
        </PopoverGroup>
      </div>
      <div class="hidden lg:inline-flex items-center gap-5 lg:col-start-5 justify-self-end">
        <!-- Create Post Button LG and above -->
        <div>
          <CreatePostNavButton class="hidden lg:inline-flex" />
        </div>
        <!-- User Settings -->
        <div>
          <Popover class="relative" v-slot="{ open, close }">
            <PopoverButton
              class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-ourvoice-white"
            >
              <div class="flex-shrink-0 mr-0" v-if="userStore.nicknameInParts">
                <img
                  class="inline-block h-9 w-9 rounded-full"
                  :src="`https://ui-avatars.com/api/?name=${userStore.nicknameInParts.first}+${userStore.nicknameInParts.last}`"
                  alt="PseudoNickname"
                />
              </div>
              <font-awesome-icon
                :icon="faChevronDown"
                class="transition-transform"
                :class="{ 'rotate-180': open }"
              />
            </PopoverButton>
            <TransitionRoot
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <PopoverPanel
                class="absolute -left-40 top-full z-10 mt-3 w-fit max-w-md overflow-hidden rounded-3xl bg-ourvoice-primary-2 shadow-lg ring-1 ring-gray-900/5"
              >
                <div class="p-4">
                  <div
                    v-on:click="
                      (() => {
                        $router.push({ name: 'settings' })
                        close()
                      })
                    "
                    class="p-4 text-sm block font-semibold rounded-lg text-ourvoice-white cursor-pointer hover:bg-ourvoice-primary-1"
                  >
                    Preferences
                    <span class="absolute inset-0" />
                  </div>
                  <div
                    class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-ourvoice-primary-1"
                  >
                    <div class="flex-auto">
                      <div
                        v-on:click="signOut"
                        class="block font-semibold text-ourvoice-white cursor-pointer"
                      >
                        Sign Out
                        <span class="absolute inset-0" />
                      </div>
                      <p
                        class="text-ourvoice-white inline-block my-auto underline underline-offset-4"
                      >
                        {{ userStore.nickname }}
                      </p>
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </TransitionRoot>
          </Popover>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-30" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-30 w-full overflow-y-auto bg-ourvoice-primary-2 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">OurVoice</span>
            <img
              class="h-8 w-auto"
              src="@/assets/logo/ourvoice_logo_primary_light.svg"
              alt="OurVoice Logo"
            />
          </a>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <font-awesome-icon :icon="faXmark" class="h-6 w-6 bg-ourvoice-white rounded-md" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <router-link
                :to="item.href"
                v-for="item in navItems"
                :key="item.id"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-ourvoice-white"
                @click.prevent="handleItemClick(item.id)"
              >
                <span :class="{ 'border-b-2': item.current }">
                  {{ item.name }}
                </span>
              </router-link>

              <!-- Mobile Moderation Dropdown Disclosure -->
              <Disclosure
                as="div"
                class="-mx-3"
                :class="{
                  hidden: !hasElevatedPermissions
                }"
                v-slot="{ open }"
              >
                <DisclosureButton
                  class="flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-ourvoice-white hover:bg-ourvoice-primary-1"
                >
                  Moderation
                  <font-awesome-icon
                    :icon="faChevronDown"
                    class="h-5 w-5 flex-none"
                    :class="{ 'rotate-180': open }"
                  />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <DisclosureButton
                    v-for="item in [...moderation]"
                    :key="item.name"
                    as="div"
                    class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-ourvoice-white"
                  >
                    <router-link
                      :to="item.href"
                      class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-ourvoice-white"
                      @click.prevent="handleChildItemClick(item.id)"
                    >
                      <span :class="{ 'border-b-2': item.current }">
                        {{ item.name }}
                      </span>
                    </router-link>
                  </DisclosureButton>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div class="py-6 flex">
              <!-- User Settings Disclosure -->
              <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                <DisclosureButton
                  class="flex w-full gap-3 items-center justify-between py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-ourvoice-white hover:bg-ourvoice-primary-1"
                >
                  <div class="flex-shrink-0 mr-0">
                    <img
                      class="inline-block h-9 w-9 rounded-full"
                      :src="`https://ui-avatars.com/api/?name=${userStore.nicknameInParts.first}+${userStore.nicknameInParts.last}`"
                      alt="PseudoNickname"
                    />
                  </div>
                  <p class="text-ourvoice-white inline-block my-auto underline underline-offset-4">
                    {{ userStore.nickname }}
                  </p>
                  <font-awesome-icon
                    :icon="faChevronDown"
                    class="h-5 w-5 flex-none"
                    :class="{ 'rotate-180': open }"
                  />
                </DisclosureButton>
                <!-- User Settings Dropdown Panel -->
                <DisclosurePanel class="mt-2 space-y-2">
                  <DisclosureButton
                    as="div"
                    class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-ourvoice-white"
                    @click.prevent="signOut"
                  >
                    Sign Out
                  </DisclosureButton>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import Toggle from './Toggle.vue'
import CreatePostNavButton from '../post/CreatePostNavButton.vue'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel
} from '@headlessui/vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useDeploymentStore } from '@/stores/deployment'
import Session from 'supertokens-web-js/recipe/session'

import ThreadsIcon from '@/assets/icons/threads.svg'
import ThreadsIconDark from '@/assets/icons/threads-dark.svg'
import PollsIcon from '@/assets/icons/polls.svg'
import PollsIconDark from '@/assets/icons/polls-dark.svg'
import { faBars, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons'

const toggleItems = {
  left: {
    iconLight: ThreadsIcon,
    iconDark: ThreadsIconDark,
    label: 'Discussion',
    hasUpdates: false
  },
  right: {
    iconLight: PollsIcon,
    iconDark: PollsIconDark,
    label: 'Polls',
    hasUpdates: false
  }
}
let currentPathIsReady = ref(false)

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const currentPath = computed(() => route.fullPath)
const navBarSwitchState = computed(() => route.meta.navBarSwitchState as string | undefined)

const hasElevatedPermissions = computed(
  () => userStore.isModerator || userStore.isAdmin || userStore.isSuperAdmin
)

router.afterEach(async () => {
  currentPathIsReady.value = false
  await router.isReady()
  currentPathIsReady.value = true
})

const signOut = async () => {
  await Session.signOut()
  window.location.assign('/')
}

// Single level nav items
const navItems = ref([
  {
    id: 1,
    name: 'Discussion',
    href: '/posts',
    current: currentPath.value === '/posts',
    showOnSmallScreen: false
  },
  {
    id: 2,
    name: 'Polls',
    href: '/polls',
    current: currentPath.value === '/polls',
    showOnSmallScreen: false
  },
  {
    id: 3,
    name: 'FAQ',
    href: '/about',
    current: currentPath.value === '/about',
    showOnSmallScreen: true
  }
])

// Multi level nav items
// TODO: Refactor this to be more dynamic
const moderation = ref([
  {
    id: 1,
    name: 'Posts',
    href: '/moderation/posts',
    current: currentPath.value === '/moderation/posts'
  },
  {
    id: 2,
    name: 'Comments',
    href: '/moderation/comments',
    current: currentPath.value === '/moderation/comments'
  },
  {
    id: 3,
    name: 'Polls',
    href: '/moderation/polls',
    current: currentPath.value === '/moderation/polls'
  }
])

const mobileMenuOpen = ref(false)

const handleItemClick = (id: number) => {
  for (let item of navItems.value) {
    item.current = item.id === id
  }
  moderation.value = moderation.value.map((item) => ({ ...item, current: false }))

  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

const handleChildItemClick = (id: number) => {
  for (let item of moderation.value) {
    item.current = item.id === id
  }
  navItems.value = navItems.value.map((item) => ({ ...item, current: false }))

  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

const handleToggle = (direction: 'left' | 'right') => {
  if (direction === 'left') {
    router.push('/posts')
  } else {
    router.push('/polls')
  }
}

const isModerationPage = computed(() => {
  return currentPath.value.includes('/moderation')
})

watchEffect(() => {
  // Single level nav items
  navItems.value = [
    {
      id: 1,
      name: 'Discussion',
      href: '/posts',
      current: currentPath.value === '/posts',
      showOnSmallScreen: false
    },
    {
      id: 2,
      name: 'Polls',
      href: '/polls',
      current: currentPath.value === '/polls',
      showOnSmallScreen: false
    },
    {
      id: 3,
      name: 'FAQ',
      href: '/about',
      current: currentPath.value === '/about',
      showOnSmallScreen: true
    }
  ]

  // Multi level nav items
  moderation.value = [
    {
      id: 1,
      name: 'Posts',
      href: '/moderation/posts',
      current: currentPath.value === '/moderation/posts'
    },
    {
      id: 2,
      name: 'Comments',
      href: '/moderation/comments',
      current: currentPath.value === '/moderation/comments'
    },
    {
      id: 3,
      name: 'Polls',
      href: '/moderation/polls',
      current: currentPath.value === '/moderation/polls'
    }
  ]
})
</script>
