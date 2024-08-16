<!-- eslint-disable vue/component-name-in-template-casing -->
<!-- eslint-disable prettier/prettier -->
<template>
  <header
    v-if="userStore.sessionHash"
    class="bg-ourvoice-base-dark-100"
    data-cy="ourvoice-navbar"
  >
    <nav
      aria-label="Global"
      class="mx-auto grid grid-cols-3 md:grid-cols-5 grid-flow-row-dense p-6 gap-y-5"
    >
      <!-- Logo -->
      <div class="sm:col-span-1 place-self-center">
        <div class="flex gap-3 place-items-center">
          <div class="border-r-2 border-ourvoice-base px-2">
            <a href="/">
              <span class="sr-only">OurVoice</span>
              <img
                alt="OurVoice Logo"
                class="object-cover"
                src="@/assets/logo/ourvoice_logo_primary_light.svg"
              >
            </a>
          </div>
          <div>
            <a class="" href="/">
              <span class="sr-only">Diversity Council Australia</span>
              <img
                alt="Deployment Logo"
                class="w-24 rounded-md"
                src="@/assets/logo/ourvoice_logo_demo_org_light.svg"
              >
            </a>
          </div>
        </div>
      </div>

      <!-- Toggle -->
      <div
        v-if="currentPathIsReady && !hasElevatedPermissions"
        class="w-fit justify-self-center col-span-full lg:col-start-3 lg:col-span-1"
      >
        <toggle
          v-if="navBarSwitchState"
          :items="toggleItems"
          :start-left="navBarSwitchState === 'post'"
          @on-toggle="handleToggle"
        />
      </div>

      <!-- Create Post Button & Mobile Menu MD -->
      <div class="col-start-3 place-self-center hidden md:flex lg:hidden">
        <create-post-nav-button class="inline-flex" />
      </div>
      <div class="hidden md:flex lg:hidden justify-self-end col-start-5 gap-10">
        <!-- Mobile Menu Icon -->
        <button
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-ourvoice-white"
          type="button"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <font-awesome-icon class="w-5 h-5" :icon="faBars" />
        </button>
      </div>

      <!-- Create Post Button & Mobile Menu SM -->
      <div class="grid md:hidden md:col-span-1 col-start-2 md:col-start-3">
        <create-post-nav-button class="inline-flex mx-auto text-center" />
      </div>
      <div class="grid col-start-3 md:col-start-5 md:hidden justify-self-end">
        <!-- Mobile Menu Icon -->
        <button
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-ourvoice-white"
          type="button"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <font-awesome-icon class="w-5 h-5" :icon="faBars" />
        </button>
      </div>
      <!-- Desktop Menu -->
      <div
        class="hidden lg:flex lg:gap-x-10 justify-center justify-self-end px-2"
        :class="`${
          hasElevatedPermissions ? 'lg:col-start-3' : 'lg:col-start-4'
        }`"
      >
        <!-- Nav Items -->
        <popover-group class="flex gap-5 items-center">
          <router-link
            v-for="item in navItems"
            :key="item.id"
            class="text-sm font-semibold leading-6 text-ourvoice-white hover:bg-ourvoice-secondary-1"
            :to="item.href"
            @click.prevent="handleItemClick(item.id)"
          >
            <span
              v-if="hasElevatedPermissions"
              class="lg:block"
              :class="{
                'border-b-2': item.current,
                'hidden': !item.showOnSmallScreen,
              }"
            >
              {{ item.name }}
            </span>
            <span
              v-else-if="item.href === '/about'"
              class="lg:block"
              :class="{
                'border-b-2': item.current,
                'hidden': !item.showOnSmallScreen,
              }"
            >
              {{ item.name }}
            </span>
          </router-link>

          <!-- Moderation Dropdown start -->
          <popover
            v-slot="{ open, close }"
            class="relative"
            :class="{
              hidden: !hasElevatedPermissions,
            }"
          >
            <popover-button
              class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-ourvoice-white"
              :class="{ 'border-b-2': isModerationPage }"
            >
              Moderation
              <font-awesome-icon
                class="transition-transform"
                :class="{ 'rotate-180': open }"
                :icon="faChevronDown"
              />
            </popover-button>

            <TransitionRoot
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <popover-panel
                class="absolute -left-8 top-full z-10 mt-3 w-fit max-w-md overflow-hidden rounded-3xl bg-ourvoice-accent shadow-lg ring-1 ring-gray-900/5"
                static
              >
                <div v-if="open" class="p-4">
                  <div
                    v-for="item in moderation"
                    :key="item.name"
                    class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-ourvoice-primary-1"
                  >
                    <div class="flex-auto">
                      <router-link
                        class="block font-semibold text-ourvoice-black"
                        :to="item.href"
                        @click.prevent="() => close()"
                      >
                        {{ item.name }}
                        <span class="absolute inset-0" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </popover-panel>
            </TransitionRoot>
          </popover>
          <!-- Moderation Dropdown end -->
        </popover-group>
      </div>
      <div
        class="hidden lg:inline-flex items-center gap-5 lg:col-start-5 justify-self-end"
      >
        <!-- Create Post Button LG and above -->
        <div>
          <create-post-nav-button class="hidden lg:inline-flex" />
        </div>
        <!-- User Settings -->
        <div>
          <popover v-slot="{ open, close }" class="relative">
            <popover-button
              class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-ourvoice-black"
            >
              <div v-if="userStore.nicknameInParts" class="flex-shrink-0 mr-0">
                <img
                  alt="PseudoNickname"
                  class="inline-block h-9 w-9 rounded-full"
                  :src="`https://ui-avatars.com/api/?name=${userStore.nicknameInParts.first}+${userStore.nicknameInParts.last}`"
                >
              </div>
              <font-awesome-icon
                class="transition-transform"
                :class="{ 'rotate-180': open }"
                :icon="faChevronDown"
              />
            </popover-button>
            <TransitionRoot
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <popover-panel
                class="absolute -left-40 top-full z-10 mt-3 w-fit max-w-md overflow-hidden rounded-3xl bg-ourvoice-accent shadow-lg ring-1 ring-gray-900/5"
              >
                <div class="p-4">
                  <div
                    class="p-4 text-sm block font-semibold rounded-lg text-ourvoice-black cursor-pointer hover:bg-ourvoice-primary-1"
                    @click="
                      () => {
                        navigateToSettings()
                        close()
                      }
                    "
                  >
                    Preferences
                    <span class="absolute inset-0" />
                  </div>
                  <div
                    class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-ourvoice-primary-1"
                  >
                    <div class="flex-auto">
                      <div
                        class="block font-semibold text-ourvoice-black cursor-pointer"
                        @click="signOut"
                      >
                        Sign Out
                        <span class="absolute inset-0" />
                      </div>
                      <p
                        class="text-ourvoice-black inline-block my-auto underline underline-offset-4"
                      >
                        {{ userStore.nickname }}
                      </p>
                    </div>
                  </div>
                </div>
              </popover-panel>
            </TransitionRoot>
          </popover>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Dialog
      as="div"
      class="lg:hidden"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 z-30" />
      <dialog-panel
        class="fixed inset-y-0 right-0 z-30 w-full overflow-y-auto bg-ourvoice-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <a class="-m-1.5 p-1.5" href="#">
            <span class="sr-only">OurVoice</span>
            <img
              alt="OurVoice Logo"
              class="h-8 w-auto"
              src="@/assets/logo/ourvoice_logo_primary_dark.svg"
            >
          </a>
          <button
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            type="button"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <font-awesome-icon
              class="h-6 w-6 bg-ourvoice-white rounded-md"
              :icon="faXmark"
            />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <router-link
                v-for="item in navItems"
                :key="item.id"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-ourvoice-black"
                :to="item.href"
                @click.prevent="handleItemClick(item.id)"
              >
                <span :class="{ 'border-b-2': item.current }">
                  {{ item.name }}
                </span>
              </router-link>

              <!-- Mobile Moderation Dropdown Disclosure -->
              <disclosure
                v-slot="{ open }"
                as="div"
                class="-mx-3"
                :class="{
                  hidden: !hasElevatedPermissions,
                }"
              >
                <disclosure-button
                  class="flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-ourvoice-black hover:bg-ourvoice-primary-1"
                >
                  Moderation
                  <font-awesome-icon
                    class="h-5 w-5 flex-none"
                    :class="{ 'rotate-180': open }"
                    :icon="faChevronDown"
                  />
                </disclosure-button>
                <disclosure-panel class="mt-2 space-y-2">
                  <disclosure-button
                    v-for="item in [...moderation]"
                    :key="item.name"
                    as="div"
                    class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-ourvoice-black"
                  >
                    <router-link
                      class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-ourvoice-black"
                      :to="item.href"
                      @click.prevent="handleChildItemClick(item.id)"
                    >
                      <span :class="{ 'border-b-2': item.current }">
                        {{ item.name }}
                      </span>
                    </router-link>
                  </disclosure-button>
                </disclosure-panel>
              </disclosure>
            </div>
            <div class="py-6 flex">
              <!-- User Settings Disclosure -->
              <disclosure v-slot="{ open }" as="div" class="-mx-3">
                <disclosure-button
                  class="flex w-full gap-3 items-center justify-between py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-ourvoice-black hover:bg-ourvoice-primary-1"
                >
                  <div class="flex-shrink-0 mr-0">
                    <img
                      alt="PseudoNickname"
                      class="inline-block h-9 w-9 rounded-full"
                      :src="`https://ui-avatars.com/api/?name=${userStore.nicknameInParts.first}+${userStore.nicknameInParts.last}`"
                    >
                  </div>
                  <p
                    class="text-ourvoice-black inline-block my-auto underline underline-offset-4"
                  >
                    {{ userStore.nickname }}
                  </p>
                  <font-awesome-icon
                    class="h-5 w-5 flex-none"
                    :class="{ 'rotate-180': open }"
                    :icon="faChevronDown"
                  />
                </disclosure-button>
                <!-- User Settings Dropdown Panel -->
                <disclosure-panel class="mt-2 space-y-2">
                  <disclosure-button
                    as="div"
                    class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-ourvoice-black hover:underline cursor-pointer"
                    @click.prevent="
                      () => {
                        navigateToSettings()
                        mobileMenuOpen = false
                      }
                    "
                  >
                    Preferences
                  </disclosure-button>
                  <disclosure-button
                    as="div"
                    class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-ourvoice-black hover:underline cursor-pointer"
                    @click.prevent="signOut"
                  >
                    Sign Out
                  </disclosure-button>
                </disclosure-panel>
              </disclosure>
            </div>
          </div>
        </div>
      </dialog-panel>
    </dialog>
  </header>
