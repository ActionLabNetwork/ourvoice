import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollHide(hideThreshold: number = 50) {
  const lastScrollPosition: Ref<number> = ref(0)
  const isElementHidden: Ref<boolean> = ref(false)

  const handleScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop
    if (lastScrollPosition.value > hideThreshold && scrollPosition > lastScrollPosition.value) {
      isElementHidden.value = true
    } else {
      isElementHidden.value = false
    }
    // For Mobile or negative scrolling
    lastScrollPosition.value = scrollPosition <= 0 ? 0 : scrollPosition
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isElementHidden
  }
}
