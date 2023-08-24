<template>
  <div class="consent-page bg-gray-100 min-h-screen flex justify-center items-center">
    <div class="text-center max-w-4xl">
      <h1 class="text-4xl font-bold m-4">Detailed Consent Agreement</h1>
      <LongConsent class="consent-md" ref="consent" />
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        @click="acceptConsent"
      >
        Accept
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserService from '../services/user-service'
import { useUserStore } from '../stores/user'
import LongConsent from '../../../../config/content/long-consent.md'
import router from '@/router'
const hasConsent = ref(false)
const consentEffectiveDate = ref(new Date())
const userStore = useUserStore()
const consent = ref<any>(null)
const acceptConsent = async () => {
  const response = await UserService.updateUserConsent()
  if (response.status === 200) {
    hasConsent.value = false
    router.replace({ name: 'home' })
  }
}
const checkForConsent = async () => {
  if (!(await userStore.isLoggedIn)) return
  const userConsent = (await userStore.getConsent) as string
  hasConsent.value = !!userConsent && consentEffectiveDate.value <= new Date(userConsent)
  if (hasConsent.value) {
    router.replace({ name: 'home' })
  }
}
onMounted(async () => {
  // get consent effective date
  consentEffectiveDate.value = new Date(consent.value.frontmatter.effective_date) || null
  hasConsent.value = false
  await router.isReady()
  checkForConsent()
})
</script>
