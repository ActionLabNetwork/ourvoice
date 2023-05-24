<template>
    <div class="h-full w-full overflow-y-auto break-all overflow-x-hidden pt-12 relative">
        <DynamicScroller :items="postsList" :min-item-size="54" class="h-full">
            <template #before>
                <div class="flex border-b-2 py-2 lg:hidden">
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
            <template v-slot="{ item, index, active }">
                <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[
                    item.content,
                ]" :data-index="index">
                    <div class="flex border-b py-10">
                        <PostCard :post="item" />
                    </div>
                </DynamicScrollerItem>
            </template>
            <template #after>
                <button class="block mx-auto text-ourvoice-gray text-lg my-5" @click="fetchMorePosts">
                    {{ hasNextPage ? 'Load More' : 'You have reached the end' }}
                    <font-awesome-icon v-if="loading" icon="fa-solid fa-spinner" spin />
                </button>
            </template>
        </DynamicScroller>
    </div>
</template>

<script lang="ts" setup>
import PostCard from '@/components/post/PostCard.vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { computed, watch } from 'vue';
import { useCategoriesStore } from '@/stores/categories';

const categoriesStore = useCategoriesStore()
const selectedCategories = computed(() => categoriesStore?.selectedCategories ?? [])
const cursor = computed(() => result.value?.posts?.pageInfo?.endCursor ?? null)
const hasNextPage = computed(() => result.value?.posts?.pageInfo?.hasNextPage ?? false)

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

const { result, onError, refetch, loading, fetchMore } = useQuery(GET_POST_QUERY, {
    filter: null as any,
    pagination: {
        cursor: null as string | null,
        limit: 10
    }
})

onError(error => {
    console.log(error)
})

const refetchPosts = async () => {
    const res = await refetch({
        filter: {
            categoryIds: selectedCategories.value
        },
        pagination: {
            cursor: null,
            limit: 10
        }
    })
    console.log("refetched Posts", res)

}

const fetchMorePosts = async () => {
    if (!hasNextPage.value) return
    const res = await fetchMore({
        variables: {
            pagination: {
                cursor: cursor.value,
                limit: 10
            }
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult?.posts?.edges ?? []
            const pageInfo = fetchMoreResult?.posts?.pageInfo ?? {}
            return newEdges?.length
                ? {
                    posts: {
                        __typename: previousResult.posts.__typename,
                        edges: [...previousResult.posts.edges, ...newEdges],
                        pageInfo,
                        totalCount: fetchMoreResult?.posts?.totalCount ?? 0
                    }
                }
                : previousResult
        }
    })
    console.log("fetched more Posts", res)
}
const postsList = computed(() => result.value?.posts?.edges.map((post: any) => post.node) ?? [])

watch(selectedCategories, (newValue, oldValue) => {
    console.log("selectedCategories changed")
    console.log("old categoryIds", oldValue)
    console.log("new categoryIds", newValue)
    // if(newValue?.length && oldValue?.length) {
    console.log("refetch")
    refetchPosts()
    // }
})

</script>