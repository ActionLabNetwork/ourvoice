<template>
  <div class="tab-content" v-show="title == activeTab">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { inject } from 'vue'
export default {
  props: ['title'],
  setup(props) {
    console.log('props.title:', props.title)

    const activeTab = inject('activeTab')
    return {
      activeTab
    }
  }
}
</script>
