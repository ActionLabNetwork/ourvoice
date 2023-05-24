<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <TabsWrapper>
      <TabContent title="Create Post">
        <CreatePost :deployment="props.deployment" />
      </TabContent>
      <TabContent title="Create Comment">
        <CreateComment />
      </TabContent>
    </TabsWrapper>
    <Suspense><PostModerationList /></Suspense>
  </div>
</template>

<script setup lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import CreateComment from '../components/comment/CreateComment.vue'
import TabsWrapper from '../components/common/TabsWrapper.vue'
import TabContent from '../components/common/TabContent.vue'
import PostModerationList from '../components/post/PostModerationList.vue'

const props = defineProps({
  deployment: String
})
</script>
