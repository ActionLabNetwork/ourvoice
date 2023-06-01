<template>
  <div>
    <!-- Heading -->
    <div class="container flex flex-col px-2 items-center">
      <h1 class="max-w-[708px] font-Inter">
        {{ cardTitle }}
      </h1>
      <p class="text-center font-Inter font-normal text-xl mt-4 max-w-[600px]">
        {{ cardSubTitle }}
      </p>
    </div>
    <!-- Cards -->
    <div
      class="container flex flex-row flex-nowrap overflow-x-auto gap-4 lg:gap-8 mt-16"
      ref="sectionRef"
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
</template>

<script lang="ts">
import amplifyImgUrl from '@/assets/img/card-amplify.png'
import deliverImgUrl from '@/assets/img/card-deliver.png'
import engageImgUrl from '@/assets/img/card-engage.png'
import supportImgUrl from '@/assets/img/card-support.png'
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
