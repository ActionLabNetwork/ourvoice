<template>
  <div
    class="group flex flex-col rounded-md shadow-md bg-white lg:mb-16 card-hover"
  >
    <div class="p-6 flex flex-col items-center">
      <!-- <img :src="feature.image" alt="function" /> -->
      <span class="text-ourvoice-purple group-hover:text-ourvoice-red">
        <font-awesome-icon :icon="cardFeature.image" size="7x" />
      </span>
      <h3 class="mt-5 mb-2 text-ourvoice-blue text-lg group-hover:text-white">
        {{ cardFeature.title }}
      </h3>
      <p
        class="mb-2 text-ourvoice-grey font-light group-hover:text-white text-justify"
      >
        {{ cardFeature.description }}
      </p>
    </div>
    <!-- <hr class="border-b border-ourvoice-white" />
    <div class="flex p-6">
      <button type="button" class="flex-1 btn btn-purple hover:bg-ourvoice-white hover:text-black">
        Learn More
      </button>
    </div> -->
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
