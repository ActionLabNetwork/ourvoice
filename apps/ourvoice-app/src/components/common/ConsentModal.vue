<template>
  <!-- Consent Modal -->
  <div
    v-show="isConsentModalVisible"
    id="consent-modal"
    class="fixed inset-0 backdrop-blur-lg overflow-y-auto h-full w-full"
  >
    <!-- consent modal content -->
    <div
      class="relative top-60 mx-5 p-5 border w-auto shadow-lg rounded-md bg-white max-w-[800px] mx-auto"
    >
      <div class="mt-3 text-center">
        <h1 class="text-lg leading-6 font-medium text-gray-900">
          Consent Form
        </h1>
        <div class="mt-2 px-7 py-3">
          <consent ref="consent" class="consent-md" />
          <a class="text-ourvoice-info hover:underline" href="/consent">Detailed Consent Agreement</a>
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
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Consent from '../../../../../config/content/consent.md'
import UserService from '../../services/user-service'
import { useUserStore } from '../../stores/user'

export default defineComponent({
  components: {
    Consent,
  },
  data() {
    return {
      isConsentModalVisible: false,
      consentEffectiveDate: new Date(),
      router: useRouter(),
      route: useRoute(),
    }
  },
  computed: {
    ...mapStores(useUserStore),
  },
  async mounted() {
    // get consent effective date
    try {
      const effectiveDate = (this.$refs.consent as any)?.frontmatter?.effective_date
      this.consentEffectiveDate = effectiveDate ? new Date(effectiveDate) : new Date()
    }
    catch (error) {
      console.error('Error parsing consent effective date:', error)
      this.consentEffectiveDate = new Date()
    }
    await this.router.isReady()
    if (this.route.name === 'consent') {
      this.isConsentModalVisible = false
    }
    else {
      await this.checkForConsent()
    }
  },
  methods: {
    async checkForConsent() {
      if (!(await this.userStore.isLoggedIn))
        return
      const userConsent = (await this.userStore.getConsent) as string
      console.log({ userConsent })
      this.isConsentModalVisible
        = !!(!userConsent || this.consentEffectiveDate > new Date(userConsent))
    },
    async acceptConsent() {
      this.isConsentModalVisible = false
      const response = await UserService.updateUserConsent()
      if (response.status === 200) {
        this.isConsentModalVisible = false
        const verify = await UserService.verifyEmail()
        if (verify.status === 200) {
          this.router.push({ name: 'posts' })
        }
      }
    },
  },
})
</script>

<style>
#consent-modal {
  z-index: 9999999999;
}
</style>
