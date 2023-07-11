<template>
  <!-- {{ comment }} -->
  <!-- {{ votes }} -->
  <!-- {{ hasUpvote }} -->
  <!-- {{ hasDownvote }} -->
  <div class="flex">
    <div class="flex-shrink-0 mr-1 md:mr-3">
      <img
        class="rounded-full w-6 h-6 sm:w-8 sm:h-8 hover:cursor-pointer"
        :src="`https://ui-avatars.com/api/?size=48?&name=${comment?.authorNickname}`"
      />
    </div>
    <div class="flex-1">
      <b class="text-sm">
        {{ comment?.authorNickname }} reply to
        <span class="text-blue-500 hover:underline hover:cursor-pointer">
          @{{ comment?.parent?.authorNickname ?? 'original post' }}
        </span>
      </b>
      <span class="text-xs">{{ ' ' + timePassed(comment?.createdAt ?? '') }}</span>
      <div
        @click="commentCardClick(comment?.id)"
        class="bg-white dark:bg-ourvoice-blue rounded-lg border-2 hover:shadow-md transition duration-300 ease-in-out px-6 py-4 leading-relaxed"
      >
        <div class="text-sm md:text-md py-2">
          <p class="break-all">
            <font-awesome-icon icon="fa-solid fa-quote-left" />
            {{ comment?.content }}
            <font-awesome-icon icon="fa-solid fa-quote-right" />
          </p>
        </div>
        <div class="flex justify-between">
          <div class="flex">
            <button
              @click.stop="voteForComment('UPVOTE')"
              type="button"
              class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
            >
              <span :class="{ 'text-ourvoice-purple': hasUpvote }">
                {{ comment?.votesUp }}
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
              </span>
            </button>

            <button
              @click.stop="voteForComment('DOWNVOTE')"
              type="button"
              class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
            >
              <span :class="{ 'text-ourvoice-purple': hasDownvote }">
                {{ comment?.votesDown }}
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
              </span>
            </button>
          </div>
          <div>
            <button
              @click="showReply = !showReply"
              type="button"
              class="hover:underline text-sm lg:text-base"
            >
              reply
            </button>
          </div>
        </div>
      </div>
      <CommentTextarea
        v-if="showReply"
        @submit="(commentContent) => createComment(commentContent)"
      />

      <Toast
        v-if="showToast"
        class="fixed bottom-0 right-0"
        :type="toastType"
        :message="toastMessage"
        @click="showToast = false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { timePassed } from '@/utils'
import { computed, ref, watch } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import CommentTextarea from './CommentTextarea.vue'
import { storeToRefs } from 'pinia'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { GET_VOTES_QUERY, type Vote } from '@/graphql/queries/getVotes'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useUserStore } from '@/stores/user'
import Toast from '@/components/common/Toast.vue'
const props = defineProps({
  commentId: {
    type: Number,
    required: true
  }
})
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('warning')
const votes = ref<Vote[]>([])
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
const { onResult, refetch } = useQuery(
  GET_VOTES_QUERY,
  {
    filter: {
      commentId: props.commentId
    }
  },
  {
    fetchPolicy: 'network-only'
  }
)
onResult(({ data, loading }) => {
  if (loading) return

  votes.value = data.votes.map((vote: Vote) => ({
    id: vote.id,
    authorHash: vote.authorHash,
    authorNickname: vote.authorNickname,
    voteType: vote.voteType,
    post: {
      id: vote.post.id
    },
    comment: {
      id: vote.comment.id
    }
  }))
})

const commentStore = useCommentsStore()
const userStore = useUserStore()
const { data } = storeToRefs(commentStore)
const comment = computed(() => data.value.find((comment) => comment.id === props.commentId))

const showReply = ref(false)

const createComment = async (commentContent: string) => {
  if (!comment.value) return
  const res = await commentStore.createComment({
    authorHash: userStore.sessionHash,
    authorNickname: userStore.nickname,
    postId: comment.value.post.id,
    parentId: props.commentId,
    content: commentContent
  })
  showReply.value = false
  showToast.value = true
  if (res) {
    toastMessage.value = 'Comment created successfully, waiting for moderation'
    toastType.value = 'success'
  } else {
    toastMessage.value = 'Error creating comment'
    toastType.value = 'danger'
  }
}
watch(showToast, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
})
const { mutate: createVoteForComemnt } = useMutation(VOTE_MUTATION)
const voteForComment = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  if (!comment.value) {
    console.log('no comment')
    return
  }
  try {
    await createVoteForComemnt({
      data: {
        commentId: props.commentId,
        postId: comment.value.post.id,
        authorHash: userStore.sessionHash,
        authorNickname: userStore.nickname,
        voteType: voteType
      }
    })
    await refetch()
    await syncVote()
  } catch (error) {
    console.log(error)
  }
}
const syncVote = async () => {
  await commentStore.syncVotesForCommentById(props.commentId)
}

const commentCardClick = (commentId: number | undefined) => {
  // might add certain click logic here
  console.log('commentId:', commentId, 'clicked')
}
</script>
