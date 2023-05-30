<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">
        {{ title }} (Logged in as {{ useUserStore().nickname }})
      </h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

defineProps({
  title: { type: String, required: true }
})
</script>
