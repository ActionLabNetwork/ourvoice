<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <button @click="handleBackBtnClicked" class="inline-flex items-center gap-2">
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7H2M7 1L1.70711 6.29289C1.31658 6.68342 1.31658 7.31658 1.70711 7.70711L7 13"
          stroke="#111111"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      Back
    </button>
    <Suspense>
      <!-- <TabsWrapper>
        <TabContent title="Create Post"> -->
      <CreatePost />
      <!-- </TabContent>
      </TabsWrapper> -->
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import { useRouter } from 'vue-router'
// import TabsWrapper from '../components/common/TabsWrapper.vue'
// import TabContent from '../components/common/TabContent.vue'
const router = useRouter()
const handleBackBtnClicked = () => {
  router.back()
}
</script>
