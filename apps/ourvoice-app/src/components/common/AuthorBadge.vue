<template>
  <div class="group block flex-shrink-0 mb-3">
    <div class="flex items-center">
      <div>
        <img class="inline-block h-9 w-9 rounded-full"
        :src="props.authorAvatar" alt="PseudoNickname" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-700">
          {{ props.authorName }}
          <span v-if="props.modifierName" class="italic font-light text-orange-700">
            (Modified by {{ props.modifierName }})
          </span>
        </p>
        <p class="text-xs font-medium text-gray-500">
          {{ props.modificationDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  authorName: {
    type: String,
    required: true
  },
  authorAvatar: {
    type: String,
    required: true
  },
  modificationDate: {
    type: String,
    required: true
  },
  modifierName: {
    type: String,
    default: ''
  }
})
</script>
