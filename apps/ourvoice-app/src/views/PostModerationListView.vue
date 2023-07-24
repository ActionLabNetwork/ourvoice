<template>
  <div class="w-full h-full bg-white">
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
            <PostModerationList :posts="allPosts" />
          </template>
          <template #approved>
            <PostModerationList :posts="allPosts" />
          </template>
          <template #rejected>
            <PostModerationList :posts="allPosts" />
          </template>
        </BaseTab>
      </div>
      <Pagination @page-change="handlePageChanged" :has-next-page="hasNextPage" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PostModerationList from '@/components/post/moderation/PostModerationList.vue'
import BaseTab from '@/components/common/BaseTab.vue'
import Pagination, { type PageChangePayload } from '@/components/common/Pagination.vue'
import { useModerationPostsStore, type PostStatus } from '@/stores/moderation-posts'
import { LIST_TABS } from '@/constants/moderation'
import { storeToRefs } from 'pinia'
import ModerationListHeaderAndToggle from '@/components/common/ModerationListHeaderAndToggle.vue'

import type { ModerationListTab, ModerationStatus } from '@/types/moderation'
import router from '@/router'
import { ModerationPostStatus } from '@/graphql/generated/graphql'

const tabToStatusMapping: Record<ModerationStatus, ModerationPostStatus> = {
  Pending: ModerationPostStatus.Pending,
  Approved: ModerationPostStatus.Approved,
  Rejected: ModerationPostStatus.Rejected
} as const

const postsStore = useModerationPostsStore()
const tabs = ref(LIST_TABS)
const currentTab = ref(tabs.value[0].name)
const { posts: allPosts, hasNextPage, loading } = storeToRefs(postsStore)

onMounted(async () => {
  await router.isReady()
  await postsStore.fetchPostsByStatus(ModerationPostStatus.Pending)
  tabs.value[0].count = allPosts.value.length
})

const handlePageChanged = (page: PageChangePayload) => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  if (page.direction === 'Previous') {
    postsStore.fetchPreviousPostsByStatus(tabToStatusMapping[currentTab.value])
  }

  if (page.direction === 'Next') {
    postsStore.fetchNextPostsByStatus(tabToStatusMapping[currentTab.value])
  }
}

const handleTabSwitched = async (tab: ModerationListTab) => {
  currentTab.value = tab.name

  switch (tab.name) {
    case 'Pending':
      await postsStore.fetchPostsByStatus(ModerationPostStatus.Pending)
      tab.count = allPosts.value.length
      break
    case 'Approved':
      await postsStore.fetchPostsByStatus(ModerationPostStatus.Approved)
      tab.count = allPosts.value.length
      break
    case 'Rejected':
      await postsStore.fetchPostsByStatus(ModerationPostStatus.Rejected)
      tab.count = allPosts.value.length
      break
  }
}
</script>
