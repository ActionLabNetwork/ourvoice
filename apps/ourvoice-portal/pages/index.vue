<template>
  <div class>
    <!-- Navigation -->
    <header>
      <NavigationBar :index="index" />
    </header>
    <!-- Hero -->
    <section id="hero" class="relative">
      <HeroSection />
    </section>
    <!-- Features -->
    <section id="why">
      <CardsSection
        :title="cardsTitle"
        :sub-title="cardsSubTitle"
      ></CardsSection>
    </section>
    <!-- System Properties -->
    <section id="how" class="py-20 mt-20">
      <PropertiesSection />
    </section>
    <!-- Testimonials -->
    <section id="testimonial" class="bg-ourvoice-portal-yellow py-20 relative">
      <TestimonialSection />
    </section>
    <section id="demo" class="py-20 relative">
      <DemoSection />
    </section>
    <!-- Contact us -->
    <section id="contact" class="relative bg-ourvoice-white">
      <ContactSection />
    </section>
    <section id="footer" class="bg-black">
      <FooterSection />
    </section>
  </div>
</template>

<script lang="ts">
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
import HelloWorld from '@/components/HelloWorld.vue'
import { defineComponent, ref } from 'vue'

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
    HelloWorld,
  },

  setup() {
    const index = ref(true)
    const title = 'Leverage employee ideas, experience & creativity'
    const subTitle =
      'Thrive on staff members engagement and input through constructive discussion and valid feedback.'
    return {
      index: index.value,
      cardsTitle: title,
      cardsSubTitle: subTitle,
    }
  },
})
</script>
