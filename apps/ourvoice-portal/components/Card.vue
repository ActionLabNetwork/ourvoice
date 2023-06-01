<template>
  <div
    class="rounded-2xl border-black border-2 p-3 bg-white w-[282px] lg:w-[560px] shrink-0"
  >
    <img :src="cardFeature.image" />
    <h3
      class="mt-5 mb-2 text-2xl font-semibold text-ourvoice-blue group-hover:text-white"
    >
      {{ cardFeature.title }}
    </h3>
    <p
      class="mb-2 text-black font-normal text-[17px] group-hover:text-white text-justify"
    >
      {{ cardFeature.description }}
    </p>
  </div>
</template>

<script lang="ts">
import type { Feature } from '@/types'
import type { Ref } from 'vue'

export default defineComponent({
  name: 'Card',

  props: {
    feature: {
      type: Object as () => Feature,
      id: Number,
      required: true,
    },
  },

  setup(props) {
    const feature: Ref<Feature> = ref(props.feature)
    return {
      cardFeature: feature.value,
    }
  },
})
</script>

<style scoped></style>
