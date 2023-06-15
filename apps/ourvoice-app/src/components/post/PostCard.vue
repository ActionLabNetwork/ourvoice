<template>
  <div
    class="overflow-hidden border-2 mx-auto my-6 px-6 py-4 bg-white rounded-xl break-all max-w-4xl hover:drop-shadow-lg transition duration-300 ease-in-out"
  >
    <!-- {{ post }} -->
    <!-- <pre>{{ votes }}</pre> -->
    <!-- {{ hasUpvote }} -->
    <!-- {{ hasDownvote }} -->
    <h1 class="text-lg lg:text-2xl font-semibold flex justify-between items-center">
      {{ post?.title }}
      <div>
        <span
          v-for="(cat, index) in post?.categories"
          :key="index"
          class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
          ># {{ cat?.name }}
        </span>
      </div>
    </h1>
    <h2 class="text-xs lg:text-sm text-gray-500">
      <span>{{ timePassed(post?.createdAt ?? '') }} </span> by
      <span class="font-semibold">{{ post?.authorNickname ?? '' }}</span>
    </h2>
    <p class="text-sm my-2">
      <font-awesome-icon icon="fa-solid fa-quote-left" />
      {{ post?.content }}
      <font-awesome-icon icon="fa-solid fa-quote-right" />
    </p>
    <div id="fileUrlsWrapper" class="text-right">
      <a
        class="font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline"
        v-for="url in presignedUrls"
        :key="url"
        :href="url"
        target="_blank"
      >
        file
      </a>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex">
        <button
          @click.stop="voteForPost('UPVOTE')"
          type="button"
          class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
        >
          <!-- {{ votes?.filter((vote) => vote.voteType === 'UPVOTE').length }} -->
          <span :class="{ 'text-ourvoice-purple': hasUpvote }">
            {{ post?.votesUp }} <font-awesome-icon icon="fa-solid fa-thumbs-up"
          /></span>
        </button>

        <button
          @click.stop="voteForPost('DOWNVOTE')"
          type="button"
          class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
        >
          <!-- {{ votes?.filter((vote) => vote.voteType === 'DOWNVOTE').length }} -->
          <span :class="{ 'text-ourvoice-purple': hasDownvote }"
            >{{ post?.votesDown }} <font-awesome-icon icon="fa-solid fa-thumbs-down"
          /></span>
        </button>
      </div>
      <div>
        <slot>
          <RouterLink :to="postPageLink" class="underline"
            >comment({{ post?.comments?.length ?? 0 }})
          </RouterLink>
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { timePassed } from '@/utils/index'
import { usePostsStore } from '@/stores/posts'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { GET_VOTES_QUERY, type Vote } from '@/graphql/queries/getVotes'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { postFilesBucket, postFilesPresignedUrlTTL } from '@/constants/post'
import { useUserStore } from '@/stores/user'

const postsStore = usePostsStore()
const userStore = useUserStore()

const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
})

const post = postsStore.getPostById(props.postId)
const postPageLink = computed(() => `/posts/${props.postId}`)

const getPresignedUrls = (keys: string[]) => {
  return postsStore.getPresignedUrls(postFilesBucket, keys, postFilesPresignedUrlTTL)
}

const presignedUrls = ref<string[]>([])
const res = await getPresignedUrls(post?.files ?? [])
presignedUrls.value = res.map((item: any) => item.url) ?? []
const hasUpvote = computed(() => {
  return votes.value.some(
    (vote) => vote.voteType === 'UPVOTE' && vote.authorHash === userStore.sessionHash
  )
})
const hasDownvote = computed(() => {
  return votes.value.some(
    (vote) => vote.voteType === 'DOWNVOTE' && vote.authorHash === userStore.sessionHash
  )
})
const votes = ref<Vote[]>([])

const { mutate: createVoteForPost } = useMutation(VOTE_MUTATION)
const { onResult, refetch } = useQuery(
  GET_VOTES_QUERY,
  {
    filter: {
      postId: props.postId,
      voteType: null,
      authorHash: null,
      authorNickname: null,
      commentId: null
    }
  },
  {
    fetchPolicy: 'network-only'
  }
)
onResult(({ data, loading }) => {
  if (loading) return
  votes.value = data.votes.filter((vote: any) => !vote.comment)
})

const voteForPost = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  createVoteForPost({
    data: {
      commentId: null,
      postId: props.postId,
      authorHash: userStore.sessionHash,
      authorNickname: userStore.nickname,
      voteType: voteType
    }
  })
    .then(async () => {
      await refetch()
      console.log('refetched votes for post', props.postId)
      postsStore.syncPostVotesById(props.postId)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
