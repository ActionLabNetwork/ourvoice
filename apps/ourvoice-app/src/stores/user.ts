import authService from '@/services/auth-service'
import { defineStore } from 'pinia'

export interface UserState {
  deployment: string
  userId: string
  sessionHash: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    deployment: '',
    userId: '',
    sessionHash: ''
  }),
  getters: {
    isLoggedIn: async () => {
      const response = await authService.getSessionInfo()
      return response.status === 200 && response.data.userId
    }
  },
  actions: {
    async setDeployment(deployment: string) {
      this.deployment = deployment

      const userId = (await authService.getSessionInfo()).data.userId
      this.userId = userId
      this.sessionHash = await authService.hashInput(userId, deployment)
    }
  }
})
