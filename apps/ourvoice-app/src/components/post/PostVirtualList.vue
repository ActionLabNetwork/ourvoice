<template>
    <DynamicScroller class="leading-10 h-full lg:pt-10" :items="postsStore.data" :min-item-size="70">
        <template #before>
            <div class="flex border-b-2 py-2">
                <h1 class="my-4 text-3xl font-semibold text-ourvoice-blue dark:text-ourvoice-white">
                    Posts
                    <font-awesome-icon icon="fa-solid fa-bullhorn" class="text-ourvoice-purple" />
                </h1>
                <div class="ml-auto mt-auto mr-2 text-ourvoice-grey">
                    <font-awesome-icon icon="fa-solid fa-arrow-up-wide-short" size="lg"
                        class="p-1 hover:text-ourvoice-purple hover:cursor-pointer" />
                    <font-awesome-icon icon="fa-solid fa-filter" size="lg"
                        class="p-1 hover:text-ourvoice-purple hover:cursor-pointer" />
                </div>
            </div>
        </template>

        <!-- ScrollWrapper Start-->
        <template v-slot="{ item, index, active }">
            <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item.content]" :data-index="index"
                :data-active="active">
                <div class="border-b flex py-4 px-1">
                    <PostCard :post="item" />
                </div>
            </DynamicScrollerItem>
        </template>
        <!-- ScrollWrapper End-->

        <template #after>
            <div class="mb-2 text-center" ref="spinner">
                <!-- <font-awesome-icon icon="fa-solid fa-spinner" size="2xl" spin /> -->
                <button v-if="showLoadMore" @click="loadMore" class="text-indigo-400">
                    Load More
                </button>
            </div>
        </template>

    </DynamicScroller>
</template>

<script lang="ts" setup>
import PostCard from './PostCard.vue'
import { usePostsStore } from '@/stores/posts'
// import { storeToRefs } from 'pinia'
import { useInfiniteScroll } from '@vueuse/core'
import { ref, } from 'vue'

const el = ref<HTMLElement | null>(null)
const postsStore = usePostsStore()
postsStore.fetchPosts({ limit: 10 })

const showLoadMore = ref(true)
const loadMore = () => {
    if (postsStore.totalCount === postsStore.data.length) {
        showLoadMore.value = false
        return
    }
    postsStore.fetchPosts({ limit: postsStore.data.length + 10 })
}
useInfiniteScroll(
    el,
    () => {
        // load more
        console.log('load more')
    },
    { distance: 10 }
)
</script>