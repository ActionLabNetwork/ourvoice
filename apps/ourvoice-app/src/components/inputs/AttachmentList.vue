<template>
  <div id="uploaded-attachments-list">
    <p class="font-semibold text-sm mb-1">Uploaded Attachments:</p>
    <ul class="list-inside list-disc">
      <li v-for="(attachment, index) in attachments" :key="index" class="text-sm">
        {{ attachment.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps({
  attachments: {
    type: FileList,
    default: [],
    required: true,
  },
})
</script>
