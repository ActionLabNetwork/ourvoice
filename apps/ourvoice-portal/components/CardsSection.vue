<template>
  <div ref="containerRef" class="relative top-0">
    <!-- Moving container-->
    <div
      ref="sideescrollRef"
      class="h-screen w-screen flex flex-col justify-center bg-ourvoice-portal-yellow"
      :class="sidescrollStyle"
    >
      <!-- Heading -->
      <div class="container flex flex-col px-2 items-center">
        <h1 class="max-w-[708px] font-Inter">
          {{ cardTitle }}
        </h1>
        <p
          class="text-center font-Inter font-normal text-xl mt-4 max-w-[600px]"
        >
          {{ cardSubTitle }}
        </p>
      </div>
      <!-- Cards -->
      <div :style="cardsStyle">
        <!--- Horizontal Scroller --->
        <div
          class="flex flex-row flex-nowrap w-fit overflow-x-visible gap-4 lg:gap-8 mt-16 px-10 lg:px-36"
          ref="sidescrollRef"
        >
          <ClientOnly>
            <card
              v-for="(feature, idx) in features"
              :id="idx"
              :key="idx"
              :feature="feature"
              :class="feature.url ? 'cursor-pointer' : 'cursor-auto'"
              @click="onClick(feature.url)"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
    <!-- Spacing divs -->
    <div class="h-screen" />
    <div :style="bottomPadderStyle" />
  </div>
</template>

<script lang="ts">
import amplifyImgUrl from '@/assets/img/card-amplify.png'
import deliverImgUrl from '@/assets/img/card-deliver.png'
import engageImgUrl from '@/assets/img/card-engage.png'
import supportImgUrl from '@/assets/img/card-support.png'
import { useElementBounding, useMounted, useWindowSize } from '@vueuse/core'
import { ref } from 'vue'

import Card from './Card.vue'

export default defineComponent({
  name: 'CardsSection',

  components: {
    Card,
  },

  props: {
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
    const cardTitle = ref(props.title)
    const cardSubTitle = ref(props.subTitle)

    const onClick = (url: string | undefined) => {
      if (!url) return
      window.location.href = url
    }

    const features = ref([
      {
        title: 'Amplify Employee Voice',
        description:
          'Create a trusted workplace environment; support employees & allow to speak up and share their thoughts, ideas, concerns and solutions.',
        image: amplifyImgUrl,
      },
      {
        title: 'Engage Employees More',
        description:
          "Engage employees in decision making and evaluation processes to leverage their experiences and 'field' knowledge.",
        image: engageImgUrl,
      },
      {
        title: 'Deliver Changes Faster',
        description:
          "Take smart decisions and shape the future of your organisation using staff members' insights and knowledge.",
        image: deliverImgUrl,
      },
      {
        title: 'Support Culture of Collaboration',
        description:
          'Bring people together from all the hierarchy levels providing managers, leaders and employees with the ability to discuss things freely.',
        image: supportImgUrl,
      },
    ])

    const containerRef = ref(null)
    const containerBBox = useElementBounding(containerRef)
    const sidescrollRef = ref(null)
    const sidescrollBBox = useElementBounding(sidescrollRef)
    const viewportSize = useWindowSize()

    const bottomPadderStyle = computed(() => ({
      height: sidescrollBBox.width.value - viewportSize.width.value + 'px',
    }))
    const containerPosition = computed(() =>
      containerBBox.top.value > 0
        ? 'before'
        : containerBBox.bottom.value >= viewportSize.height.value
        ? 'inside'
        : 'after'
    )
    const isMounted = useMounted()
    const sidescrollStyle = computed(() =>
      !isMounted.value || containerPosition.value == 'before'
        ? 'absolute top-0'
        : containerPosition.value == 'inside'
        ? 'fixed top-0'
        : 'absolute bottom-0'
    )
    const coercePush = (value: number) => {
      let coercedValue = Math.max(0, -containerBBox.top.value)
      coercedValue = Math.min(
        coercedValue,
        sidescrollBBox.width.value - viewportSize.width.value
      )
      return coercedValue
    }
    const cardsStyle = computed(() => ({
      right: coercePush(-containerBBox.top.value) + 'px',
      position: 'relative',
    }))

    return {
      features,
      cardTitle,
      cardSubTitle,
      onClick,
      containerRef,
      sidescrollRef,
      sidescrollStyle,
      bottomPadderStyle,
      cardsStyle,
    }
  },
})
</script>

<style scoped></style>
