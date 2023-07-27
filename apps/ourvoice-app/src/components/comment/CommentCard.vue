<template>
  <div class="flex gap-2">
    <div class="flex-none w-12">
      <span
        class="h-12 w-12 rounded-full inline-flex justify-center items-center uppercase font-semibold text-white text-2xl"
        :class="bgclass"
        >{{ comment?.authorNickname[0] }}</span
      >
    </div>
    <div class="flex-1 leading-relaxed card bg-opacity-10" :class="bgclass">
      <span class="font-semibold">{{ comment?.authorNickname }} reply to</span>
      <span class="text-ourvoice-sky text-sm hover:underline hover:cursor-pointer">
        @{{ comment?.parent?.authorNickname ?? 'original post' }}
      </span>
      <div class="text-xs">{{ ' ' + timePassed(comment?.createdAt ?? '') }}</div>
      <div class="text-sm md:text-md py-2">
        <p class="break-all">
          <font-awesome-icon :icon="faQuoteLeft" />
          {{ comment?.content }}
          <font-awesome-icon :icon="faQuoteRight" />
        </p>
      </div>
      <div class="flex justify-between">
        <div class="flex gap-2">
          <button
            @click.stop="voteForComment('UPVOTE')"
            type="button"
            class="btn-outlined btn-rounded font-medium text-sm"
          >
            <span class="inline-flex items-center gap-2">
              {{ comment?.votesUp }}
              <IconThumb :fill="hasUpvote" :thumbup="true" />
            </span>
          </button>

          <button
            @click.stop="voteForComment('DOWNVOTE')"
            type="button"
            class="btn-outlined btn-rounded font-medium text-sm"
          >
            <span class="inline-flex items-center gap-1">
              {{ comment?.votesDown }}
              <IconThumb :fill="hasDownvote" :thumbup="false" />
            </span>
          </button>
        </div>
        <div>
          <button
            @click="showReply = !showReply"
            type="button"
            class="hover:underline text-sm lg:text-base"
          >
            Reply
          </button>
        </div>
      </div>
      <CreateComment v-if="showReply" :commentId="comment?.id" :postId="comment?.post?.id" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { timePassed } from '@/utils'
import { computed, ref } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import CreateComment from '@/components/comment/CreateComment.vue'
import IconThumb from '@/components/icons/IconThumb.vue'
import { storeToRefs } from 'pinia'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { useMutation } from '@vue/apollo-composable'
import { useUserStore } from '@/stores/user'
import { indexToColor } from '@/utils'
const userStore = useUserStore()
const { sessionHash } = storeToRefs(userStore)
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons'
const props = defineProps({
  commentId: {
    type: Number,
    required: true
  },
  indexInList: {
    type: Number,
    required: true
  }
})

const bgclass = computed(() => {
  return indexToColor(props.indexInList ?? 0)
})

const commentStore = useCommentsStore()

const comment = computed(() => commentStore.getCommentById(props.commentId))

const userVote = computed(() =>
  comment.value?.votes?.find((vote) => vote.authorHash == sessionHash.value)
)
const hasUpvote = computed(() => userVote.value?.voteType === 'UPVOTE' ?? false)
const hasDownvote = computed(() => userVote.value?.voteType === 'DOWNVOTE' ?? false)

const showReply = ref(false)

const { mutate: createVoteForComemnt } = useMutation(VOTE_MUTATION)
const voteForComment = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
  try {
    const res = await createVoteForComemnt({
      data: {
        commentId: props.commentId,
        postId: comment.value?.post?.id,
        authorHash: userStore.sessionHash,
        authorNickname: userStore.nickname,
        voteType: voteType
      }
    })
    // console.log(res?.data.createVote)
    if (res?.data)
      commentStore.syncVotesForCommentById({
        commentId: props.commentId,
        votesUp: res.data.createVote.comment.votesUp,
        votesDown: res.data.createVote.comment.votesDown,
        authorHash: userStore.sessionHash,
        voteType: res.data.createVote.voteType
      })
  } catch (error) {
    console.log(error)
  }
}
</script>
