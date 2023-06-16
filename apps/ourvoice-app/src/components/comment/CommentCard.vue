<template>
  <!-- {{ comment }} -->
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
        class="bg-white dark:bg-ourvoice-blue rounded-lg border hover:drop-shadow-md transition duration-300 ease-in-out px-6 py-4 leading-relaxed"
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
              @click="voteForComment('UPVOTE')"
              type="button"
              class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
            >
              {{ comment?.votesUp }}
              <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            </button>

            <button
              @click="voteForComment('DOWNVOTE')"
              type="button"
              class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-1 mr-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600"
            >
              {{ comment?.votesDown }}
              <font-awesome-icon icon="fa-solid fa-thumbs-down" />
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
      <CommentTextarea v-if="showReply" @submit="(payload) => createComment(payload)" />
    </div>
  </div>
  <!-- <pre>{{ comment }}</pre> -->
</template>

<script lang="ts" setup>
import { timePassed } from '@/utils'
import { computed, ref } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import CommentTextarea from './CommentTextarea.vue'
import { storeToRefs } from 'pinia'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { useMutation } from '@vue/apollo-composable'
import { useUserStore } from '@/stores/user'
const props = defineProps({
  commentId: {
    type: Number,
    required: true
  }
})
const commentStore = useCommentsStore()
const userStore = useUserStore()
const { data } = storeToRefs(commentStore)
const comment = computed(() => data.value.find((comment) => comment.id === props.commentId))

const showReply = ref(false)

const createComment = (payload: string) => {
  if (!comment.value) return
  commentStore.createComment({
    authorHash: userStore.sessionHash,
    authorNickname: userStore.nickname,
    postId: comment.value.post.id,
    parentId: props.commentId,
    content: payload
  })
  showReply.value = false
}

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

    // await syncVote()
  } catch (error) {
    console.log(error)
  }
}
// const syncVote = async () => {
//   await commentStore.updateComment(props.commentId)
// }
</script>
