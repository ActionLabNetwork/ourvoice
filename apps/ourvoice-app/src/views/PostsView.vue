<template>
  <div
    class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll"
    ref="postsInfiniteScroll"
  >
    <div class="space-y-4 rounded-lg bg-white p-3 max-w-screen-lg mx-auto">
      <h1 class="my-4 text-3xl font-semibold text-slate-500">
        Posts
        <font-awesome-icon icon="fa-solid fa-bullhorn" class="text-indigo-400" />
      </h1>

      <div
        class="flex bg-slate-100 p-2 rounded-lg drop-shadow-lg"
        v-for="post in postsData.data.value"
        :key="post.id"
      >
        <PostCard :post="post" />
      </div>

      {{ postsData.pageInfo.value }}

      <!-- <button
        class="m-auto block bg-gray-400 text-white p-2 rounded-lg hover:bg-indigo-400"
        v-if="postsData.totalCount.value > postsData.data.value.length"
        @click="loadMore"
      >
        Load More
      </button> -->

      <!-- TODO: change create post ui -->
      <a href="/noauth">
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
import PostCard from '@/components/post/PostCard.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
export default {
  components: {
    PostCard
  },
  setup() {
    const postsStore = usePostsStore()
    postsStore.fetchPosts({ limit: 2 })
    const postsData = storeToRefs(postsStore)
    const postsInfiniteScroll = ref<HTMLElement | null>(null)

    const loadMore = async () => {
      if (postsStore.totalCount > postsStore.data.length) {
        await postsStore.fetchPosts({ limit: postsStore.data.length + 1 }) //load one more than current length
        console.log('load more...')
      } else {
        // no more posts to load
        return
      }
    }

    useInfiniteScroll(
      postsInfiniteScroll,
      async () => {
        await loadMore()
      },
      { distance: 0 } //min distance 0px to bottom of page before loading more
    )
    return {
      postsData,
      loadMore,
      postsInfiniteScroll
    }
  }
}
</script>
