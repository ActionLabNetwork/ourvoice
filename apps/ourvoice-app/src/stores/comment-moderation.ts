import type { GetModerationCommentByIdQuery } from './../graphql/generated/graphql'
import { useDeploymentStore } from './deployment'
import { useUserStore } from './user'
import { apolloClient } from './../graphql/client/index'
import { defineStore } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import authService from '@/services/auth-service'
import { GET_MODERATION_COMMENT_BY_ID_QUERY } from '@/graphql/queries/getModerationComment'
import { APPROVE_MODERATION_COMMENT_VERSION_MUTATION } from '@/graphql/mutations/approveModerationCommentVersion'
import { REJECT_MODERATION_COMMENT_VERSION_MUTATION } from '@/graphql/mutations/rejectModerationCommentVersion'
import { MODIFY_MODERATION_COMMENT_MUTATION } from '@/graphql/mutations/modifyModerationComment'
import { RENEW_COMMENT_MODERATION_MUTATION } from '@/graphql/mutations/renewCommentModeration'
import { GET_MODERATION_COMMENT_HISTORY_BY_ID_QUERY } from '@/graphql/queries/getModerationCommentHistory'

type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

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

export type ModerationComment = GetModerationCommentByIdQuery['moderationComment']
export type ModerationCommentVersion = NonNullable<ModerationComment>['versions'][0]
export type ModerationCommentParent = NonNullable<ModerationComment>['parent']
export type ModerationCommentParentVersion = NonNullable<ModerationCommentParent>['versions'][0]

export interface ModerationCommentsState {
  commentInModeration: ModerationComment | undefined
  versionInModeration: ModerationCommentVersion | undefined
  versionInModification: {
    version: Partial<ModerationCommentVersion> | undefined
    isValid: boolean
  }
  history: ModerationComment[] | undefined
  loading: boolean
  userHasModeratedComment: boolean
  hasErrors: boolean
}

interface CommentFields {
  content?: string
}

const findSelfModeration = async (
  version: ModerationCommentVersion,
  userId: string,
  deployment: string
) => {
  if (!version.moderations) return undefined
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
    history: undefined,
    loading: false,
    userHasModeratedComment: false,
    hasErrors: false
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
      this.loading = true
      this.hasErrors = false

      try {
        const { data } = await apolloClient.query({
          query: GET_MODERATION_COMMENT_BY_ID_QUERY,
          variables: { moderationCommentId: id },
          fetchPolicy: 'no-cache'
        })

        const comment = data.moderationComment!

        // Set states to be used for moderation
        this.commentInModeration = comment
        this.versionInModeration = comment.versions[0]
      } catch (error) {
        console.error(`Failed to load comment with ID ${id}. Please try again.`, error)
        this.hasErrors = true
      }
      this.loading = false
    },

    async fetchCommentHistoryById(id: number) {
      this.loading = true
      this.hasErrors = false

      try {
        const { data } = await apolloClient.query({
          query: GET_MODERATION_COMMENT_HISTORY_BY_ID_QUERY,
          variables: { moderationCommentHistoryId: id },
          fetchPolicy: 'no-cache'
        })

        const history = data.moderationCommentsHistory!

        // Set states to be used for moderation
        this.history = history
      } catch (error) {
        console.error(`Failed to load comment history with ID ${id}. Please try again.`, error)
        this.hasErrors = true
      }
      this.loading = false
    },

    // Moderation actions
    async checkIfUserHasModerated(userId: string) {
      const version = this.versionInModeration
      if (!version || version.moderations === null) return

      this.loading = true

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

      this.loading = false
    },

    async approveCommentVersion(
      id: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string
    ): Promise<CommentVersion | null> {
      if (!this.commentInModeration) return null

      this.loading = true
      this.hasErrors = false

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
        this.hasErrors = true
      }
      this.loading = false
      return null
    },

    async rejectCommentVersion(
      id: number,
      moderatorHash: string,
      moderatorNickname: string,
      reason: string
    ): Promise<CommentVersion | null> {
      if (!this.commentInModeration) return null

      this.loading = true
      this.hasErrors = false

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
        this.hasErrors = true
      }
      this.loading = false
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

      this.loading = true
      this.hasErrors = false

      try {
        const { data } = await apolloClient.mutate({
          mutation: MODIFY_MODERATION_COMMENT_MUTATION,
          variables: { commentId, moderatorHash, moderatorNickname, reason, data: modifiedData }
        })

        await this.fetchCommentById(this.commentInModeration.id)
        return data
      } catch (error) {
        console.error(error)
        this.hasErrors = true
      }
      this.loading = false
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

      this.loading = true
      this.hasErrors = false

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
        this.hasErrors = true
      }
      this.loading = false
    }
  }
})
