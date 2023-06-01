<template>
  <nav
    class="container-fluid flex flex-row items-center px-16 pt-[45px] pb-[28px] bg-black w-full"
  >
    <img :src="img" class="lg:w-20" />
    <div
      class="hidden sm:flex flex-1 justify-end items-center gap-12 text-ourvoice-blue text-xs"
    >
      <NuxtLink
        v-for="({ name, hash }, idx) in menu"
        v-show="navIndex"
        :key="idx"
        :to="hash"
        class="transform font-Inter cursor-pointer text-ourvoice-portal-navbar-gray hover:text-ourvoice-red hover:scale-125"
      >
        {{ name }}
      </NuxtLink>
      <button
        v-show="navIndex"
        type="button"
        class="bg-ourvoice-portal-yellow text-black rounded-full px-4 py-3 btn-hover"
        @click="handleContactUsClick"
      >
        Contact Us
      </button>
      <button
        v-show="!navIndex"
        type="button"
        class="btn-base text-white text-ourvoice-portal-navbar-gray"
        @click="handleBackClick"
      >
        Back
      </button>
    </div>
    <div class="block sm:hidden justify-self-end ml-auto">
      <Menu>
        <MenuButton>
          <ClientOnly>
            <font-awesome-icon
              class="text-ourvoice-portal-navbar-gray"
              icon="bars"
              size="2x"
            />
          </ClientOnly>
        </MenuButton>
        <MenuItems
          class="absolute text-ourvoice-portal-navbar-gray bg-black px-4 py-4 w-40 right-0 text-base flex flex-col gap-2"
        >
          <NuxtLink
            v-for="({ name, hash }, idx) in menu"
            v-show="navIndex"
            :key="idx"
            :to="hash"
            class="transform cursor-pointer text-lg font-medium text-ourvoice-portal-navbar-gray hover:text-ourvoice-portal-yellow"
          >
            {{ name }}
          </NuxtLink>
          <button
            v-show="!navIndex"
            type="button"
            class="transform cursor-pointer text-lg font-medium text-ourvoice-portal-navbar-gray hover:text-ourvoice-portal-yellow"
            @click="handleBackClick"
          >
            Back
          </button>
        </MenuItems>
      </Menu>
    </div>
  </nav>
</template>

<script lang="ts">
import imgUrl from '@/assets/img/ourvoice-logo.png'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NavigationBar',

  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },

  props: {
    index: { type: Boolean, default: false },
  },

  setup(props) {
    const menuItems = ref([
      { name: 'Why', path: '/', hash: '#why' }, // TODO fix link
      { name: 'How', path: '/', hash: '#how' },
    ])
    const img = ref(imgUrl)
    const router = useRouter()
    const menuActive = ref(false)

    const handleBackClick = () => {
      router.back()
    }

    const handleContactUsClick = () => {
      router.push({ path: '/', hash: '#contact' })
    }

    return {
      menu: menuItems.value,
      img: img.value,
      navIndex: props.index,
      handleBackClick,
      handleContactUsClick,
      menuActive,
    }
  },
})
</script>

<style scoped></style>
