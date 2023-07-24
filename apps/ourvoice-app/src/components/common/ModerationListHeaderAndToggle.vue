<template>
  <div
    class="flex flex-col sm:flex-row gap-y-3 mb-5 items-center justify-between"
    v-if="currentPathIsReady"
  >
    <div>
      <p class="font-semibold text-2xl">Moderation</p>
    </div>
    <div>
      <Toggle
        :items="toggleItems"
        :start-left="currentPath === '/moderation/posts'"
        :class-name="'bg-ourvoice-base-light-200'"
        @on-toggle="handleToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import Toggle from '@/components/common/Toggle.vue'

import PostsModerationIcon from '@/assets/icons/posts-moderation.svg'
import PostsModerationIconDark from '@/assets/icons/posts-moderation-dark.svg'
import CommentsModerationIcon from '@/assets/icons/comments-moderation.svg'
import CommentsModerationIconDark from '@/assets/icons/comments-moderation-dark.svg'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const toggleItems = {
  left: {
    iconLight: PostsModerationIcon,
    iconDark: PostsModerationIconDark,
    label: 'Posts',
    hasUpdates: false
  },
  right: {
    iconLight: CommentsModerationIcon,
    iconDark: CommentsModerationIconDark,
    label: 'Comments',
    hasUpdates: false
  }
}

const route = useRoute()
const currentPath = computed(() => route.fullPath)

const currentPathIsReady = ref(false)
onMounted(() => {
  currentPathIsReady.value = true
})

const handleToggle = (direction: 'left' | 'right') => {
  if (direction === 'left') {
    router.push('/moderation/posts')
  } else {
    router.push('/moderation/comments')
  }
}
</script>
