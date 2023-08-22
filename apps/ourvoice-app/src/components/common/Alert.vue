<template>
  <div class="rounded-md bg-ourvoice-success-light p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon class="h-10 w-10 text-ourvoice-success/80" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-xl font-medium text-ourvoice-success">{{ props.title }}</h3>
        <div class="mt-2 text-md text-ourvoice-success">
          <p>
            <slot></slot>
          </p>
        </div>
        <div class="mt-10">
          <div class="-my-1.5 flex">
            <CustomButton
              type="button"
              to="/posts"
              class-name="rounded-md hover:bg-ourvoice-success-dark/80 px-2 py-1.5 text-sm font-medium bg-ourvoice-success-dark text-white"
              label="Back to Discussion page"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import CustomButton from '@/components/common/CustomButton.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
