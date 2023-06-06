<template>
  <div>
    <div
      class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28"
    >
      <!-- Content -->
      <div class="flex flex-1 flex-col items-center">
        <h2
          class="font-bold text-[32px] lg:text-[48px] text-center mb-2 lg:mb-4"
        >
          Interested in trying it out?
        </h2>
        <p class="text-[16px] lg:text-[20px] text-center mb-6">
          Dive in and check OurVoice public demo version.
        </p>
        <div class="flex justify-center flex-wrap gap-6 mx-auto min-w-full">
          <button
            type="button"
            class="btn-yellow btn-base py-4 px-6 w-[212px] btn-hover"
            @click.prevent="toggleModal"
          >
            <span class="mr-1.5">Try it</span
            ><ClientOnly><font-awesome-icon icon="arrow-right" /></ClientOnly>
          </button>
        </div>
      </div>
    </div>
    <Modal :modal-active="modalActive"></Modal>
  </div>
</template>

<script lang="ts">
import Modal from '@/components/utils/Modal.vue'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'DemoSection',

  components: {
    Modal,
  },

  setup() {
    const modalActive = ref(false)
    const router = useRouter()

    const toggleModal = () => {
      // modalActive.value = !modalActive.value
      router.push({ name: 'demo' })
    }

    return {
      modalActive,
      toggleModal,
    }
  },
})
</script>

<style scoped></style>
