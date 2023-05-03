<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <TabsWrapper>
      <TabContent title="Create Post">
        <CreatePost />
      </TabContent>
      <TabContent title="Create Comment">
        <CreateComment />
      </TabContent>
    </TabsWrapper>
  </div>
</template>

<script lang="ts">
import CreatePost from '../components/post/CreatePost.vue'
import CreateComment from '../components/comment/CreateComment.vue'
import { defineComponent } from 'vue'
import TabsWrapper from '../components/TabsWrapper.vue'
import TabContent from '../components/TabContent.vue'

export default defineComponent({
  components: {
    CreatePost,
    CreateComment,
    TabsWrapper,
    TabContent
  }
})
</script>
