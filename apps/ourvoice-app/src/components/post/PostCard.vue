<template>
  <div
    class="overflow-hidden border-2 my-6 p-6 bg-white rounded-xl break-all hover:shadow-lg transition duration-500 ease-in-out"
  >
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
          <span :class="{ 'text-ourvoice-purple': hasUpvote }">
            {{ post?.votesUp }}
            <font-awesome-icon icon="fa-solid fa-thumbs-up" />
          </span>
        </button>

        <button
          @click.stop="voteForPost('DOWNVOTE')"
          type="button"
          class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
        >
          <span :class="{ 'text-ourvoice-purple': hasDownvote }">
            {{ post?.votesDown }}
            <font-awesome-icon icon="fa-solid fa-thumbs-down" />
          </span>
        </button>
      </div>
      <div>
        <slot>
          <!-- default slot -->
          <button
            @click.stop="handleCommentBtnClicked"
            class="underline hover:bg-gray-200 px-1 rounded-md transition duration-300 ease-in-out"
          >
            COMMENTS({{ post?.comments?.length ?? 0 }})
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { postFilesBucket, postFilesPresignedUrlTTL } from '@/constants/post'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'
import { timePassed } from '@/utils/index'
import { useMutation } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const postsStore = usePostsStore()
const userStore = useUserStore()
const { sessionHash } = storeToRefs(userStore)
const router = useRouter()

const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
})

const post = computed(() => postsStore.getPostById(props.postId))

const handleCommentBtnClicked = () => {
  console.log('comment btn clicked')
  router.push({
    name: 'postpage',
    params: {
      id: props.postId
    }
  })
}

const getPresignedUrls = (keys: string[]) => {
  return postsStore.getPresignedUrls(postFilesBucket, keys, postFilesPresignedUrlTTL)
}

const presignedUrls = ref<string[]>([])
const res = await getPresignedUrls(post.value?.files ?? [])
presignedUrls.value = res.map((item: any) => item.url) ?? []

const userVote = computed(() =>
  post.value?.votes?.find((vote) => vote.authorHash == sessionHash.value)
)
const hasUpvote = computed(() => userVote.value?.voteType === 'UPVOTE' ?? false)
const hasDownvote = computed(() => userVote.value?.voteType === 'DOWNVOTE' ?? false)

const { mutate: createVoteForPost } = useMutation(VOTE_MUTATION)

const voteForPost = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  try {
    await createVoteForPost({
      data: {
        commentId: null,
        postId: props.postId,
        authorHash: userStore.sessionHash,
        authorNickname: userStore.nickname,
        voteType: voteType
      }
    })
    postsStore.syncVotesForPostById(props.postId)
  } catch (error) {
    console.log(error)
  }
}
</script>
