import { useDeploymentStore } from './deployment'
import { useUserStore } from './user'
import { apolloClient } from './../graphql/client/index'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import authService from '@/services/auth-service'
import { GET_MODERATION_COMMENT_BY_ID_QUERY } from '@/graphql/queries/getModerationComment'
import { CREATE_MODERATION_COMMENT_MUTATION } from '@/graphql/mutations/createModerationComment'
import { APPROVE_MODERATION_COMMENT_VERSION_MUTATION } from '@/graphql/mutations/approveModerationCommentVersion'
import { REJECT_MODERATION_COMMENT_VERSION_MUTATION } from '@/graphql/mutations/rejectModerationCommentVersion'
import { MODIFY_MODERATION_COMMENT_MUTATION } from '@/graphql/mutations/modifyModerationComment'
import { RENEW_COMMENT_MODERATION_MUTATION } from '@/graphql/mutations/renewCommentModeration'
import type { PostVersion } from './moderation-posts'

type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ModerationPost {
  id: number
  authorHash: string
  authorNickname: string
  versions: PostVersion[]
  requiredModerations: number
  status: CommentStatus
}
export interface CommentVersion {
  id: number
  content: string
  version: number
  timestamp: string
  status: CommentStatus
  authorHash: string
  authorNickname: string
  reason: string
  latest: boolean
  moderations: Moderation[]
}

export interface ModerationComment {
  id: number
  authorHash: string
  authorNickname: string
  requiredModerations: number
  status: CommentStatus
  post: ModerationPost
  parent: ModerationComment | null
  versions: CommentVersion[]
}

export interface Moderation {
  id: number
  decision: 'ACCEPTED' | 'REJECTED'
  moderatorHash: string
  moderatorNickname: string
  reason: string
  timestamp: string
}

export interface PageInfo {
  endCursor: string
  hasNextPage: boolean
  startCursor: string
}

export interface ModerationCommentsState {
  commentInModeration: ModerationComment | undefined
  versionInModeration: CommentVersion | undefined
  versionInModification: {
    version: Partial<CommentVersion> | undefined
    isValid: boolean
  }
  loading: boolean
  userHasModeratedComment: boolean
}

interface CommentFields {
  content?: string
}

const findSelfModeration = async (version: CommentVersion, userId: string, deployment: string) => {
  const promises = version.moderations.map((moderation) => {
    return authService.verifyHash(userId, deployment, moderation.moderatorHash)
  })
  const moderators = await Promise.all(promises)
  return version.moderations[moderators.indexOf(true)]
}

provideApolloClient(apolloClient)

export const useCommentModerationStore = defineStore('comment-moderation', {
  state: (): ModerationCommentsState => ({
    commentInModeration: undefined,
    versionInModeration: undefined,
    versionInModification: {
      version: undefined,
      isValid: false
    },
    loading: false,
    userHasModeratedComment: false
  }),
  getters: {
    latestCommentVersion: (state) =>
      state.versionInModeration?.id === state.commentInModeration?.versions[0].id,
    selfModerationForVersion: async (state) => {
      if (!state.versionInModeration) return undefined

      return await findSelfModeration(
        state.versionInModeration,
        useUserStore().userId,
        useDeploymentStore().deployment
      )
    }
  },
  actions: {
    resetVersionInModification() {
      this.versionInModification = {
        version: undefined,
        isValid: false
      }
    },
    async fetchCommentById(id: number) {
      try {
        const { data } = await apolloClient.query({
          query: GET_MODERATION_COMMENT_BY_ID_QUERY,
          variables: { moderationCommentId: id },
          fetchPolicy: 'no-cache'
        })

        const comment = data.moderationComment as ModerationComment

        // Set states to be used for moderation
        this.commentInModeration = comment
        this.versionInModeration = comment.versions[0]
      } catch (error) {
        console.error(`Failed to load comment with ID ${id}. Please try again.`, error)
      }
    },
    async createComment({
      content,
      postId,
      parentId
    }: {
      content: string
      postId: number | undefined
      parentId: number | undefined
    }) {
      // Check for valid deployment and user session
      const userStore = useUserStore()

      // Check if we can access the session and generate a user hash for storing in the db
      if (!(await userStore.isLoggedIn)) {
        // TODO: Set up a proper error handling module
        throw new Error('User session is invalid')
      }

      const authorHash = userStore.sessionHash
      const authorNickname = userStore.nickname
      const requiredModerations = 1

      try {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_MODERATION_COMMENT_MUTATION,
          variables: {
            data: {
              content,
              postId: postId,
              parentId: parentId,
              authorHash,
              authorNickname,
              requiredModerations
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    },

    // Moderation actions
    async checkIfUserHasModerated(userId: string) {
      const version = this.versionInModeration

      if (!version) return

      const versionModerators: string[] = Array.from(
        version.moderations.reduce((acc, moderation) => {
          if (moderation) acc.add(moderation.moderatorHash)
          return acc
        }, new Set<string>())
      )

      const promises = versionModerators.map((moderator) =>
        authService.verifyHash(userId, useDeploymentStore().deployment, moderator)
      )

      const hasModeratedList = await Promise.all(promises)
      this.userHasModeratedComment = hasModeratedList.includes(true)
    },

    async approveCommentVersion(
      id: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string
    ): Promise<CommentVersion | null> {
      if (!this.commentInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: APPROVE_MODERATION_COMMENT_VERSION_MUTATION,
          variables: { id, moderatorHash, moderatorNickname, reason },
          fetchPolicy: 'no-cache'
        })

        await this.fetchCommentById(this.commentInModeration.id)
        this.userHasModeratedComment = true

        return data
      } catch (error) {
        console.error(error)
      }
      return null
    },

    async rejectCommentVersion(
      id: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string
    ): Promise<CommentVersion | null> {
      if (!this.commentInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: REJECT_MODERATION_COMMENT_VERSION_MUTATION,
          variables: { id, moderatorHash, moderatorNickname, reason },
          fetchPolicy: 'no-cache'
        })

        await this.fetchCommentById(this.commentInModeration.id)
        this.userHasModeratedComment = true

        return data
      } catch (error) {
        console.error(error)
      }
      return null
    },

    async modifyModerationComment(
      commentId: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string,
      modifiedData: CommentFields
    ) {
      if (!this.commentInModeration) return null

      try {
        const { data } = await apolloClient.mutate({
          mutation: MODIFY_MODERATION_COMMENT_MUTATION,
          variables: { commentId, moderatorHash, moderatorNickname, reason, data: modifiedData }
        })

        await this.fetchCommentById(this.commentInModeration.id)
        return data
      } catch (error) {
        console.error(error)
      }
      return null
    },
    async renewCommentModeration() {
      if (!this.commentInModeration) {
        console.error('No comment in moderation')
        return
      }

      const selfModeration = await this.selfModerationForVersion
      if (!selfModeration) {
        console.error('No self moderation found for comment version')
        return
      }

      try {
        const { data } = await apolloClient.mutate({
          mutation: RENEW_COMMENT_MODERATION_MUTATION,
          variables: {
            commentModerationId: selfModeration.id,
            moderatorHash: useUserStore().sessionHash
          }
        })

        await this.fetchCommentById(this.commentInModeration.id)
        this.userHasModeratedComment = false

        return data
      } catch (error) {
        console.error(error)
      }
    }
  }
})
