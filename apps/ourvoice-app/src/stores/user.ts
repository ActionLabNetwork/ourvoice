import authService from '@/services/auth-service'
import { defineStore } from 'pinia'
import { useDeploymentStore } from '@/stores/deployment'

export interface UserState {
  userId: string
  sessionHash: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
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
    async verifyUserSession() {
      const deploymentStore = useDeploymentStore()
      const deployment = deploymentStore.deployment

      const userId = (await authService.getSessionInfo()).data.userId
      this.userId = userId
      this.sessionHash = await authService.hashInput(userId, deployment)
    }
  }
})
