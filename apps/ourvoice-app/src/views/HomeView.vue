<template>
  <div class="grid grid-cols-full md:grid-cols-2">
    <!-- Content -->
    <div class="flex flex-col justify-center items-start px-16 h-full">
      <div v-if="!session">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">OurVoice</span>
          <img
            class="h-8 w-auto mb-16"
            src="@/assets/logo/ourvoice_logo_primary_dark.svg"
            alt="OurVoice Logo"
          />
        </a>
      </div>
      <!-- Deployment slogan -->
      <p class="text-center md:text-left mb-6 text-4xl lg:text-5xl text-ourvoice-black leading-20 font-bold">
        {{ getConfig('slogan') }}
      </p>
      <!-- Deployment description -->
      <Description class="description-text text-lg text-left mb-6" />
      <div class="flex flex-wrap gap-2 justify-center mx-auto md:mx-0">
        <a v-if="!session" :href="authURL"
          ><button type="button" class="ourvoice-button-active">Get Started</button></a
        >
        <a v-else href="/posts"
          ><button type="button" class="ourvoice-button-active">Get Started</button></a
        >
        <a
          class="btn-flat white-text waves-effect waves-light btn-large blue darken-3"
          href="/about"
          ><button type="button" class="ourvoice-button">FAQ</button></a
        >
      </div>
      <!-- Deployment info -->
      <!-- <Information class="text-ourvoice-grey text-lg text-center lg:text-left mb-6" /> -->
    </div>
    <div class="hidden md:inline-flex">
      <img class="h-[100vh] w-full" :src="getConfig('logo')" alt="OurVoice interface" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'

import YamlContent from '../../../../config/config.yml'
import Description from '../../../../config/content/description.md'
// import Information from '../../../../config/content/information.md'

import { useDeploymentStore } from '../stores/deployment'
import config from '../config'
import { mapStores } from 'pinia'
import { useUserStore } from '../stores/user'

const apiURL = config.apiURL
const authBaseURL = config.authURL + '/signinWithoutPassword'

export default defineComponent({
  components: {
    Description
    // Information
    // Consent
  },
  props: ['deployment'],
  data() {
    return {
      // if session is false, we show a blank screen
      // else we render the UI
      session: false,
      userId: '',
      authURL: `${authBaseURL}?d=${this.deployment}`,
      deploymentStore: useDeploymentStore()
    }
  },
  computed: {
    ...mapStores(useUserStore)
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
    }
  },

  async mounted() {
    await this.checkForSession()
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
.description-text {
  align-self: stretch;
  color: var(--body-text, #3d3d3d);
  /* Desktop/Caption_Regular */
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
}
.ourvoice-button-active {
  display: flex;
  width: 212px;
  padding: 16px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 96px;
  background: var(--primary, #ffcd29);
}
.ourvoice-button {
  display: flex;
  width: 212px;
  padding: 16px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 96px;
  border: 2px solid var(--headings, #1a1a1a);
  background: #fff;
}
</style>
