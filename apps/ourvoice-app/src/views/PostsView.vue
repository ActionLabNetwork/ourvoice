<template>
  <div
    class="mx-auto w-full min-h-screen bg-gray-200 dark:bg-ourvoice-blue overflow-y-scroll"
    ref="postsInfiniteScroll"
  >
    <div class="p-1 md:p-4 lg:p-6 bg-slate-100 mb-3 dark:bg-slate-700 flex">
      <h1
        class="text-ourvoice-blue dark:text-ourvoice-white text-4xl md:text-5xl lg:text-6xl text-center lg:text-left"
      >
        <span class="text-ourvoice-red">OurVoice</span>
        App
      </h1>
      <button
        @click="toggleDark()"
        class="p-1 ml-auto my-auto w-fit text-yellow-500 dark:text-ourvoice-purple"
      >
        <font-awesome-icon icon="fa-solid fa-moon" size="xl" v-if="isDark" />
        <font-awesome-icon icon="fa-solid fa-sun" size="xl" v-else />
        <span class="hidden md:inline-block ml-1">{{ isDark ? 'Dark' : 'Light' }}</span>
      </button>
    </div>

    <div
      class="space-y-4 rounded-lg bg-white dark:bg-slate-800 p-3 max-w-screen-lg mx-auto dark:text-white text-black"
    >
      <h1 class="my-4 text-3xl font-semibold text-ourvoice-blue dark:text-ourvoice-white">
        Posts
        <font-awesome-icon icon="fa-solid fa-bullhorn" class="text-ourvoice-purple" />
      </h1>

      <div
        class="flex bg-slate-100 dark:bg-slate-700 p-2 rounded-lg drop-shadow-lg"
        v-for="post in postsData.data.value"
        :key="post.id"
      >
        <PostCard :post="post" />
      </div>

      {{ postsData.pageInfo.value }}
    </div>
    <!-- TODO: change create post ui -->
    <a href="http://localhost:3010/noauth">
      <button
        class="bg-indigo-500 hover:bg-indigo-600 text-white drop-shadow-md font-bold p-1 rounded-full h-fit fixed bottom-10 right-10 z-10"
      >
        <div class="flex align-middle">
          <div class="p-2 bg-indigo-400 rounded-full">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" size="xl" />
          </div>
          <div class="py-2 px-1">Create Post</div>
        </div>
      </button>
    </a>
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
import { useInfiniteScroll, useDark, useToggle } from '@vueuse/core'
export default {
  components: {
    PostCard
  },
  setup() {
    const postsStore = usePostsStore()
    postsStore.fetchPosts({ limit: 2 })
    const postsData = storeToRefs(postsStore)
    const postsInfiniteScroll = ref<HTMLElement | null>(null)
    const isDark = useDark()
    const toggleDark = useToggle(isDark)

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
      postsInfiniteScroll,
      isDark,
      toggleDark
    }
  }
}
</script>
<style></style>
