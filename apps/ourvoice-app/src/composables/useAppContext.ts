import { useDeploymentStore } from '@/stores/deployment'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { readonly, onMounted } from 'vue'

export function useAppContext() {
  const userStore = useUserStore()
  const deploymentStore = useDeploymentStore()

  const { userId, sessionHash, nickname } = storeToRefs(userStore)
  const { deployment } = storeToRefs(deploymentStore)

  onMounted(() => {
    if (!deploymentStore.deployment) {
      userStore.verifyUserSession()
    }
  })

  return {
    userId: readonly(userId),
    sessionHash: readonly(sessionHash),
    nickname: readonly(nickname),
    deploymentName: readonly(deployment)
  }
}
