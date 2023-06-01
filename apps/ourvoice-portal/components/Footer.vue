<template>
  <div class="container px-5 pt-6 flex flex-row items-center justify-between">
    <p class="text-white text-lg font-Inter font-medium">
      Copyright Action Inc 2021
    </p>
    <img :src="logo" class="lg:w-[82px]" />
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
