<template>
  <div v-if="post && version" class="bg-white shadow-lg border border-gray-200 rounded-lg p-6 mb-6 hover:shadow-xl transition-all duration-200">
    <h3 class="text-2xl font-extrabold text-black-700 mb-3">
      {{ version.title }}
    </h3>
    <p class="text-gray-700 text-lg leading-relaxed mb-3">{{ version.content }}</p>
    <div class="flex flex-wrap mb-3">
      <div v-for="{ id, name } in version.categories" :key="id" class="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-2">
        {{ name }}
      </div>
    </div>
    <p class="mt-6 text-gray-500">Posted by <span class="font-semibold">@{{ post.authorHash }}</span></p>
    <p class="mt-2 text-gray-400 text-xs mb-2">
      {{ `${formattedDate(version)}` }}
    </p>
    <p class="text-xs text-gray-600">1/3 Moderations</p>
    <div class="mt-4" v-if="!preview && version.status === 'PENDING'">
      <router-link v-if="post && post.id"
        :to="{ name: 'moderate-post', params: { id: post.id } }"
        class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Moderate
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ModerationPost, PostVersionWithCategories } from '@/stores/moderation-posts';
import type { PropType } from 'vue';
import { formatTimestampToReadableDate } from '@/utils';

const props = defineProps({
  post: {
    type: Object as PropType<ModerationPost>,
    required: true
  },
  version: {
    type: Object as PropType<PostVersionWithCategories>,
    defaultValue: null
  },
  preview: {
    type: Boolean,
    defaultValue: false
  }
});

const formattedDate = (version: PostVersionWithCategories) =>
  formatTimestampToReadableDate(+version.timestamp);

watch(props, newVal => {
  console.log({ newVal })
})
</script>
