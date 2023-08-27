<template>
  <div class="group block flex-shrink-0 mb-3">
    <div class="flex flex-row gap-3 items-center">
      <div>
        <img
          class="inline-block h-9 w-9 rounded-full"
          :src="props.authorAvatar"
          alt="PseudoNickname"
        />
      </div>
      <div class="flex flex-col">
        <p class="text-sm text-left font-medium text-gray-700">
          {{ props.authorName }}
          <span v-if="props.modifierName" class="italic font-light text-orange-700">
            (Modified by {{ props.modifierName }})
          </span>
        </p>
        <p class="text-xs font-medium text-gray-500">
          {{ props.modificationDate }}
        </p>
      </div>
      <div v-show="props.hasModeratorAuthorTag">
        <FromTheModeratorsTag />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FromTheModeratorsTag from './FromTheModeratorsTag.vue'

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
  },
  hasModeratorAuthorTag: {
    type: Boolean,
    default: false
  }
})
</script>
