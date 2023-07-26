<template>
  <!-- Consent Modal -->
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    id="my-modal"
    v-show="isConsentModalVisible"
  >
    <!-- consent modal content-->
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Consent Form</h3>
        <div class="mt-2 px-7 py-3">
          <Consent class="text-ourvoice-grey text-lg text-center lg:text-left mb-6" ref="consent" />
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
      const userConsent = await this.userStore.getConsent
      this.isConsentModalVisible =
        !userConsent || this.consentEffectiveDate > userConsent ? true : false
    },
    acceptConsent: async function () {
      const response = await UserService.updateUserConsent()
      if (response.status === 200) {
        this.isConsentModalVisible = false
      }
    }
  },
  async mounted() {
    // get consent effective date
    this.consentEffectiveDate =
      new Date((this.$refs['consent'] as any).frontmatter.effective_date) || null
    this.checkForConsent()
  }
})
</script>

<style></style>

function ref(arg0: boolean) { throw new Error("Function not implemented."); }
