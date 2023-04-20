<template>
  <div>
    <!-- Navigation -->
    <header>
      <NavigationBar :index="index" />
    </header>
    <!-- Hero -->
    <section id="hero" class="relative">
      <HeroSection />
    </section>
    <!-- Features -->
    <section id="why" class="bg-ourvoice-white py-20 mt-20">
      <CardsSection
        :cards="cardsIndex"
        :title="cardsTitle"
        :sub-title="cardsSubTitle"
      ></CardsSection>
    </section>
    <!-- System Properties -->
    <section id="how" class="py-20 mt-20">
      <PropertiesSection />
    </section>
    <section id="demo" class="bg-ourvoice-white py-20 relative">
      <DemoSection />
    </section>
    <!-- Testimonials -->
    <section id="testimonial" class="py-20 relative">
      <TestimonialSection />
    </section>
    <!-- Contact us -->
    <section id="contact" class="py-20 relative bg-ourvoice-white">
      <ContactSection />
    </section>
    <section id="footer" class="bg-ourvoice-purple h-16">
      <FooterSection />
    </section>
  </div>
</template>

<script lang="ts">
import type { Feature } from '@/types'
import {
  CardsSection,
  ContactSection,
  DemoSection,
  FooterSection,
  HeroSection,
  NavigationBar,
  PropertiesSection,
  TestimonialSection,
} from '@/components'
import { type Ref, defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
    NavigationBar,
    HeroSection,
    CardsSection,
    PropertiesSection,
    DemoSection,
    TestimonialSection,
    ContactSection,
    FooterSection,
  },

  setup() {
    const index = ref(true)
    const cardsIndex: Ref<Feature[]> = ref([
      {
        title: 'Amplify Employee Voice',
        description:
          'Create a trusted workplace environment; support employees & allow to speak up and share their thoughts, ideas, concerns and solutions.',
        image: ['fas', 'microphone'],
      },
      {
        title: 'Engage Employees More',
        description:
          "Engage employees in decision making and evaluation processes to leverage their experiences and 'field' knowledge.",
        image: ['fas', 'users'],
      },
      {
        title: 'Deliver Changes Faster',
        description:
          "Take smart decisions and shape the future of your organisation using staff members' insights and knowledge.",
        image: ['fas', 'rocket'],
      },
      {
        title: 'Support Culture of Collaboration',
        description:
          'Bring people together from all the hierarchy levels providing managers, leaders and employees with the ability to discuss things freely.',
        image: ['fas', 'handshake'],
      },
    ])
    const title = 'Leverage employee ideas, experience & creativity'
    const subTitle =
      'Thrive on staff members engagement and input through constructive discussion and valid feedback.'
    return {
      index: index.value,
      cardsIndex: cardsIndex.value,
      cardsTitle: title,
      cardsSubTitle: subTitle,
    }
  },
})
</script>
