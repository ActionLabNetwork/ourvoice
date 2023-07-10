<template>
  <div class="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28 fill">
    <!-- Content -->
    <div class="flex fill flex-1 flex-col items-center lg:items-start">
      <h1 class="text-ourvoice-blue text-5xl md:text-6 lg:text-6xl text-center lg:text-left mb-6">
        <span class="text-ourvoice-red">OurVoice</span> {{ deployment.toUpperCase() }} App
      </h1>
      <!-- Deployment description -->
      <Description class="text-ourvoice-grey text-lg text-center lg:text-left mb-6" />
      <!-- Deployment slogan -->
      <p class="text-ourvoice-grey text-lg text-center lg:text-left mb-6">
        {{ getConfig('slogan') }}
      </p>
      <div v-if="!session" class="flex justify-center flex-wrap gap-6">
        <a :href="authURL"
          ><button type="button" class="btn btn-purple btn-hover">Get Started</button></a
        >
      </div>
      <div v-else class="flex justify-center flex-wrap gap-6">
        <a href="/noauth/post"
          ><button type="button" class="btn btn-purple btn-hover">Get Started</button></a
        >
      </div>
      <!-- Deployment info -->
      <Information class="text-ourvoice-grey text-lg text-center lg:text-left mb-6" />
      <a class="btn-flat white-text waves-effect waves-light btn-large blue darken-3" href="/about"
        ><button type="button" class="btn btn-purple btn-hover">Learn More</button></a
      >
    </div>

    <!-- Deployment image -->
    <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
      <img
        class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
        :src="getConfig('logo')"
        alt="OurVoice interface"
      />
    </div>

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
            <Consent class="text-ourvoice-grey text-lg text-center lg:text-left mb-6" />
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'

import YamlContent from '../../../../config/config.yml'
import Description from '../../../../config/content/description.md'
import Information from '../../../../config/content/information.md'
import Consent from '../../../../config/content/consent.md'

import UserService from '@/services/user-service'

import { useDeploymentStore } from '@/stores/deployment'
import config from '@/config'

const apiURL = config.apiURL
const authBaseURL = config.authURL + '/signinWithoutPassword'

export default defineComponent({
  components: {
    Description,
    Information,
    Consent
  },
  props: ['deployment'],
  data() {
    return {
      // if session is false, we show a blank screen
      // else we render the UI
      session: false,
      userId: '',
      authURL: `${authBaseURL}?d=${this.deployment}`,
      deploymentStore: useDeploymentStore(),
      isConsentModalVisible: false
    }
  },
  methods: {
    // TODO: this list might be coming from the database later
    getConfig(option: string) {
      return YamlContent[option]
    },
    checkForSession: async function () {
      if (!(await Session.doesSessionExist())) return
      let validationErrors = await Session.validateClaims()

      if (validationErrors.length === 0) {
        // user has verified their email address
        const userId = await Session.getUserId()
        // this will render the UI
        this.session = true
        this.userId = userId
      } else {
        for (const err of validationErrors) {
          if (err.validatorId === EmailVerificationClaim.id) {
            // email is not verified
            window.location.href = this.authURL
          }
        }
      }
    },
    callAPI: async function () {
      const response = await fetch(`${apiURL}/sessioninfo`)

      if (response.status === 401) {
        // this means that the session has expired and the
        // user needs to relogin.
        window.location.href = this.authURL
        return
      }

      const json = await response.json()

      window.alert('Session Information:\n' + JSON.stringify(json, null, 2))
    },
    checkForConsent: async function () {
      let payload = await Session.getAccessTokenPayloadSecurely()
      if (!payload.consent) this.isConsentModalVisible = true
    },
    acceptConsent: async function () {
      const response = await UserService.updateUserConsent()
      if (response.status === 200) {
        this.isConsentModalVisible = false
      }
    }
  },

  async mounted() {
    // this function checks if a session exists, and if not,
    // it will redirect to the login screen.
    await this.checkForSession()
    await this.checkForConsent()
  }
})
</script>

<style scoped>
.fill {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.top-bar {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: flex-end;
  padding-left: 75px;
  padding-right: 75px;
  width: 100%;
}

.sign-out {
  display: flex;
  width: 116px;
  height: 42px;
  background-color: black;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
</style>
