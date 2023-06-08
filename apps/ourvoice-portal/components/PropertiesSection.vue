<template>
  <div class="sm:px-8 md:px-16 lg:px-32">
    <!-- Heading -->
    <div class="sm:w-3/4 md:w-8/12 lg:w-7/12 mx-auto px-2">
      <h1 class="mb-2">Making everyone feel heard</h1>
      <p class="text-center text-xl font-normal">
        Our aim is to make it easy and fear free to share opinions, start
        discussions around important but sometimes sensitive topics.
      </p>
    </div>
    <!-- Props -->
    <system-property
      v-for="(property, idx) in properties"
      :id="idx"
      :key="idx"
      :property="property"
    ></system-property>
  </div>
</template>

<script lang="ts">
import type { SystemPropertyType } from '@/types'
import type { Ref } from 'vue'
import imgUrl1 from '@/assets/img/anonymity.png'
import imgUrl3 from '@/assets/img/moderation.png'
import imgUrl2 from '@/assets/img/slow_convo.png'
import imgUrl4 from '@/assets/img/validation.png'
import { defineComponent, ref } from 'vue'

import SystemProperty from './SystemProperty.vue'

export default defineComponent({
  name: 'PropertiesSection',

  components: {
    SystemProperty,
  },

  setup() {
    const img1 = ref(imgUrl1)
    const img2 = ref(imgUrl2)
    const img3 = ref(imgUrl3)
    const img4 = ref(imgUrl4)

    const systemProperties: Ref<SystemPropertyType[]> = ref([
      {
        title: 'Anonymity',
        description:
          'Anonymity effectively eliminates any hierarchical structure within the users and facilitates equal contribution whilst protecting participating staff members from potential threat of reprisal.',
        image: img1.value,
      },
      {
        title: 'Slow and Constructive Conversation',
        description:
          'Deliberate slowness of communication helps inhibit ‘flaming’ discussion while preserving a pace of conversation, allowing users to contribute in a meaningful and constructive way.',
        image: img2.value,
      },
      {
        title: 'Proactive Moderation',
        description:
          'Proactive Moderation facilitates Civility and Safety of discussion in the context of anonymity, by which the contributions of users to discussion naturally grow into constructive dialogue.',
        image: img3.value,
      },
      {
        title: 'Validity',
        description:
          'Validity of the discussion supported by features of Anonymity, Slow and Constructive Conversation and Proactive Moderation create additional value of the employee voice and its outcomes.',
        image: img4.value,
      },
    ])
    return {
      properties: systemProperties.value,
    }
  },
})
</script>

<style scoped></style>
