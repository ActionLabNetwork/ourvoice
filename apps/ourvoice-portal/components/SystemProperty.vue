<template>
  <div class="relative mt-20 lg:mt-24">
    <div :class="divClass[0]">
      <!-- Image -->
      <div class="flex flex-1 justify-center z-10 mb-10 lg:mb-0">
        <img
          class="transform transition-all hover:scale-110 w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
          :src="systemProperty.image"
          alt=""
        />
      </div>
      <!-- Content -->
      <div class="flex flex-1 flex-col items-center">
        <h1 class="text-3xl font-bold font-Inter lg:text-start lg:w-8/12">
          {{ systemProperty.title }}
        </h1>
        <p class="my-4 font-Inter lg:text-start sm:w-3/4 lg:w-8/12">
          {{ systemProperty.description }}
        </p>
        <!-- Read more button -->
        <!--        <button type="button" class="btn btn-hover btn-yellow py-4 px-16">-->
        <!--          Read More-->
        <!--        </button>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { SystemPropertyType } from '@/types'
import type { Ref } from 'vue'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemProperty',

  props: {
    id: Number,
    property: {
      type: Object as () => SystemPropertyType,
      required: true,
    },
  },

  setup(props) {
    const property: Ref<SystemPropertyType> = ref(props.property)
    const id: Ref<number | undefined> = ref(props.id)

    const conditionedClass = computed(() => {
      if (id.value) {
        return id.value % 2
          ? [
              'container flex flex-col lg:flex-row items-center justify-center gap-x-24',
              'hidden lg:block overflow-hidden bg-ourvoice-red rounded-r-full absolute h-80 w-2/4 -bottom-24 -left-36',
            ]
          : [
              'container flex flex-col lg:flex-row-reverse items-center justify-center gap-x-24',
              'hidden lg:block overflow-hidden bg-ourvoice-purple rounded-l-full absolute h-80 w-2/4 -bottom-24 -right-36',
            ]
      } else {
        return [
          'container flex flex-col lg:flex-row-reverse items-center justify-center gap-x-24',
          'hidden lg:block overflow-hidden bg-ourvoice-purple rounded-l-full absolute h-80 w-2/4 -bottom-24 -right-36',
        ]
      }
    })
    return {
      systemProperty: property.value,
      idRef: id.value,
      divClass: conditionedClass,
    }
  },
})
</script>

<style scoped></style>
