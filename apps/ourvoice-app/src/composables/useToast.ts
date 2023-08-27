import { ref, watchEffect } from 'vue'

export const useToast = (message = '', autoHideMs = 3000) => {
  const showToast = ref(false)
  const toastMessage = ref(message)

  const setToastMessage = (message: string) => {
    toastMessage.value = message
  }

  const show = () => {
    showToast.value = true
  }

  const hide = () => {
    showToast.value = false
  }

  watchEffect(() => {
    if (showToast.value) {
      setTimeout(() => {
        showToast.value = false
      }, autoHideMs)
    }
  })

  return { showToast, toastMessage, setToastMessage, show, hide }
}
