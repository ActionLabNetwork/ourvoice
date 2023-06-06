<template>
  <div class="relative mt-20 lg:mt-24">
    <div :class="divClass">
      <!-- Image -->
      <div class="flex flex-1 justify-center z-10 mb-10 lg:mb-0">
        <img
          class="transform transition-all hover:scale-110 w-[300px] sm:max-w-3/4 sm:max-h-3/4 md:w-full md:h-full md:max-w-[300px]"
          :src="systemProperty.image"
          alt=""
        />
      </div>
      <!-- Content -->
      <div class="flex flex-1 flex-col items-center">
        <h1
          class="text-[32px] font-bold font-Inter md:text-start md:w-full lg:w-10/12"
        >
          {{ systemProperty.title }}
        </h1>
        <p
          class="text-[18px] lg:text-[16px] text-center md:text-start mx-2 my-4 md:w-full lg:w-10/12"
        >
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
          ? 'container flex flex-col md:flex-row items-center justify-center gap-x-24 md:gap-x-12 lg:gap-x-24'
          : 'container flex flex-col md:flex-row-reverse items-center justify-center gap-x-24 md:gap-x-12 lg:gap-x-24'
      } else {
        return 'container flex flex-col md:flex-row-reverse items-center justify-center gap-x-24'
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
