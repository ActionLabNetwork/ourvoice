<template>
  <nav class="container flex items-center py-4 mt-4 sm:mt-12">
    <div class="py-1">
      <img :src="img" max-height="30" max-width="150" />
    </div>
    <div
      class="hidden sm:flex flex-1 justify-end items-center gap-12 text-ourvoice-blue uppercase text-xs"
    >
      <NuxtLink
        v-for="({ name, hash }, idx) in menu"
        v-show="navIndex"
        :key="idx"
        :to="hash"
        class="transform cursor-pointer hover:text-ourvoice-red hover:scale-125"
      >
        {{ name }}
      </NuxtLink>
      <button
        v-show="navIndex"
        type="button"
        class="bg-ourvoice-red text-white rounded-md px-7 py-3 uppercase btn-hover"
        @click="handleContactUsClick"
      >
        Contact Us
      </button>
      <button
        v-show="!navIndex"
        type="button"
        class="bg-ourvoice-purple text-white rounded-md px-7 py-3 uppercase btn-hover"
        @click="handleBackClick"
      >
        Back
      </button>
    </div>
    <ClientOnly
      ><div class="flex sm:hidden flex-1 justify-end">
        <span class="text-ourvoice-blue">
          <font-awesome-icon icon="bars" size="2x" />
        </span></div
    ></ClientOnly>
  </nav>
</template>

<script lang="ts">
import imgUrl from '@/assets/img/ourvoice_logo.svg'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NavigationBar',

  components: {},

  props: {
    index: { type: Boolean, default: false },
  },

  setup(props) {
    const menuItems = ref([
      { name: 'Why', path: '/', hash: '#why' },
      { name: 'How', path: '/', hash: '#how' },
    ])
    const img = ref(imgUrl)
    const router = useRouter()

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
    }
  },
})
</script>

<style scoped></style>
