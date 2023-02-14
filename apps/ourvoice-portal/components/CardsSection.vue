<template>
  <!-- Heading -->

  <div class="container sm:w-3/4 lg:w-5/12 mx-auto px-2">
    <h1 class="text-3xl text-center text-ourvoice-blue">
      {{ cardTitle }}
    </h1>
    <p class="text-center text-ourvoice-grey mt-4">
      {{ cardSubTitle }}
    </p>
  </div>
  <!-- Cards -->
  <div
    class="container grid grid-cols-1 md:grid-cols-2 gap-24 max-w-screen-lg mt-16"
  >
    <!-- Card 1 -->
    <ClientOnly>
      <card
        v-for="(feature, idx) in features"
        :id="idx"
        :key="idx"
        :feature="feature"
        :class="feature.url ? 'cursor-pointer' : 'cursor-auto'"
        @click="onClick(feature.url)"
      ></card
    ></ClientOnly>
  </div>
</template>

<script lang="ts">
import type { Feature } from '@/types'
import type { Ref } from 'vue'

import Card from './Card.vue'

export default defineComponent({
  name: 'CardsSection',

  components: {
    Card,
  },

  props: {
    cards: {
      type: Array as () => Feature[],
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    subTitle: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const features: Ref<Feature[]> = ref(props.cards)
    const cardTitle = ref(props.title)
    const cardSubTitle = ref(props.subTitle)

    const onClick = (url: string | undefined) => {
      if (!url) return
      window.location.href = url
    }

    return {
      features,
      cardTitle,
      cardSubTitle,
      onClick,
    }
  },
})
</script>

<style scoped></style>
