<template>
  <div
    class="overflow-hidden border-2 mx-auto my-6 px-6 py-4 bg-white rounded-xl break-all max-w-4xl"
  >
    <!-- <h1>id: {{ props.id }}</h1> -->
    <h1 class="text-lg lg:text-2xl font-semibold flex justify-between items-center">
      {{ props.title }}
      <div>
        <span
          v-for="(cat, index) in props.categories"
          :key="index"
          class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
          ># {{ cat?.name }}
        </span>
      </div>
    </h1>
    <h2 class="text-xs lg:text-sm text-gray-500">
      <span>{{ timePassed(props.createdAt) }} </span> by
      <span class="font-semibold">{{ props.author?.nickname }}</span>
    </h2>
    <p class="text-sm my-2">
      <font-awesome-icon icon="fa-solid fa-quote-left" />
      {{ props.content }}
      <font-awesome-icon icon="fa-solid fa-quote-right" />
    </p>
    <div id="fileUrlsWrapper" class="text-right">
      <a
        class="font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline"
        v-for="(url, index) in presignedUrls"
        :key="index"
        :href="url"
        target="_blank"
      >
        file{{ index + 1 }}
      </a>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex">
        <button
          type="button"
          class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
        >
          {{ props.votesUp }}
          <font-awesome-icon icon="fa-solid fa-thumbs-up" />
        </button>

        <button
          type="button"
          class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
        >
          {{ props.votesDown }}
          <font-awesome-icon icon="fa-solid fa-thumbs-down" />
        </button>
      </div>
      <div>
        <slot> </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { timePassed } from '@/utils/index'
import { usePostsStore } from '@/stores/posts'
const postsStore = usePostsStore()
export interface Post {
  id: number
  title: string
  author: {
    id: number
    nickname: string
  }
  content: string
  createdAt: string
  publishedAt: string | null
  moderatedAt: string | null
  votesUp: number
  votesDown: number
  comments: []
  files: []
  categories: { id: number; name: string }[]
}
const props = defineProps<Post>()

const presignedUrls = ref<string[]>([])

const updatePresignedUrls = async () => {
  const res = (await postsStore.getPresignedUrls('test-bucket', props.files, 60000)) as any
  presignedUrls.value = res?.map((r: any) => r.url)
}

watchEffect(() => {
  if (presignedUrls.value.length != props.files.length) updatePresignedUrls()
})
</script>
