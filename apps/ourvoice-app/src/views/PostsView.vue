<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <div class="space-y-4 rounded-lg bg-white p-3 max-w-screen-lg mx-auto">
      <h1 class="my-4 text-3xl font-semibold text-slate-500">
        Posts
        <font-awesome-icon icon="fa-solid fa-bullhorn" class="text-indigo-400" />
      </h1>

      <PostTile :posts="postsData.data" />

      <Pagination :total="postsData.totalCount" :current-page="1" :per-page="3" />

      <!-- TODO: change create post ui -->
      <a href="http://localhost:3010/noauth">
        <button
          class="bg-indigo-500 hover:bg-indigo-600 text-white drop-shadow-md font-bold p-1 rounded-full h-fit fixed top-10 right-10 z-10"
        >
          <div class="flex align-middle">
            <div class="p-2 bg-indigo-400 rounded-full">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" size="xl" />
            </div>
            <div class="py-2 px-1">Create Post</div>
          </div>
        </button>
      </a>
    </div>

    <!-- <pre class="bg-yellow-100 rounded-lg p-5 mt-5"
      >{{ postsData.data }}
    </pre> -->
  </div>
</template>

<script lang="ts">
import { usePostsStore } from '@/stores/posts'
import PostTile from '@/components/post/PostTile.vue'
import Pagination from '@/components/common/Pagination.vue'
// import { ref } from 'vue'

export default {
  components: {
    PostTile,
    Pagination
  },
  setup() {
    const postsStore = usePostsStore()
    postsStore.fetchPosts()
    return {
      postsData: postsStore
    }
  }
}
</script>
