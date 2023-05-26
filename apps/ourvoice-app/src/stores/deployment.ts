import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDeploymentStore = defineStore('deployment', () => {
  const deployment = ref<string>('')

  return { deployment }
})
