<template>
  <div>
    {{ itemRef }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NavBarMenuItem',

  props: {
    item: String,
  },

  setup(props) {
    const itemRef = ref(props.item)
    return {
      itemRef,
    }
  },
})
</script>

<style scoped></style>
