<template>
  <div class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
    <div class="flex fill flex-1 flex-col items-center lg:items-start">
      <h1
        class="text-ourvoice-secondary-1 text-5xl md:text-6 lg:text-6xl text-center lg:text-left mb-6"
      >
        <span class="text-ourvoice-primary-2">OurVoice</span> {{ deployment.toUpperCase() }} App
      </h1>
      <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
        You are not registered to engage with this deployment of OurVoice. If you think this is
        incorrect please contact us at
        <strong
          ><a :href="`mailto:${adminEmail}`">{{ adminEmail }}</a></strong
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import config from '@/config'

const adminEmail = config.adminEmail

export default defineComponent({
  props: ['deployment'],
  data() {
    return {
      adminEmail
    }
  }
})
</script>

<style scoped>
.fill {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
</style>
