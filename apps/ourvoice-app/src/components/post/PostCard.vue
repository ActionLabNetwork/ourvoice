<template>
  <div class="break-all">
    <h1 class="text-lg lg:text-2xl font-semibold flex justify-between items-center">
      {{ post?.title }}
      <div>
        <span
          v-for="(cat, index) in post?.categories"
          :key="index"
          class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
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
        class="font-medium text-sm text-blue-600 hover:underline"
        v-for="url in post?.presignedDownloadUrls.map((url) => url.url)"
        :key="url"
        :href="url"
        target="_blank"
      >
        file
      </a>
    </div>
    <div class="mt-6 flex justify-between items-center">
      <div class="flex gap-2">
        <button
          @click.stop="voteForPost('UPVOTE')"
          type="button"
          class="btn-outlined btn-rounded font-medium text-sm"
        >
          <span class="inline-flex items-center gap-1">
            {{ post?.votesUp }}
            <IconThumb :fill="hasUpvote" :thumbup="true" />
          </span>
        </button>

        <button
          @click.stop="voteForPost('DOWNVOTE')"
          type="button"
          class="btn-outlined btn-rounded font-medium text-sm"
        >
          <span class="inline-flex items-center gap-1">
            {{ post?.votesDown }}
            <IconThumb :fill="hasDownvote" :thumbup="false" />
          </span>
        </button>
      </div>
      <div>
        <slot>
          <!-- default slot -->
          <button @click.stop="handleCommentBtnClicked" class="inline-flex items-center gap-1">
            {{ post?.comments?.length ?? 0 }} <IconMessageCircle />
          </button>
        </slot>
      </div>
    </div>
    <div class="h-px my-5 border border-stone-300 border-opacity-50"></div>
    <CreateComment :postId="post?.id" />
  </div>
</template>
<script lang="ts" setup>
import IconThumb from '@/components/icons/IconThumb.vue'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'
import { timePassed } from '@/utils/index'
import { useMutation } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CreateComment from '../comment/CreateComment.vue'
import IconMessageCircle from '../icons/IconMessageCircle.vue'
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

const userVote = computed(() =>
  post.value?.votes?.find((vote) => vote.authorHash == sessionHash.value)
)
const hasUpvote = computed(() => userVote.value?.voteType === 'UPVOTE' ?? false)
const hasDownvote = computed(() => userVote.value?.voteType === 'DOWNVOTE' ?? false)

const { mutate: createOrDeleteVoteForPost } = useMutation(VOTE_MUTATION)

const voteForPost = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  try {
    const res = await createOrDeleteVoteForPost({
      data: {
        commentId: null,
        postId: props.postId,
        authorHash: userStore.sessionHash,
        authorNickname: userStore.nickname,
        voteType: voteType
      }
    })
    // console.log({ res })
    if (res?.data)
      postsStore.syncVotesForPostById({
        postId: props.postId,
        votesUp: res.data.createVote.post.votesUp,
        votesDown: res.data.createVote.post.votesDown,
        authorHash: userStore.sessionHash,
        voteType: res.data.createVote.voteType
      })
  } catch (error) {
    console.log(error)
  }
}
</script>
