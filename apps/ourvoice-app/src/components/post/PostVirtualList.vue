<template>
    <DynamicScroller v-if="!loading" class="leading-10 h-full lg:pt-10 no-scrollbar" :keyField="'cursor'" @scroll-end="handleScrollEnd"
        :items="result.posts.edges" :min-item-size="70" ref="scroller">
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
            <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item.node.content]" :data-index="index"
                :data-active="active">
                <div class="border-b flex py-4 px-1">
                    <PostCard :post="item.node" />
                </div>
            </DynamicScrollerItem>
        </template>
        <!-- ScrollWrapper End-->

        <template #after>
            <div class="mb-2 text-center" ref="spinner" >
                <font-awesome-icon v-if="loading" icon="fa-solid fa-spinner" size="2xl" spin />
                <button v-if="result.posts.pageInfo.hasNextPage" @click="loadMore" class="text-indigo-400">
                    Load More
                </button>
            </div>
        </template>
    </DynamicScroller>
</template>

<script lang="ts" setup>
import PostCard from './PostCard.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

const categoriesStore = useCategoriesStore()

const GET_POST_QUERY = gql`
query Posts($pagination: PostPaginationInput, $filter: PostsFilterInput) {
  posts(pagination: $pagination, filter: $filter) {
    edges {
      cursor
      node {
        author {
          id
          nickname
        }
        categories {
          name
          id
        }
        createdAt
        disabledAt
        moderatedAt
        moderated
        publishedAt
        published
        title
        votes {
          id
          voteType
        }
        votesDown
        votesUp
        files
        id
        content
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      startCursor
    }
    totalCount
  }
}
  `

const { result, loading, fetchMore, onError } = useQuery(GET_POST_QUERY, () => ({
    filter: {
        categoryIds: categoriesStore.selectedCategories
    },
    pagination: {
        cursor: null,
        limit: 10
    }
}))
onError((error) => {
    console.log(error)
})
const scroller = ref<HTMLElement|null>(null)
const loadMore = () => {
    if (!result.value.posts.pageInfo.hasNextPage) {
        return
    }
    console.log('load more')
    fetchMore({
        variables: {
            filter: {
                categoryIds: categoriesStore.selectedCategories
            },
            pagination: {
                cursor: result.value.posts.pageInfo.endCursor,
                limit: 10
            }
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
                ...previousResult,
                posts: {
                    ...previousResult.posts,
                    edges: [
                        ...previousResult.posts.edges,
                        ...fetchMoreResult.posts.edges,
                    ],
                    pageInfo: {
                        ...previousResult.posts.pageInfo,
                        endCursor: fetchMoreResult.posts.pageInfo.endCursor,
                        hasNextPage: fetchMoreResult.posts.pageInfo.hasNextPage,
                    },
                    totalCount: fetchMoreResult.posts.totalCount,
                },

            }
        }
    })
}
const handleScrollEnd = () => {
    // console.log('scroll end')
    // if (result.value.posts.pageInfo.hasNextPage) {
    //     loadMore()
    // }
}
</script>