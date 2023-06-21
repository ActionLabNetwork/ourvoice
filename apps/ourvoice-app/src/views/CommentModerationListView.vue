<template>
  <div class="w-full h-full bg-gray-100">
    <Header title="Moderation Comments List" />
    <main>
      <div class="px-10 py-10 bg-gray-100">
        <BaseTab :tabs="tabs" :initialTab="tabs[0]" @tab-switched="handleTabSwitched">
          <template #pending>
            <CommentModerationList :comments="moderationComments.PENDING" />
          </template>
          <template #accepted>
            <CommentModerationList :comments="moderationComments.APPROVED" />
          </template>
          <template #rejected>
            <CommentModerationList :comments="moderationComments.REJECTED" />
          </template>
        </BaseTab>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import CommentModerationList from '@/components/comment/moderation/CommentModerationList.vue'
import { LIST_TABS } from '@/constants/moderation'
import BaseTab from '@/components/common/BaseTab.vue'
import { getGroupsByProperty } from '@/utils/groupByProperty'
import { computed, onMounted, ref } from 'vue'
import { useModerationCommentsStore } from '@/stores/moderation-comments'

import type { ModerationComment } from '@/stores/moderation-comments'
import type { ModerationVersionStatus } from '@/types/moderation'
// import type { Tab } from '@/types'

const commentsStore = useModerationCommentsStore()
onMounted(async () => {
  await commentsStore.fetchComments()
})

const tabs = ref(LIST_TABS)
const allComments = computed(() => commentsStore.comments)

// Group the comments by their moderation status
const moderationComments = computed(() => {
  const initialGroups: Record<ModerationVersionStatus, ModerationComment[]> = {
    PENDING: [],
    APPROVED: [],
    REJECTED: []
  }

  return allComments.value.reduce(
    (groups, post) => getGroupsByProperty('status', groups, post),
    initialGroups
  )
})

const handleTabSwitched = () => {
  // If we need to know when the tab is switched, we can do it here
}
</script>
