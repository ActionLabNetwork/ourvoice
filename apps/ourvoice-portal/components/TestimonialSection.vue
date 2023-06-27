<template>
  <div class="bg-ourvoice-portal-yellow py-20">
    <div
      class="flex flex-row flex-nowrap bg-red relative w-full items-stretch transition-all duration-200 ease-linear"
      ref="containerRef"
      :style="containerStyle"
    >
      <div
        v-for="(page, index) in testimonials"
        :key="index"
        class="py-4 lg:py-24 shrink-0 w-full"
      >
        <div class="px-5 lg:w-10/12 mx-auto">
          <div>
            <p class="font-bold text-[24px] md:text-[32px] mb-4">
              {{ page.testimonial }}
            </p>
            <p class="font-normal text-[16px] lg:text-[20px]">
              {{ page.party }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mx-auto px-5 lg:w-10/12 flex flex-row gap-2 mt-8 justify-end lg:justify-start"
    >
      <div v-for="(_, index) in testimonials">
        <button
          @click="changeToIndex(index)"
          class="h-2 w-[11px] rounded-full border-black border-2 transition-all duration-50 ease-linear"
          :class="{ 'bg-black w-[36px] disabled': index === activeIndex }"
          :aria-label="`Go to testimonial ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useElementBounding } from '@vueuse/core'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestimonialSection',

  setup() {
    const testimonials = [
      {
        testimonial:
          'OurVoice helped to discuss and realise opportunities in how we promote and reach Aboriginal and Torres Strait Islander staff with the available professional development options, creating an inclusive and enabling environment through lifting the cultural competency of Red Cross people.',
        party: 'Head of People and Culture - Australian Red Cross',
      },
      {
        testimonial:
          "It worked really well and allowed us to identify hidden issues and common concerns safely and in a friendly, straightforward and intuitive way. There wasn't any learning curve for how to use the system.",
        party: 'Head of trade union branch - University and College Union',
      },
    ]

    const activeIndex = ref(0)
    const containerRef = ref(null)
    const containerBBox = useElementBounding(containerRef)

    let timer: NodeJS.Timer
    const resetTimer = () => {
      if (timer) {
        clearInterval(timer)
      }
      timer = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1) % testimonials.length
      }, 10_000)
    }
    onMounted(() => {
      resetTimer()
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    const changeToIndex = (index: number) => {
      resetTimer()
      activeIndex.value = index
    }

    const containerStyle = computed(() => ({
      left: -containerBBox.width.value * activeIndex.value + 'px',
    }))

    return {
      activeIndex,
      testimonials,
      changeToIndex,
      containerRef,
      containerStyle,
    }
  },
})
</script>

<style scoped></style>
