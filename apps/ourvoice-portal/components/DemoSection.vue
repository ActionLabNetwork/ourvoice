<template>
  <div>
    <div
      class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28"
    >
      <!-- Content -->
      <div class="flex flex-1 flex-col items-center lg:items-start">
        <h2
          class="text-ourvoice-blue text-3xl md:text-4 lg:text-5xl text-center lg:text-left mb-6"
        >
          Interested in trying it out?
        </h2>
        <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
          Dive in and check <span class="text-ourvoice-purple">Our</span
          ><span class="text-ourvoice-red">Voice</span> public demo version.
        </p>
        <div class="flex justify-center flex-wrap gap-6 mx-auto min-w-full">
          <button
            type="button"
            class="btn btn-purple btn-hover max-w-full w-3/6"
            @click.prevent="toggleModal"
          >
            Try it!
          </button>
        </div>
      </div>
      <!-- Image -->
      <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
        <img
          class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full shadow-md"
          :src="img"
          alt="OurVoice interface"
        />
      </div>
    </div>
    <!-- Rounded Rectangle -->
    <div
      class="hidden md:block overflow-hidden bg-ourvoice-purple rounded-l-full absolute h-80 w-2/4 top-32 right-0 lg:-bottom-28 lg:-right-36"
    ></div>
    <Modal :modal-active="modalActive"></Modal>
  </div>
</template>

<script lang="ts">
import imgUrl from '@/assets/img/try_it.png'
import Modal from '@/components/utils/Modal.vue'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'DemoSection',

  components: {
    Modal,
  },

  setup() {
    const img = ref(imgUrl)
    const modalActive = ref(false)
    const router = useRouter()

    const toggleModal = () => {
      // modalActive.value = !modalActive.value
      router.push({ name: 'demo' })
    }

    return {
      img: img.value,
      modalActive,
      toggleModal,
    }
  },
})
</script>

<style scoped></style>
