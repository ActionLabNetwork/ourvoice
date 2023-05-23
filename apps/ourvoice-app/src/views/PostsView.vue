<template>
  <div class="leading-relaxed max-w-3xl border-4 h-screen m-auto w-full overflow-y-scroll relative" ref="el">

    <div class="sticky top-0 z-30 backdrop-blur-md">
      <CategoryFilter :vertical="false" />
    </div>

    <div v-for="item in itemList" :key="item.id" class="break-all">
      <PostCard :post="item" />
    </div>
    <button class="block m-auto" v-if="result?.posts?.pageInfo?.hasNextPage" @click="loadMore">load more</button>
  </div>
  <div v-if="loading" class="fixed top-0 flex justify-center items-center h-full w-full backdrop-blur-xl">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
</template>


<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref, watch } from 'vue';
import CategoryFilter from '@/components/common/CategoryFilter.vue';
import PostCard from '@/components/post/PostCard.vue';
import { useInfiniteScroll } from '@vueuse/core'
import { useCategoriesStore } from '@/stores/categories';
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
const itemList = ref<any[]>([])
const { result, loading, fetchMore, onResult, onError, refetch } = useQuery(GET_POST_QUERY, () => ({
  filter: null as any,
  pagination: {
    cursor: null,
    limit: 10
  }
}), {
  fetchPolicy: 'cache-first'
})

onResult(({ data }) => {
  data?.posts?.edges?.forEach((x: any) => itemList.value?.push(x.node))
})

onError((err) => {
  console.log(err)
})

itemList.value = result.value?.posts?.edges?.map((x: any) => x.node)
const refetchPosts = async () => {
  await refetch({
    filter: {
      categoryIds: categoriesStore.selectedCategories
    },
    pagination: {
      cursor: null,
      limit: 10
    }
  })
  itemList.value = result.value?.posts?.edges?.map((x: any) => x.node)
}


const el = ref<HTMLElement | null>(null)
useInfiniteScroll(
  el,
  () => {
    // load more
    loadMore()
  },
  { distance: 0 }
)

// reset itemList when categories changed and refetch posts
watch(() => categoriesStore.selectedCategories, (newValue, oldValue) => {
  console.log("selected categoryIds changed from", oldValue, "to", newValue)

  console.log('reset itemList')
  itemList.value = []
  refetchPosts()
})

const loadMore = () => {
  if (!result.value?.posts?.pageInfo?.hasNextPage) {
    return
  }
  console.log('load more')
  fetchMore({
    variables: {
      filter: {
        categoryIds: categoriesStore.selectedCategories
      },
      pagination: {
        cursor: result.value?.posts?.pageInfo?.endCursor,
        limit: 10
      }
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult?.posts?.edges
      const pageInfo = fetchMoreResult?.posts?.pageInfo
      const totalCount = fetchMoreResult?.posts?.totalCount
      return newEdges.length
        ? {
          posts: {
            __typename: previousResult.posts.__typename,
            edges: [...newEdges],
            pageInfo,
            totalCount
          }
        }
        : previousResult
    }
  })
}

</script>


