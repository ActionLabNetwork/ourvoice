<template>
  <div class>
    <!-- Navigation -->
    <header>
      <NavigationBar />
    </header>
    <!-- Features -->
    <section id="demo_choice" class="bg-ourvoice-white py-20 mt-20">
      <CardsSection
        :cards="cardsDemo"
        :title="title"
        :sub-title="subTitle"
      ></CardsSection>
    </section>
    <section id="footer" class="bg-ourvoice-purple h-16">
      <FooterSection></FooterSection>
    </section>
  </div>
</template>

<script lang="ts">
import type { Feature } from '@/types'
import type { Ref } from 'vue'
import { CardsSection, FooterSection, NavigationBar } from '@/components'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
    NavigationBar,
    CardsSection,
    FooterSection,
  },

  setup() {
    const cardsDemo: Ref<Feature[]> = ref([
      {
        title: 'Try Admin / Configuration',
        description:
          'Try out our admin and configuration master to see how the system can be adjusted and tailored to your organisation usage context',
        image: ['fas', 'tools'],
      },
      {
        title: 'Try demo system',
        description:
          'Try out the basic version of the system as a moderator and a user',
        image: ['fas', 'sign-in-alt'],
        url: 'https://demo.ourvoice.app',
      },
    ])

    const demoTitle = 'Try it out!'
    const demoSubTitle =
      'See how you can configure and adjust the system for the needs and context of your organisation and get the feel of using the system yourself as a user or a moderator'
    return {
      cardsDemo: cardsDemo.value,
      title: demoTitle,
      subTitle: demoSubTitle,
    }
  },
})
</script>
