import authService from '@/services/auth-service'
import { defineStore } from 'pinia'
import { useDeploymentStore } from '@/stores/deployment'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'
import Session from 'supertokens-web-js/recipe/session'
import { getSessionPayload, getUserId } from '../services/session.service'

export interface UserState {
  userId: string
  sessionHash: string
  nickname: string
  userRoles: string[]
  userDeployment: string
  consentDate: Date | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: '',
    sessionHash: '',
    nickname: '',
    userRoles: [],
    userDeployment: '',
    consentDate: null
  }),
  getters: {
    isLoggedIn: async () => {
      // const response = await authService.getSessionInfo()
      // return response.status === 200 && response.data.userId
      return await Session.doesSessionExist()
    },
    nicknameInParts: (state) => {
      const [first, middle, last] = state.nickname.split('_')
      return { first, middle, last }
    },
    isModerator: (state) => {
      return state.userRoles.includes('moderator')
    },
    isAdmin: (state) => {
      return state.userRoles.includes('admin')
    },
    isSuperAdmin: (state) => {
      return state.userRoles.includes('super')
    }
  },
  actions: {
    async verifyUserSession() {
      // TODO: refreshes token
      await authService.refreshToken()
      const deploymentStore = useDeploymentStore()
      const deployment = deploymentStore.deployment

      const userId = await getUserId()
      this.userId = userId

      const sessionHash = await authService.hashInput(userId, deployment)
      this.sessionHash = sessionHash

      const payload = await getSessionPayload()
      const userRoles = payload['st-role']?.v || []
      const userDeployment = payload?.deployment || ''
      this.userRoles = userRoles
      this.userDeployment = userDeployment
      this.consentDate = new Date(payload.consent)

      const nickname = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        seed: sessionHash
      })
      this.nickname = nickname
    }
  }
})
