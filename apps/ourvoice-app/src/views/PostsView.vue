<template>
  <div class="mx-auto p-5 w-full min-h-screen bg-gray-200 overflow-y-scroll">
    <div class="antialiased mx-auto max-w-screen-m">
      <h1 class="my-4 text-xl font-semibold text-gray-900">
        <font-awesome-icon icon="fa-solid fa-bullhorn" />
        Posts
      </h1>

      <div class="space-y-4 rounded-lg bg-white p-3">
        <div
          class="flex bg-slate-100 p-2 rounded-lg drop-shadow-lg"
          v-for="post in postsStore.data"
          :key="post.id"
        >
          <div class="flex-shrink-0 mr-0">
            <img
              class="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              :src="`https://api.multiavatar.com/${post.author.nickname}.png`"
              alt=""
            />
          </div>
          <div class="flex-1 rounded-lg px-2 py-1 sm:px-4 sm:py-2 leading-relaxed">
            <strong>{{ post.author.nickname }}</strong>
            <span class="text-xs text-gray-600"> • {{ new Date(post.createdAt) }}</span>
            <p class="text-sm py-3">
              {{ post.content }}
            </p>
            <div class="grid grid-cols-3 divide-x border-y-2 text-gray-500">
              <div class="text-center hover:bg-gray-200">
                <font-awesome-icon icon="fa-solid fa-comment" />

                <span class="hidden md:block"> Comments </span>
              </div>
              <div class="text-center hover:bg-gray-200">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
                <span class="hidden md:block"> Vote up </span>
              </div>
              <div class="text-center hover:bg-gray-200">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
                <span class="hidden md:block"> Vote down </span>
              </div>
            </div>

            <!-- <div class="mt-4 flex items-center">
              <div class="flex -space-x-2 mr-2">
                <img
                  class="rounded-full w-6 h-6 border border-white"
                  :src="`https://api.multiavatar.com/${post.author.nickname}.png`"
                  alt=""
                />
                <img
                  class="rounded-full w-6 h-6 border border-white"
                  :src="`https://api.multiavatar.com/${post.author.nickname}.png`"
                  alt=""
                />
              </div>
              <div class="text-sm text-gray-500 font-semibold hover:text-blue-400">5 Comments</div>
            </div> -->

            <!-- Replies Starts -->
            <div class="p-2 rounded-lg">
              <CommentTile />
            </div>
            <!-- Replies Ends -->
          </div>
        </div>
        <Pagination :total="1" :current-page="1" :per-page="2" />
      </div>
    </div>
    <pre class="bg-yellow-100 rounded-lg p-5 mt-5"
      >{{ postsStore.data }}
    </pre>
  </div>
</template>

<script lang="ts">
import { usePostsStore } from '@/stores/posts'
// import { useCommentsStore } from '@/stores/comments'
import Pagination from '@/components/common/Pagination.vue'
import CommentTile from '@/components/comment/CommentTile.vue'
// import { ref } from 'vue'

export default {
  components: {
    Pagination,
    CommentTile
  },
  setup() {
    const postsStore = usePostsStore()
    postsStore.fetchPosts()
    return {
      postsStore
    }
  }
}
</script>
