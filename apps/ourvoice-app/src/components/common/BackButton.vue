<template>
  <Button variant="outline" class="gap-2" @click="handleBackBtnClicked">
    <IconArrowLeft /> Go Back
  </Button>
</template>

<script setup lang="ts">
import Button from '../ui/button/Button.vue'
import { useRouter } from 'vue-router'
import IconArrowLeft from '../icons/IconArrowLeft.vue'

const router = useRouter()
const handleBackBtnClicked = () => {
  router.back()
}
</script>
