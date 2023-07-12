<template>
  <div class="w-full h-full bg-gray-100">
    <main>
      <div class="px-10 py-10 bg-gray-100 border">
        <BaseTab :tabs="tabs" :initialTab="tabs[0]" @tab-switched="handleTabSwitched">
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
    </main>
  </div>
</template>

<script setup lang="ts">
import PostModerationList from '@/components/post/moderation/PostModerationList.vue'
import BaseTab from '@/components/common/BaseTab.vue'

import { computed, onMounted, ref } from 'vue'
import { useModerationPostsStore } from '@/stores/moderation-posts'
import { LIST_TABS } from '@/constants/moderation'
import { getGroupsByProperty } from '@/utils/groupByProperty'
import type { ModerationPost } from '@/stores/moderation-posts'
import type {
  ModerationListTab,
  ModerationListTabs,
  ModerationVersionStatus
} from '@/types/moderation'
import { storeToRefs } from 'pinia'

const postsStore = useModerationPostsStore()
onMounted(async () => {
  await postsStore.fetchPostsByStatus('PENDING')
})

const tabs = ref(LIST_TABS)
const { posts: allPosts } = storeToRefs(postsStore)

// Group the posts by their moderation status
// const moderationPosts = computed(() => {
//   const initialGroups: Record<ModerationVersionStatus, ModerationPost[]> = {
//     PENDING: [],
//     APPROVED: [],
//     REJECTED: []
//   }

//   const retVal = allPosts.value.reduce(
//     (groups, post) => getGroupsByProperty('status', groups, post),
//     initialGroups
//   )
//   return retVal
// })

const handleTabSwitched = async (tab: ModerationListTab) => {
  // If we need to know when the tab is switched, we can do it here
  console.log(`switched to tab ${tab.name}`)
  switch (tab.name) {
    case 'Pending':
      await postsStore.fetchPostsByStatus('PENDING')
      break
    case 'Approved':
      await postsStore.fetchPostsByStatus('APPROVED')
      break
    case 'Rejected':
      await postsStore.fetchPostsByStatus('REJECTED')
      break
  }

  console.log(allPosts.value)
}
</script>
