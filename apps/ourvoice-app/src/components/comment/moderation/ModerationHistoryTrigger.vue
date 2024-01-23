<template>
  <!-- Side pane button -->
  <Button
    @click="toggleSidePane"
    variant="outline"
    data-cy="moderation-history-button"
    class="gap-2"
  >
    Moderation History
    <span>
      <ArrowRight v-if="!showSidePane" />
      <ArrowLeft v-else />
    </span>
  </Button>
  <SidePane v-if="showSidePane" @side-pane-toggle="handleSidePaneToggle">
    <ModerationHistory />
  </SidePane>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, ArrowLeft } from 'lucide-vue-next'
import SidePane from '@/components/common/SidePane.vue'
import ModerationHistory from './ModerationHistory.vue'
import Button from '@/components/ui/button/Button.vue'

const showSidePane = ref(false)

function toggleSidePane() {
  showSidePane.value = !showSidePane.value
}

function handleSidePaneToggle(open: boolean) {
  showSidePane.value = open
}
</script>
