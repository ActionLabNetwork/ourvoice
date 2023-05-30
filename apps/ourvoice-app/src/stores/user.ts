import authService from '@/services/auth-service'
import { defineStore } from 'pinia'
import { useDeploymentStore } from '@/stores/deployment'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

export interface UserState {
  userId: string
  sessionHash: string
  nickname: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: '',
    sessionHash: '',
    nickname: ''
  }),
  getters: {
    isLoggedIn: async () => {
      const response = await authService.getSessionInfo()
      return response.status === 200 && response.data.userId
    },
    nicknameInParts: (state) => {
      const [first, middle, last] = state.nickname.split('_')
      return { first, middle, last }
    }
  },
  actions: {
    async verifyUserSession() {
      const deploymentStore = useDeploymentStore()
      const deployment = deploymentStore.deployment

      const userId = (await authService.getSessionInfo()).data.userId
      this.userId = userId

      if (!this.sessionHash) {
        const sessionHash = await authService.hashInput(userId, deployment)
        console.log({ sessionHash })
        this.sessionHash = sessionHash

        const nickname = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          seed: sessionHash
        })
        console.log({ nickname })
        this.nickname = nickname
      }
    }
  }
})
