<template>
  <div class="w-full h-full">
    <main>
      <div class="px-10 py-10 bg-white">
        <ModerationListHeaderAndToggle />
        <BaseTab
          :tabs="tabs"
          :initialTab="tabs[0]"
          @tab-switched="handleTabSwitched"
          :loading="loading"
        >
          <template #pending>
            <CommentModerationList :comments="allComments" />
          </template>
          <template #approved>
            <CommentModerationList :comments="allComments" />
          </template>
          <template #rejected>
            <CommentModerationList :comments="allComments" />
          </template>
        </BaseTab>
      </div>
      <Pagination @page-change="handlePageChange" :has-next-page="hasNextPage" />
    </main>
  </div>
</template>

<script setup lang="ts">
import CommentModerationList from '@/components/comment/moderation/CommentModerationList.vue'
import { LIST_TABS } from '@/constants/moderation'
import BaseTab from '@/components/common/BaseTab.vue'
import { onMounted, ref } from 'vue'
import { useModerationCommentsStore } from '@/stores/moderation-comments'
import { storeToRefs } from 'pinia'
import ModerationListHeaderAndToggle from '@/components/common/ModerationListHeaderAndToggle.vue'

import type { ModerationListTab, ModerationStatusLabels } from '@/types/moderation'
import type { PostStatus } from '@/stores/moderation-posts'
import Pagination, { type PageChangePayload } from '@/components/common/Pagination.vue'

const tabToStatusMapping: Record<ModerationStatusLabels, PostStatus> = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED'
} as const

const commentsStore = useModerationCommentsStore()
onMounted(async () => {
  await commentsStore.fetchCommentsByStatus('PENDING')
})

const tabs = ref(LIST_TABS)
const currentTab = ref(tabs.value[0].name)
const { comments: allComments, hasNextPage, loading } = storeToRefs(commentsStore)

const handlePageChange = (page: PageChangePayload) => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  if (page.direction === 'Previous') {
    commentsStore.fetchPreviousCommentsByStatus(tabToStatusMapping[currentTab.value])
  }

  if (page.direction === 'Next') {
    commentsStore.fetchNextCommentsByStatus(tabToStatusMapping[currentTab.value])
  }
}

const handleTabSwitched = async (tab: ModerationListTab) => {
  currentTab.value = tab.name
  switch (tab.name) {
    case 'Pending':
      await commentsStore.fetchCommentsByStatus('PENDING')
      tab.count = allComments.value.length
      break
    case 'Approved':
      await commentsStore.fetchCommentsByStatus('APPROVED')
      tab.count = allComments.value.length
      break
    case 'Rejected':
      await commentsStore.fetchCommentsByStatus('REJECTED')
      tab.count = allComments.value.length
      break
  }
}
</script>
