<template>
  <!-- Consent Modal -->
  <div
    class="fixed inset-0 backdrop-blur-lg overflow-y-auto h-full w-full"
    id="consent-modal"
    v-show="isConsentModalVisible"
  >
    <!-- consent modal content-->
    <div
      class="relative top-60 mx-5 p-5 border w-auto shadow-lg rounded-md bg-white max-w-[800px] mx-auto"
    >
      <div class="mt-3 text-center">
        <h1 class="text-lg leading-6 font-medium text-gray-900">Consent Form</h1>
        <div class="mt-2 px-7 py-3">
          <Consent class="consent-md" ref="consent" />
          <a class="text-ourvoice-info hover:underline" href="/consent"
            >Detailed Consent Agreement</a
          >
        </div>
        <div class="items-center px-4 py-3">
          <button
            class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            @click="acceptConsent"
          >
            I agree
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'

import UserService from '../../services/user-service'
import { useUserStore } from '../../stores/user'

import Consent from '../../../../../config/content/consent.md'
import router from '@/router'

export default defineComponent({
  components: {
    Consent
  },
  data() {
    return {
      isConsentModalVisible: false,
      consentEffectiveDate: new Date()
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    checkForConsent: async function () {
      if (!(await this.userStore.isLoggedIn)) return
      const userConsent = (await this.userStore.getConsent) as string
      this.isConsentModalVisible =
        !userConsent || this.consentEffectiveDate > new Date(userConsent) ? true : false
    },
    acceptConsent: async function () {
      this.isConsentModalVisible = false
      const response = await UserService.updateUserConsent()
      if (response.status === 200) {
        this.isConsentModalVisible = false
        const verify = await UserService.verifyEmail()
        if (verify.status === 200) location.reload()
      }
    }
  },
  async mounted() {
    // get consent effective date
    this.consentEffectiveDate =
      new Date((this.$refs['consent'] as any).frontmatter.effective_date) || null
    await router.isReady()
    if (this.$route.name === 'consent') {
      this.isConsentModalVisible = false
    } else {
      this.checkForConsent()
    }
  }
})
</script>

<style>
#consent-modal {
  z-index: 9999999999;
}
</style>
