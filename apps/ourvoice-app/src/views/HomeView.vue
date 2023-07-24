<template>
  <div class="container flex lg:flex-row items-center gap-12 mt-14 lg:mt-28">
    <!-- Content -->
    <div class="flex basis-1/2 flex-col items-center lg:items-start">
      <div v-if="!session" class="">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">OurVoice</span>
          <img class="h-8 w-auto" src="@/assets/ourvoice_logo_black.png" alt="OurVoice Logo" />
        </a>
      </div>
      <!-- Deployment slogan -->
      <p class="text-center lg:text-left mb-6 slogan-text">
        {{ getConfig('slogan') }}
      </p>
      <!-- Deployment description -->
      <Description class="description-text text-lg text-center lg:text-left mb-6" />
      <div class="flex justify-center space-x-2">
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

    <!-- Deployment image -->
    <!-- <div class="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10">
      <img
        class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
        :src="getConfig('logo')"
        alt="OurVoice interface"
      />
    </div> -->
    <div class="basis-1/2">
      <img
        class="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:h-5/6 md:h-5/6"
        :src="getConfig('logo')"
        alt="OurVoice interface"
      />
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
.slogan-text {
  align-self: stretch;
  color: var(--headings, #1a1a1a);
  /* Desktop/H1 */
  font-family: Roboto;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 57.6px */
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
