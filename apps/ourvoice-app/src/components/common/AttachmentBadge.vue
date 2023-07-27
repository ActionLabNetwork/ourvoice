<template>
  <div class="flex gap-x-3">
    <div
      v-for="file in filesWithNames"
      :key="file.key"
      @click="modifyMode ? removeFile(file) : downloadFile(file.url)"
      class="inline-flex items-center rounded-md bg-gray-50 hover:bg-gray-100 hover:cursor-pointer px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
      <span class="mr-1">
        <font-awesome-icon :icon="faPaperclip" />
      </span>
      {{ file.name }}
      <span v-if="modifyMode" class="ml-1">
        <font-awesome-icon :icon="faXmark" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue';
import { getFileNameFromKey } from '@/services/s3-service';
import { faPaperclip, faXmark } from '@fortawesome/free-solid-svg-icons';

interface File {
  key: string;
  url: string;
}

const props = defineProps({
  files: {
    type: Array as PropType<File[]>,
    required: true,
  },
  modifyMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['remove-file'])

const filesWithNames = computed(() => props.files.map(({ key, url }) =>
  ({ key, url, name: getFileNameFromKey(key) })))

// Function to download file
const downloadFile = (url: string) => {
  window.open(url, '_blank');
}

// Function to remove file
const removeFile = (file: File & { name: string }) => {
  emit('remove-file', file);
}
</script>
