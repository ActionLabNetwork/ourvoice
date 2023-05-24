<template>
  <div class="flex-shrink-0 mr-0 ">
    <img class="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:cursor-pointer"
      :src="`https://api.multiavatar.com/${post.author.nickname}.png`" :title="post.author.nickname" />
  </div>
  <div class="flex-1 rounded-lg p-2 leading-relaxed">
    <div class="bg-slate-200 dark:bg-ourvoice-blue px-4 py-2 rounded-lg drop-shadow-lg">
      <!-- <strong>{{ post.author.nickname }}</strong> -->

      <h1 class="flex">
        <div class="text-lg md:text-xl font-bold">
          Title: {{ post.title }}
        </div>

        <div class="ml-auto w-fit">
          <span v-for="cat in post.categories" :key="cat.id">
            #{{ cat.name }}
          </span>
        </div>
      </h1>
      <p class="text-sm md:text-md py-2 break-all">
        {{ post.content }}

      </p>

      <div class="flex text-gray-500 dark:text-gray-300">
        <div
          class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer"
          @click="showComment = !showComment">
          <font-awesome-icon icon="fa-solid fa-comment" />
          <span class="hidden sm:inline-block px-1"> Comment </span>
        </div>
        <div
          class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer">
          <font-awesome-icon icon="fa-solid fa-thumbs-up" />
          <span class="hidden sm:inline-block px-1"> Vote up </span>
        </div>
        <div
          class="hover:text-indigo-400 dark:hover:hover:text-indigo-400 my-auto mr-1 bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded-full text-xs md:text-sm hover:cursor-pointer">
          <font-awesome-icon icon="fa-solid fa-thumbs-down" />
          <span class="hidden sm:inline-block px-1"> Vote down </span>
        </div>
        <div class="text-right ml-auto">
          <span class="text-xs md:text-md">{{ timePassed(post.createdAt) }}</span>
        </div>
      </div>
    </div>
    <Modal :isOpen="showComment" @close="showComment = !showComment">
      <template #title>
        <span class="text-2xl">Comments</span>
      </template>
      <template #content>
        <CommentTile :postId="post.id" />
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { timePassed } from '@/utils'
import { ref } from 'vue'
import CommentTile from '../comment/CommentTile.vue'
import Modal from '../common/Modal.vue'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
const showComment = ref(false)


</script>
