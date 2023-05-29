<template>
  <div class="py-5">
    <div class="flex m-1 space-x-2">
      <img
        class="rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:cursor-pointer"
        :src="`https://api.multiavatar.com/${post.author.nickname}.png`"
        :title="post.author.nickname"
      />
      <strong class="text-lg">
        {{ post.author.nickname }}
      </strong>
    </div>
    <div class="flex-1 rounded-lg leading-relaxed m-1">
      <div
        class="bg-white dark:text-gray-300 dark:bg-ourvoice-blue px-4 py-2 rounded-lg drop-shadow-md"
      >
        <h1 class="flex">
          <div class="text-xl font-bold">Title: {{ post.title }}</div>

          <div class="ml-auto w-fit space-x-0.5">
            <span
              v-for="cat in post.categories"
              :key="cat.id"
              class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            >
              {{ cat.name }}
            </span>
          </div>
        </h1>
        <p class="text-sm md:text-md py-2 break-all">
          <font-awesome-icon icon="fa-solid fa-quote-left" />
          {{ post.content }}
          <font-awesome-icon icon="fa-solid fa-quote-right" />
        </p>
        <div id="fileUrlsWrapper" class="text-right">
          <a
            class="text-blue-400"
            v-for="(url, index) in presignedUrls"
            :key="index"
            :href="url"
            target="_blank"
          >
            file{{ index + 1 }}
            <font-awesome-icon icon="fa-solid fa-link" />
          </a>
        </div>

        <div class="flex text-gray-500 dark:text-gray-300">
          <div
            class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
            @click="showComment = !showComment"
          >
            <font-awesome-icon icon="fa-solid fa-comment" />
            <span class="hidden sm:inline-block px-1"> Comment </span>({{
              post?.comments?.length ?? 0
            }})
          </div>
          <div
            class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            <span class="hidden sm:inline-block px-1"> Vote up </span>({{ post?.votesUp ?? 0 }})
          </div>
          <div
            class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            <span class="hidden sm:inline-block px-1"> Vote down </span>({{ post?.voteDown ?? 0 }})
          </div>
          <div class="text-right ml-auto">
            <span class="text-xs md:text-md">{{ timePassed(post.createdAt) }}</span>
          </div>
        </div>
      </div>
      <CommentTile
        v-if="showComment"
        :postId="post.id"
        :noOfComments="post?.comments?.length ?? 0"
      />
      <div v-if="showComment" class="flex justify-center mt-5 mx-5 border-b items-center">
        <button @click="showComment = false">
          <font-awesome-icon icon="fa-solid fa-chevron-up" fade /> Fold
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { timePassed } from '@/utils'
import { ref, watchEffect } from 'vue'
import CommentTile from '../comment/CommentTile.vue'
import { usePostsStore } from '@/stores/posts'
const postsStore = usePostsStore()
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
const showComment = ref(false)

const presignedUrls = ref<string[]>([])
watchEffect(async () => {
  const res = (await postsStore.getPresignedUrls(
    'test-bucket',
    props.post.files ?? [],
    60000
  )) as any
  presignedUrls.value = res?.map((r: any) => r.url)
})
</script>
