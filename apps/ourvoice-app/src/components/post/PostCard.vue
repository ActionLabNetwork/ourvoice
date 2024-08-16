<template>
  <div class="break-all">
    <!-- Content warning -->
    <content-warning :has-content-warning="post?.hasContentWarning ?? false" />

    <h1 class="text-lg lg:text-2xl font-semibold flex flex-col md:flex-row justify-between">
      <div class="flex-none">
        {{ post?.title }}
      </div>
      <div class="flex justify-start md:justify-end">
        <span
          v-for="(cat, index) in post?.categories"
          :key="index"
          class="bg-ourvoice-util-yellow text-xs font-medium mr-2 px-2.5 py-0.5 rounded h-fit truncate"
        ># {{ cat?.name }}
        </span>
      </div>
    </h1>
    <h2 class="text-xs lg:text-sm text-ourvoice-gray">
      <span>{{ timePassed(post?.createdAt ?? '') }} </span> by
      <span class="font-semibold">
        {{ post?.authorNickname ?? '' }}
        <from-the-moderators-tag v-if="post?.hasFromTheModeratorsTag" />
      </span>
      <span v-if="post?.moderated" class="text-ourvoice-accent-2"> (moderated by moderator)</span>
    </h2>
    <p class="text-sm my-2">
      <font-awesome-icon :icon="faQuoteLeft" />
      {{ post?.content }}
      <font-awesome-icon :icon="faQuoteRight" />
    </p>
    <!-- NOTICE: Hidden for this deployment start -->
    <div v-show="false" id="fileUrlsWrapper" class="text-right">
      <a
        v-for="url in post?.presignedDownloadUrls.map((url) => url.url)"
        :key="url"
        class="font-medium text-sm text-ourvoice-info hover:underline"
        :href="url"
        target="_blank"
      >
        file
      </a>
    </div>
    <!-- NOTICE: Hidden for this deployment end -->
    <div class="mt-6 flex justify-between items-center">
      <div class="flex gap-2">
        <button
          class="btn-outlined btn-rounded font-medium text-sm"
          type="button"
          @click.stop="voteForPost('UPVOTE')"
        >
          <span class="inline-flex items-center gap-1">
            {{ post?.votesUp }}
            <icon-thumb :fill="hasUpvote" :thumbup="true" />
          </span>
        </button>

        <button
          v-if="Config.allowDownvote"
          class="btn-outlined btn-rounded font-medium text-sm"
          type="button"
          @click.stop="voteForPost('DOWNVOTE')"
        >
          <span class="inline-flex items-center gap-1">
            {{ post?.votesDown }}
            <icon-thumb :fill="hasDownvote" :thumbup="false" />
          </span>
        </button>
      </div>
      <div>
        <slot>
          <!-- default slot -->
          <button class="inline-flex items-center gap-1" @click.stop="handleCommentBtnClicked">
            {{ post?.comments?.length ?? 0 }} <icon-message-circle />
          </button>
        </slot>
      </div>
    </div>
    <div class="h-px my-5 border border-stone-300 border-opacity-50" />
    <create-comment :post-id="post?.id" />
  </div>
</template>

<script lang="ts" setup>
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons'
import { useMutation } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import FromTheModeratorsTag from '@/components/common/FromTheModeratorsTag.vue'
import IconThumb from '@/components/icons/IconThumb.vue'
import { VOTE_MUTATION } from '@/graphql/mutations/createOrDeleteVote'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'
import { timePassed } from '@/utils/index'

import Config from '../../../../../config/config.yml'
import CreateComment from '../comment/CreateComment.vue'
import ContentWarning from '../common/ContentWarning.vue'
import IconMessageCircle from '../icons/IconMessageCircle.vue'

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})
const postsStore = usePostsStore()
const userStore = useUserStore()
const { sessionHash } = storeToRefs(userStore)
const router = useRouter()

const post = computed(() => postsStore.getPostById(props.postId))

function handleCommentBtnClicked() {
  router.push({
    name: 'postpage',
    params: {
      id: props.postId,
    },
  })
}

const userVote = computed(() =>
  post.value?.votes?.find(vote => vote.authorHash === sessionHash.value),
)
const hasUpvote = computed(() => userVote.value?.voteType === 'UPVOTE')
const hasDownvote = computed(() => userVote.value?.voteType === 'DOWNVOTE')

const { mutate: createOrDeleteVoteForPost } = useMutation(VOTE_MUTATION)

async function voteForPost(voteType: 'UPVOTE' | 'DOWNVOTE') {
  try {
    const res = await createOrDeleteVoteForPost({
      data: {
        commentId: null,
        postId: props.postId,
        authorHash: userStore.sessionHash,
        authorNickname: userStore.nickname,
        voteType,
      },
    })
    if (res?.data) {
      postsStore.syncVotesForPostById({
        postId: props.postId,
        votesUp: res.data.createVote.post.votesUp,
        votesDown: res.data.createVote.post.votesDown,
        authorHash: userStore.sessionHash,
        voteType: res.data.createVote.voteType,
      })
    }
  }
  catch (error) {
    console.log(error)
  }
}
</script>