</template>

<script setup lang="ts">
import {
  faBars,
  faChevronDown,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
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
import Session from 'supertokens-web-js/recipe/session'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PollsIcon from '@/assets/icons/polls.svg'
import PollsIconDark from '@/assets/icons/polls-dark.svg'
import ThreadsIcon from '@/assets/icons/threads.svg'
import ThreadsIconDark from '@/assets/icons/threads-dark.svg'
import { useUserStore } from '@/stores/user'

import CreatePostNavButton from '../post/CreatePostNavButton.vue'
import Toggle from './Toggle.vue'

const toggleItems = {
  left: {
    iconLight: ThreadsIcon,
    iconDark: ThreadsIconDark,
    label: 'Discussion',
    hasUpdates: false,
  },
  right: {
    iconLight: PollsIcon,
    iconDark: PollsIconDark,
    label: 'Polls',
    hasUpdates: false,
  },
}
const currentPathIsReady = ref(false)

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const currentPath = computed(() => route.fullPath)
const navBarSwitchState = computed(
  () => route.meta.navBarSwitchState as string | undefined,
)

const hasElevatedPermissions = computed(
  () => userStore.isModerator || userStore.isAdmin || userStore.isSuperAdmin,
)

router.afterEach(async () => {
  currentPathIsReady.value = false
  await router.isReady()
  currentPathIsReady.value = true
})

async function signOut() {
  await Session.signOut()
  window.location.assign('/')
}

async function navigateToSettings() {
  router.push({ name: 'settings' })
}

// Single level nav items
const navItems = ref([
  {
    id: 1,
    name: 'Discussion',
    href: '/posts',
    current: currentPath.value === '/posts',
    showOnSmallScreen: false,
  },
  {
    id: 2,
    name: 'Polls',
    href: '/polls',
    current: currentPath.value === '/polls',
    showOnSmallScreen: false,
  },
  {
    id: 3,
    name: 'FAQ',
    href: '/about',
    current: currentPath.value === '/about',
    showOnSmallScreen: true,
  },
])

// Multi level nav items
// TODO: Refactor this to be more dynamic
const moderation = ref([
  {
    id: 1,
    name: 'Posts',
    href: '/moderation/posts',
    current: currentPath.value === '/moderation/posts',
  },
  {
    id: 2,
    name: 'Comments',
    href: '/moderation/comments',
    current: currentPath.value === '/moderation/comments',
  },
  {
    id: 3,
    name: 'Polls',
    href: '/moderation/polls',
    current: currentPath.value === '/moderation/polls',
  },
])

const mobileMenuOpen = ref(false)

function handleItemClick(id: number) {
  for (const item of navItems.value) {
    item.current = item.id === id
  }
  moderation.value = moderation.value.map(item => ({ ...item, current: false }))

  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

function handleChildItemClick(id: number) {
  for (const item of moderation.value) {
    item.current = item.id === id
  }
  navItems.value = navItems.value.map(item => ({ ...item, current: false }))

  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

function handleToggle(direction: 'left' | 'right') {
  if (direction === 'left') {
    router.push('/posts')
  }
  else {
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
      showOnSmallScreen: false,
    },
    {
      id: 2,
      name: 'Polls',
      href: '/polls',
      current: currentPath.value === '/polls',
      showOnSmallScreen: false,
    },
    {
      id: 3,
      name: 'FAQ',
      href: '/about',
      current: currentPath.value === '/about',
      showOnSmallScreen: true,
    },
  ]

  // Multi level nav items
  moderation.value = [
    {
      id: 1,
      name: 'Posts',
      href: '/moderation/posts',
      current: currentPath.value === '/moderation/posts',
    },
    {
      id: 2,
      name: 'Comments',
      href: '/moderation/comments',
      current: currentPath.value === '/moderation/comments',
    },
    {
      id: 3,
      name: 'Polls',
      href: '/moderation/polls',
      current: currentPath.value === '/moderation/polls',
    },
  ]
})
</script>
