import authService from '@/services/auth-service'
import { defineStore } from 'pinia'
import { useDeploymentStore } from '@/stores/deployment'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import Session from 'supertokens-web-js/recipe/session'
import { getSessionPayload, getUserId } from '../services/session.service'
import Config from '../../../../config/config.yml'
import { apolloClient } from './../graphql/client/index'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { GET_LATEST_COMMENT_QUERY } from '@/graphql/queries/getCommentById'
import { computed, ref } from 'vue'
import { GET_LATEST_POST_QUERY } from '@/graphql/queries/getPostById'

export interface UserState {
  userId: string
  sessionHash: string
  nickname: string
  userRoles: string[]
  userDeployment: string
  consentDate: Date | null
}

provideApolloClient(apolloClient)

export const useUserStore = defineStore('user', () => {
  const userId = ref('')
  const sessionHash = ref('')
  const nickname = ref('')
  const userRoles = ref<string[]>([])
  const userDeployment = ref('')
  const consentDate = ref<Date | null>(null)

  const { result: latestPostResult, refetch: refetchLatestPost } = useQuery(
    GET_LATEST_POST_QUERY,
    {
      authorHash: sessionHash.value,
    },
    { fetchPolicy: 'network-only' },
  )
  const { result: latestCommentResult, refetch: refetchLatestComment } =
    useQuery(
      GET_LATEST_COMMENT_QUERY,
      {
        authorHash: sessionHash.value,
      },
      { fetchPolicy: 'network-only' },
    )

  const isLoggedIn = computed(async () => await Session.doesSessionExist())
  const nicknameInParts = computed(() => {
    const [first, middle, last] = nickname.value.split('_')
    return { first, middle, last }
  })
  const isModerator = computed(() => userRoles.value.includes('moderator'))
  const isAdmin = computed(() => userRoles.value.includes('admin'))
  const isSuperAdmin = computed(() => userRoles.value.includes('super'))
  const getConsent = computed(async () => {
    const payload = await getSessionPayload()
    return payload.consent
  })
  const latestPostId = computed(() => {
    if (!latestPostResult.value) return -1
    return latestPostResult.value.latestModerationPost.id
  })
  const latestCommentId = computed(() => {
    if (!latestCommentResult.value) return -1
    return latestCommentResult.value.latestModerationComment.id
  })

  async function invalidateNickname() {
    const userId = getUserId()
    const sessionHandle = (await getSessionPayload())['sessionHandle']

    let seed = undefined

    if (Config['persistNickNames'] === 'fixed') {
      seed = userId
    } else if (Config['persistNickNames'] === 'action') {
      await refetchLatestPost({ authorHash: sessionHash.value })
      await refetchLatestComment({ authorHash: sessionHash.value })
      seed = JSON.stringify({
        userId,
        sessionHandle,
        latestPostId: latestPostId.value,
        latestCommentId: latestCommentId.value,
      })
    } else if (Config['persistNickNames'] === 'session') {
      seed = userId + sessionHandle
    }

    const _nickname = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      seed,
    })

    nickname.value = _nickname
  }

  async function verifyUserSession() {
    await authService.refreshToken()
    const deploymentStore = useDeploymentStore()
    const deployment = deploymentStore.deployment

    const _userId = await getUserId()
    userId.value = _userId

    const _sessionHash = await authService.hashInput(_userId, deployment)
    sessionHash.value = _sessionHash

    const _payload = await getSessionPayload()
    const _userRoles = _payload['st-role']?.v || []
    const _userDeployment = _payload?.deployment || ''
    userRoles.value = _userRoles
    userDeployment.value = _userDeployment
    consentDate.value = new Date(_payload.consent)

    await invalidateNickname()
  }

  return {
    userId,
    sessionHash,
    nickname,
    userRoles,
    userDeployment,
    consentDate,
    isLoggedIn,
    nicknameInParts,
    isModerator,
    isAdmin,
    isSuperAdmin,
    getConsent,
    verifyUserSession,
    invalidateNickname,
  }
})
