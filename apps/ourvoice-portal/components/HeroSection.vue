<template>
  <div>
    <div
      class="container flex flex-col items-center z-10 mt-14 pt-24 pb-8 lg:py-40 lg:pb-20"
    >
      <h2
        class="text-5xl font-Roboto font-semibold self-center text-center max-w-[680px] leading-tight"
      >
        Safe digital space for workplace-related discussion
      </h2>
      <p class="text-xl font-Roboto font-normal text-center mb-6 max-w-[680px]">
        A safe space for employees and community members to anonymously discuss
        issues and concerns about their work environments.
      </p>
      <div
        class="flex flex-row justify-center gap-x-6 gap-y-2 self-center flex-wrap"
      >
        <button
          type="button"
          class="btn btn-yellow w-[212px]"
          @click="
            () => {
              useRouter().push({ path: '/', hash: '#why' })
            }
          "
        >
          Read More
        </button>
        <button
          type="button"
          class="btn btn-outline w-[212px]"
          @click="
            () => {
              useRouter().push({ path: '/', hash: '#contact' })
            }
          "
        >
          Contact Us
        </button>
      </div>
    </div>
    <div class="flex flex-row justify-between items-end">
      <img
        :src="leftImg"
        class="hidden h-auto md:block md:w-[300px] xl:w-[450px] -z-10"
        alt=""
      />
      <img
        :src="imgs.right"
        class="hidden h-auto md:block relative md:bottom-[-35px] md:w-[300px] xl:bottom-[-70px] xl:w-[450px] -z-10"
        alt=""
      />
      <img
        :src="imgs.small"
        class="md:hidden mx-auto h-auto w-[300px] -z-10"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import leftImgUrl from '@/assets/img/family-left.png'
import rightImgUrl from '@/assets/img/family-right.png'
import smallImgUrl from '@/assets/img/family-small.png'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HeroSection',

  setup() {
    const leftImg = ref(leftImgUrl)
    const imgs = ref({
      left: leftImgUrl,
      right: rightImgUrl,
      small: smallImgUrl,
    })

    return {
      imgs: imgs.value,
      leftImg: leftImg.value,
    }
  },
})
</script>

<style scoped></style>
