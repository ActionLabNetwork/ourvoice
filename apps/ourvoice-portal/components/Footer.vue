<template>
  <div
    class="container px-5 pt-4 pb-4 flex flex-row items-center justify-between"
  >
    <p class="text-white text-lg font-Inter font-medium">
      OurVoice is developed and maintained by Action Lab, Monash University
    </p>
    <img :src="logo" class="w-[82px]" alt="" />
  </div>
</template>

<script lang="ts">
import logoUrl from '@/assets/img/ourvoice-logo.png'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterSection',

  setup() {
    const logo = ref(logoUrl)

    return {
      logo: logo.value,
    }
  },
})
</script>

<style scoped></style>
